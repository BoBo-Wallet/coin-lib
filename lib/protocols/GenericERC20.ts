import { EthereumProtocol } from './EthereumProtocol'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { IAirGapTransaction } from '../interfaces/IAirGapTransaction'
import { rejects } from 'assert'
import * as abiDecoder from 'abi-decoder'
import { RawEthereumTransaction, UnsignedEthereumTransaction } from '../serializer/unsigned-transactions/ethereum-transactions.serializer'
import { UnsignedTransaction } from '../serializer/unsigned-transaction.serializer'
import * as ethUtil from 'ethereumjs-util'
import { SignedEthereumTransaction } from '../serializer/signed-transactions/ethereum-transactions.serializer'
const EthereumTransaction = require('ethereumjs-tx')

const AUTH_TOKEN_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  }
]

abiDecoder.addABI(AUTH_TOKEN_ABI)

export class GenericERC20 extends EthereumProtocol {
  tokenContract: any

  constructor(contractAddress, jsonRPCAPI = 'https://mainnet.infura.io/', infoAPI = 'https://api.trustwalletapp.com/', chainId = 1) {
    super(jsonRPCAPI, infoAPI, chainId) // we probably need another network here, explorer is ok
    this.tokenContract = new this.web3.eth.Contract(AUTH_TOKEN_ABI, contractAddress)
  }

  getBalanceOfPublicKey(publicKey: string): Promise<BigNumber> {
    const address = this.getAddressFromPublicKey(publicKey)
    return this.getBalanceOfAddresses([address])
  }

  getBalanceOfAddresses(addresses: string[]): Promise<BigNumber> {
    const promises: Promise<any>[] = []
    for (let address of addresses) {
      promises.push(this.tokenContract.methods.balanceOf(address).call())
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(values => {
          resolve(values.map(obj => new BigNumber(obj)).reduce((a, b) => a.plus(b)))
        })
        .catch(reject)
    })
  }

  signWithPrivateKey(privateKey: Buffer, transaction: RawEthereumTransaction): Promise<string> {
    if (!transaction.data || transaction.data === '0x') {
      transaction.data = this.tokenContract.methods.transfer(transaction.to, transaction.value).encodeABI() // backwards-compatible fix
    }

    return super.signWithPrivateKey(privateKey, transaction)
  }

  prepareTransactionFromPublicKey(
    publicKey: string,
    recipients: string[],
    values: BigNumber[],
    fee: BigNumber
  ): Promise<RawEthereumTransaction> {
    if (recipients.length !== values.length) {
      return Promise.reject('recipients length does not match with values')
    }

    if (recipients.length !== 1) {
      return Promise.reject('you cannot have 0 recipients')
    }

    return new Promise((resolve, reject) => {
      this.getBalanceOfPublicKey(publicKey)
        .then(balance => {
          if (balance.isGreaterThanOrEqualTo(values[0])) {
            super
              .getBalanceOfPublicKey(publicKey)
              .then(ethBalance => {
                const address = this.getAddressFromPublicKey(publicKey)
                this.tokenContract.methods
                  .transfer(recipients[0], this.web3.utils.toHex(values[0]).toString())
                  .estimateGas({ from: address }, (error, gasAmount) => {
                    if (error) {
                      reject(error)
                    }
                    if (ethBalance.isGreaterThanOrEqualTo(fee)) {
                      this.web3.eth.getTransactionCount(address).then(txCount => {
                        const gasPrice = fee.isEqualTo(0) ? new BigNumber(0) : fee.div(gasAmount).integerValue(BigNumber.ROUND_CEIL)
                        const transaction: RawEthereumTransaction = {
                          nonce: this.web3.utils.toHex(txCount),
                          gasLimit: this.web3.utils.toHex(gasAmount),
                          gasPrice: this.web3.utils.toHex(gasPrice.toFixed()),
                          to: this.tokenContract._address,
                          value: this.web3.utils.toHex(new BigNumber(0).toFixed()),
                          chainId: this.chainId,
                          data: this.tokenContract.methods.transfer(recipients[0], this.web3.utils.toHex(values[0]).toString()).encodeABI()
                        }
                        resolve(transaction)
                      })
                    } else {
                      reject('not enough ETH balance')
                    }
                  })
              })
              .catch(reject)
          } else {
            reject('not enough token balance')
          }
        })
        .catch(reject)
    })
  }

  getTransactionsFromAddresses(addresses: string[], limit: number, offset: number): Promise<IAirGapTransaction[]> {
    const airGapTransactions: IAirGapTransaction[] = []
    return new Promise((overallResolve, overallReject) => {
      const promises: Promise<IAirGapTransaction[]>[] = []
      for (let address of addresses) {
        promises.push(
          new Promise((resolve, reject) => {
            axios
              .get(
                this.infoAPI +
                  'transactions?address=' +
                  address +
                  '&contract=' +
                  this.tokenContract.options.address +
                  '&page=' +
                  offset / limit +
                  '&limit=' +
                  limit
              )
              .then(response => {
                const transactionResponse = response.data
                for (const transaction of transactionResponse.docs) {
                  if (transaction.operations.length >= 1) {
                    const transactionPayload = transaction.operations[0]
                    const fee = new BigNumber(transaction.gasUsed).times(new BigNumber(transaction.gasPrice))
                    const airGapTransaction: IAirGapTransaction = {
                      hash: transaction.id,
                      from: [transactionPayload.from],
                      to: [transactionPayload.to],
                      isInbound: transactionPayload.to.toLowerCase() === address.toLowerCase(),
                      blockHeight: transaction.blockNumber,
                      protocolIdentifier: this.identifier,
                      amount: new BigNumber(transactionPayload.value),
                      fee: fee,
                      timestamp: parseInt(transaction.timeStamp, 10)
                    }

                    airGapTransactions.push(airGapTransaction)
                  }
                }

                resolve(airGapTransactions)
              })
              .catch(reject)
          })
        )
      }
      Promise.all(promises)
        .then(values => {
          overallResolve([].concat.apply([], values))
        })
        .catch(rejects)
    })
  }

  getTransactionDetailsFromSigned(signedTx: SignedEthereumTransaction): IAirGapTransaction {
    const ethTx = super.getTransactionDetailsFromSigned(signedTx)

    const extractedTx = new EthereumTransaction(signedTx.transaction)
    const tokenTransferDetails = abiDecoder.decodeMethod('0x' + extractedTx.data.toString('hex'))
    ethTx.to = [ethUtil.toChecksumAddress(tokenTransferDetails.params[0].value)]
    ethTx.amount = new BigNumber(tokenTransferDetails.params[1].value)

    return ethTx
  }

  getTransactionDetails(unsignedTx: UnsignedTransaction): IAirGapTransaction {
    const unsignedEthereumTx = unsignedTx as UnsignedEthereumTransaction
    const ethTx = super.getTransactionDetails(unsignedEthereumTx)

    const tokenTransferDetails = abiDecoder.decodeMethod(unsignedEthereumTx.transaction.data)

    ethTx.to = [ethUtil.toChecksumAddress(tokenTransferDetails.params[0].value)]
    ethTx.amount = new BigNumber(tokenTransferDetails.params[1].value)

    return ethTx
  }
}
