// tslint:disable:max-classes-per-file

import { ProtocolBlockExplorer } from '../../../utils/ProtocolBlockExplorer'
import { NetworkType, ProtocolNetwork } from '../../../utils/ProtocolNetwork'
import { SubstrateNetwork } from '../SubstrateNetwork'
import { PolkascanBlockExplorer, SubstrateProtocolConfig, SubstrateProtocolOptions } from '../SubstrateProtocolOptions'

const MAINNET_NAME: string = 'Mainnet'

const NODE_URL: string = 'https://polkadot-node.prod.gke.papers.tech'

const BLOCK_EXPLORER_URL: string = 'https://polkascan.io/polkadot'
const BLOCK_EXPLORER_API: string = 'https://polkadot.subscan.io/api/scan'

export class PolkadotProtocolNetworkExtras {
  constructor(public readonly apiUrl: string = BLOCK_EXPLORER_API, public readonly network: SubstrateNetwork = SubstrateNetwork.POLKADOT) {}
}

export class PolkadotPolkascanBlockExplorer extends PolkascanBlockExplorer {
  constructor(blockExplorer: string = BLOCK_EXPLORER_URL) {
    super(blockExplorer)
  }
}

export class PolkadotProtocolConfig extends SubstrateProtocolConfig {
  constructor() {
    super()
  }
}

export class PolkadotProtocolNetwork extends ProtocolNetwork<PolkadotProtocolNetworkExtras> {
  constructor(
    name: string = MAINNET_NAME,
    type: NetworkType = NetworkType.MAINNET,
    rpcUrl: string = NODE_URL,
    blockExplorer: ProtocolBlockExplorer = new PolkadotPolkascanBlockExplorer(),
    extras: PolkadotProtocolNetworkExtras = new PolkadotProtocolNetworkExtras()
  ) {
    super(name, type, rpcUrl, blockExplorer, extras)
  }
}

export class PolkadotProtocolOptions extends SubstrateProtocolOptions<PolkadotProtocolConfig> {
  constructor(
    public readonly network: PolkadotProtocolNetwork = new PolkadotProtocolNetwork(),
    public readonly config: PolkadotProtocolConfig = new PolkadotProtocolConfig()
  ) {
    super(network, config)
  }
}
