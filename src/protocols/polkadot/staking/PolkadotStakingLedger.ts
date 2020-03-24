import { SCALEDecoder } from '../node/codec/SCALEDecoder'
import { SCALETuple } from '../node/codec/type/SCALETuple'
import { SCALEAccountId } from '../node/codec/type/SCALEAccountId'
import { SCALEArray } from '../node/codec/type/SCALEArray'
import { SCALECompactInt } from '../node/codec/type/SCALECompactInt'
import BigNumber from '../../../dependencies/src/bignumber.js-9.0.0/bignumber'

interface LockedInfo {
    value: BigNumber
    expectedUnlock: BigNumber
}

export interface PolkadotStakingInfo {
    total: BigNumber
    active: BigNumber
    unlocked: BigNumber
    locked: LockedInfo[]
}

export class PolkadotStakingLedger {
    public static decode(raw: string): PolkadotStakingLedger {
        const decoder = new SCALEDecoder(raw)

        const stash = decoder.decodeNextAccountId()
        const total = decoder.decodeNextCompactInt()
        const active = decoder.decodeNextCompactInt()
        const unlocking = decoder.decodeNextArray(hex => SCALETuple.decode(
            hex, 
            first => SCALECompactInt.decode(first),
            second => SCALECompactInt.decode(second)
        ))
        // TODO: decode last reward, couldn't find docs and have no idea what type it is

        return new PolkadotStakingLedger(stash.decoded, total.decoded, active.decoded, unlocking.decoded)
    }

    private constructor(
        readonly stash: SCALEAccountId,
        readonly total: SCALECompactInt,
        readonly active: SCALECompactInt,
        readonly unlocking: SCALEArray<SCALETuple<SCALECompactInt, SCALECompactInt>>
    ) {}
    
}