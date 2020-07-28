import * as sinon from 'sinon'

import BigNumber from '../../../src/dependencies/src/bignumber.js-9.0.0/bignumber'
import { GenericERC20 } from '../../../src/protocols/ethereum/erc20/GenericERC20'
import { EthereumProtocol } from '../../../src/protocols/ethereum/EthereumProtocol'
import { ProtocolHTTPStub, TestProtocolSpec } from '../implementations'

export class GenericERC20ProtocolStub implements ProtocolHTTPStub {
  public registerStub(testProtocolSpec: TestProtocolSpec, protocol: EthereumProtocol) {
    sinon
      .stub(Object.getPrototypeOf(Object.getPrototypeOf(protocol)), 'getBalanceOfPublicKey')
      .withArgs(sinon.match.any)
      .returns(Promise.resolve(new BigNumber(100000000000000000000)))

    sinon
      .stub(protocol, 'getBalanceOfPublicKey')
      .withArgs(sinon.match.any)
      .returns(Promise.resolve(new BigNumber(100000000000000000000)))

    sinon
      .stub(protocol.options.nodeClient, 'fetchTransactionCount')
      .withArgs(testProtocolSpec.wallet.addresses[0])
      .returns(Promise.resolve(80))

    sinon
      .stub(protocol.options.nodeClient, 'fetchBalance')
      .withArgs(testProtocolSpec.wallet.addresses[0])
      .returns(Promise.resolve('100000000000000000000'))

    sinon
      .stub(protocol, 'estimateGas')
      .withArgs(sinon.match.any)
      .returns(Promise.resolve(new BigNumber('31705')))
  }
  public noBalanceStub(testProtocolSpec: TestProtocolSpec, protocol: GenericERC20) {
    sinon
      .stub(Object.getPrototypeOf(Object.getPrototypeOf(protocol)), 'getBalanceOfPublicKey')
      .withArgs(sinon.match.any)
      .returns(Promise.resolve(new BigNumber(0)))

    sinon
      .stub(protocol, 'getBalanceOfPublicKey')
      .withArgs(sinon.match.any)
      .returns(Promise.resolve(new BigNumber(0)))

    sinon
      .stub(protocol, 'estimateGas')
      .withArgs(sinon.match.any)
      .returns(Promise.resolve(new BigNumber(0)))
  }
}
