import {
  SerializedSyncProtocolTransaction,
  SyncProtocolUnsignedTransactionKeys,
  UnsignedTransaction,
  UnsignedTransactionSerializer
} from '../unsigned-transaction.serializer'
import { toBuffer } from '../utils/toBuffer'

export type SerializedUnsignedHarmonyTransaction = [Buffer, Buffer]

export interface RawHarmonyTransaction {
  networkId: string
  transaction: string
}

export interface UnsignedHarmonyTransaction extends UnsignedTransaction {
  transaction: RawHarmonyTransaction
}

export class HarmonyUnsignedTransactionSerializer extends UnsignedTransactionSerializer {
  public serialize(transaction: UnsignedHarmonyTransaction): SerializedSyncProtocolTransaction {
    const serializedTx: SerializedSyncProtocolTransaction = toBuffer([
      [transaction.transaction.networkId, transaction.transaction.transaction],
      transaction.publicKey, // publicKey
      transaction.callback ? transaction.callback : 'bobo-wallet://?d=' // callback-scheme
    ]) as SerializedSyncProtocolTransaction

    return serializedTx
  }

  public deserialize(serializedTx: SerializedSyncProtocolTransaction): UnsignedHarmonyTransaction {
    const unsignedHarmonyTx: UnsignedHarmonyTransaction = {
      publicKey: serializedTx[SyncProtocolUnsignedTransactionKeys.PUBLIC_KEY].toString(),
      transaction: {
        networkId: (serializedTx[SyncProtocolUnsignedTransactionKeys.UNSIGNED_TRANSACTION][0] as Buffer).toString(),
        transaction: (serializedTx[SyncProtocolUnsignedTransactionKeys.UNSIGNED_TRANSACTION][1] as Buffer).toString()
      },
      callback: serializedTx[SyncProtocolUnsignedTransactionKeys.CALLBACK].toString()
    }

    return unsignedHarmonyTx
  }
}
