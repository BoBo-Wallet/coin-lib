import { SCALEClass } from '../../scale/type/SCALEClass'
import { SCALEString } from '../../scale/type/SCALEString'
import { SCALEArray } from '../../scale/type/SCALEArray'
import { SCALEDecodeResult } from '../../scale/SCALEDecoder'
import { SCALEDecoder } from '../../scale/SCALEDecoder'

class MetadataCallArgument extends SCALEClass {

    public static decode(raw: string): SCALEDecodeResult<MetadataCallArgument> {
        const decoder = new SCALEDecoder(raw)

        const name = decoder.decodeNextString()
        const type = decoder.decodeNextString()

        return {
            bytesDecoded: name.bytesDecoded + type.bytesDecoded,
            decoded: new MetadataCallArgument(name.decoded, type.decoded)
        }
    }

    protected scaleFields = [this.name, this.type]

    private constructor(
        readonly name: SCALEString,
        readonly type: SCALEString
    ) { super() }
}

export class MetadataCall extends SCALEClass {

    public static decode(raw: string): SCALEDecodeResult<MetadataCall> {
        const decoder = new SCALEDecoder(raw)

        const name = decoder.decodeNextString()
        const args = decoder.decodeNextArray(MetadataCallArgument.decode)
        const docs = decoder.decodeNextArray(SCALEString.decode)

        return {
            bytesDecoded: name.bytesDecoded + args.bytesDecoded + docs.bytesDecoded,
            decoded: new MetadataCall(name.decoded, args.decoded, docs.decoded)
        }
    }
    
    protected scaleFields = [this.name, this.args]

    private constructor(
        readonly name: SCALEString,
        readonly args: SCALEArray<MetadataCallArgument>,
        readonly docs: SCALEArray<SCALEString>
    ) { super() }
}