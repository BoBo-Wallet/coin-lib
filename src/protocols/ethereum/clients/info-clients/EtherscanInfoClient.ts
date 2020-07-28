import Axios from '../../../../dependencies/src/axios-0.19.0/index'
import { BigNumber } from '../../../../dependencies/src/bignumber.js-9.0.0/bignumber'
import { IAirGapTransaction } from '../../../../interfaces/IAirGapTransaction'
import { EthereumProtocol } from '../../EthereumProtocol'
import { BLOCK_EXPLORER_API } from '../../EthereumProtocolOptions'

import { EthereumInfoClient } from './InfoClient'

export class EtherscanInfoClient extends EthereumInfoClient {
  constructor(baseURL: string = BLOCK_EXPLORER_API) {
    super(baseURL)
  }

  public async fetchTransactions(protocol: EthereumProtocol, address: string, page: number, limit: number): Promise<IAirGapTransaction[]> {
    const airGapTransactions: IAirGapTransaction[] = []

    const response = await Axios.get(
      `${this.baseURL}/api?module=account&action=txlist&address=${address}&page=${page}&offset=${limit}&sort=desc&apiKey=P63MEHEYBM5BGEG5WFN76VPNCET8B2MAP7`
    )
    const transactionResponse = response.data
    for (const transaction of transactionResponse.result) {
      const fee: BigNumber = new BigNumber(transaction.gas).times(new BigNumber(transaction.gasPrice))
      const airGapTransaction: IAirGapTransaction = {
        hash: transaction.hash,
        from: [transaction.from],
        to: [transaction.to],
        isInbound: transaction.to.toLowerCase() === address.toLowerCase(),
        amount: new BigNumber(transaction.value).toString(10),
        fee: fee.toString(10),
        blockHeight: transaction.blockNumber,
        protocolIdentifier: protocol.identifier,
        network: protocol.options.network,
        timestamp: parseInt(transaction.timeStamp, 10)
      }

      airGapTransactions.push(airGapTransaction)
    }

    return airGapTransactions
  }

  public async fetchContractTransactions(
    protocol: EthereumProtocol,
    contractAddress: string,
    address: string,
    page: number,
    limit: number
  ): Promise<IAirGapTransaction[]> {
    const airGapTransactions: IAirGapTransaction[] = []

    const response = await Axios.get(
      `${this.baseURL}/api?module=account&action=tokentx&address=${address}&contractAddress=${contractAddress}&page=${page}&offset=${limit}&sort=desc&apiKey=P63MEHEYBM5BGEG5WFN76VPNCET8B2MAP7`
    )
    const transactionResponse = response.data
    for (const transaction of transactionResponse.result) {
      const fee: BigNumber = new BigNumber(transaction.gas).times(new BigNumber(transaction.gasPrice))
      const airGapTransaction: IAirGapTransaction = {
        hash: transaction.hash,
        from: [transaction.from],
        to: [transaction.to],
        isInbound: transaction.to.toLowerCase() === address.toLowerCase(),
        blockHeight: transaction.blockNumber,
        protocolIdentifier: protocol.identifier,
        network: protocol.options.network,
        amount: new BigNumber(transaction.value).toString(10),
        fee: fee.toString(10),
        timestamp: parseInt(transaction.timeStamp, 10)
      }

      airGapTransactions.push(airGapTransaction)
    }

    return airGapTransactions
  }
}
