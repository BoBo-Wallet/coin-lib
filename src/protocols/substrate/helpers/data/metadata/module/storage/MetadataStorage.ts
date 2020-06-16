import { stripHexPrefix } from '../../../../../../../utils/hex'
import { SubstrateNetwork } from '../../../../../SubstrateNetwork'
import { SCALEDecoder, SCALEDecodeResult } from '../../../scale/SCALEDecoder'
import { SCALEArray } from '../../../scale/type/SCALEArray'
import { SCALEClass } from '../../../scale/type/SCALEClass'
import { SCALEString } from '../../../scale/type/SCALEString'

import { MetadataStorageEntry } from './MetadataStorageEntry'

export class MetadataStorage extends SCALEClass {
  public static decode(network: SubstrateNetwork, raw: string): SCALEDecodeResult<MetadataStorage> {
    const decoder = new SCALEDecoder(network, stripHexPrefix(raw))

    const prefix = decoder.decodeNextString()
    const storageEntries = decoder.decodeNextArray(MetadataStorageEntry.decode)

    return {
      bytesDecoded: prefix.bytesDecoded + storageEntries.bytesDecoded,
      decoded: new MetadataStorage(prefix.decoded, storageEntries.decoded)
    }
  }

  protected scaleFields = [this.prefix]

  private constructor(readonly prefix: SCALEString, readonly storageEntries: SCALEArray<MetadataStorageEntry>) {
    super()
  }
}
