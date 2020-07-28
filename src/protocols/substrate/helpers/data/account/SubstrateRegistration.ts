import { SubstrateNetwork } from '../../../SubstrateNetwork'
import { SCALEDecoder, SCALEDecodeResult } from '../scale/SCALEDecoder'
import { SCALEArray } from '../scale/type/SCALEArray'
import { SCALEData } from '../scale/type/SCALEData'
import { SCALEEnum } from '../scale/type/SCALEEnum'
import { SCALEHash } from '../scale/type/SCALEHash'
import { SCALEInt } from '../scale/type/SCALEInt'
import { SCALETuple } from '../scale/type/SCALETuple'

enum SubstrateJudgment {
  UNKNOWN = 0,
  FEE_PAID,
  REASONABLE,
  KNOWN_GOOD,
  OUT_OF_DATE,
  LOW_QUALITY,
  ERRORNEOUS
}

export class SubstrateIdentityInfo {
  public static decode(network: SubstrateNetwork, raw: string): SCALEDecodeResult<SubstrateIdentityInfo> {
    const decoder = new SCALEDecoder(network, raw)

    const additional = decoder.decodeNextArray((network, hex) =>
      SCALETuple.decode(
        network,
        hex,
        (_, hex) => SCALEData.decode(hex),
        (_, hex) => SCALEData.decode(hex)
      )
    )
    const display = decoder.decodeNextData()
    const legal = decoder.decodeNextData()
    const web = decoder.decodeNextData()
    const riot = decoder.decodeNextData()
    const email = decoder.decodeNextData()
    const fingerprint = decoder.decodeNextOptional((_, hex) => SCALEHash.decode(hex, 20))
    const image = decoder.decodeNextData()
    const twitter = decoder.decodeNextData()

    return {
      bytesDecoded:
        additional.bytesDecoded +
        display.bytesDecoded +
        legal.bytesDecoded +
        web.bytesDecoded +
        riot.bytesDecoded +
        email.bytesDecoded +
        fingerprint.bytesDecoded +
        image.bytesDecoded +
        twitter.bytesDecoded,
      decoded: new SubstrateIdentityInfo(
        display.decoded,
        legal.decoded,
        web.decoded,
        riot.decoded,
        email.decoded,
        image.decoded,
        twitter.decoded
      )
    }
  }

  private constructor(
    readonly display: SCALEData,
    readonly legal: SCALEData,
    readonly web: SCALEData,
    readonly riot: SCALEData,
    readonly email: SCALEData,
    readonly image: SCALEData,
    readonly twitter: SCALEData
  ) {}
}

export class SubstrateRegistration {
  public static decode(network: SubstrateNetwork, raw: string): SubstrateRegistration {
    const decoder = new SCALEDecoder(network, raw)

    const judgments = decoder.decodeNextArray((network, hex) =>
      SCALETuple.decode(
        network,
        hex,
        (_, first) => SCALEInt.decode(first, 32),
        (_, second) => {
          const value = SCALEEnum.decode(second, (value) => SubstrateJudgment[SubstrateJudgment[value]])
          let bytesDecoded = value.bytesDecoded
          if (value.decoded.value === SubstrateJudgment.FEE_PAID) {
            const balance = SCALEInt.decode(second.slice(0, bytesDecoded * 2), 128)
            bytesDecoded += balance.bytesDecoded
          }

          return {
            bytesDecoded,
            decoded: value.decoded
          }
        }
      )
    )
    const deposit = decoder.decodeNextInt(128)
    const identityInfo = decoder.decodeNextObject(SubstrateIdentityInfo.decode)

    return new SubstrateRegistration(judgments.decoded, deposit.decoded, identityInfo.decoded)
  }

  private constructor(
    readonly judgments: SCALEArray<SCALETuple<SCALEInt, SCALEEnum<SubstrateJudgment>>>,
    readonly deposit: SCALEInt,
    readonly identityInfo: SubstrateIdentityInfo
  ) {}
}
