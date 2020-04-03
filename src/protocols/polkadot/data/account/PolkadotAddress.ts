import bs58 = require('../../../../dependencies/src/bs58-4.0.1')
import { hexToBytes, isHex } from '../../../../utils/hex'
import { blake2bAsBytes } from '../../../../utils/blake2b'
import { isString } from 'util'
 
// If changed, the test address in `test/protocols/specs/polkadot.ts` must be changed accordingly
enum SS58_Format {
    POLKADOT_LIVE = 0,
    KUSAMA = 2,
    SUBSTRATE = 42
}
const SS58_PREFIX = 'SS58PRE'

export type PolkadotAccountId = string | PolkadotAddress

/* 
 * An address doesn't have a fixed length. Interpretation:
 * [total bytes: version bytes, payload bytes, checksum bytes]
 * 3:  1, 1,  1
 * 4:  1, 2,  1
 * 6:  1, 4,  1
 * 35: 1, 32, 2
 */
export class PolkadotAddress {
    private static placeholder: PolkadotAddress | undefined
    public static createPlaceholder(): PolkadotAddress {
        if (!PolkadotAddress.placeholder) {
            const payload = new Uint8Array(32)
            payload.fill(0)

            PolkadotAddress.placeholder = new PolkadotAddress(
                Buffer.from([0]), 
                Buffer.from(payload), 
                Buffer.from([0, 0])
            )
        }

        return PolkadotAddress.placeholder
    }

    public static from(accountId: PolkadotAccountId): PolkadotAddress {
        if (isString(accountId) && isHex(accountId)) {
            return this.fromPublicKey(accountId)
        } else if (isString(accountId)) {
            return this.fromEncoded(accountId)
        } else {
            return accountId
        }
    }

    public static fromPublicKey(payload: Buffer | Uint8Array | string, format: SS58_Format = SS58_Format.KUSAMA): PolkadotAddress {
        return this.fromPayload(hexToBytes(payload), format)
    }

    public static fromEncoded(encoded: string): PolkadotAddress {
        return this.fromBytes(bs58.decode(encoded))
    }

    private static fromBytes(bytes: Buffer | Uint8Array): PolkadotAddress {
        const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes)
        const checksumBytes = buffer.length === 35 ? 2 : 1

        const version = buffer.slice(0, 1)
        const payload = buffer.slice(1, -checksumBytes)
        const checksum = buffer.slice(-checksumBytes)

        return new PolkadotAddress(version, payload, checksum)
    }

    private static fromPayload(payload: Buffer, format: number) {
        const version = Buffer.from([format])
        const checksum = this.generateChecksum(Buffer.concat([version, payload]))
        const checksumBytes = payload.length === 32 ? 2 : 1

        return new PolkadotAddress(version, payload, checksum.slice(0, checksumBytes))
    }

    private static generateChecksum(input: Buffer): Buffer {
        const prefixBuffer = Buffer.from(SS58_PREFIX)
        return Buffer.from(blake2bAsBytes(Buffer.concat([prefixBuffer, input]), 512))
    }

    private encoded: string | null = null

    constructor(readonly version: Buffer, readonly payload: Buffer, readonly checksum: Buffer) {}

    public compare(other: PolkadotAccountId): number {
        return this.payload.compare(PolkadotAddress.from(other).payload)
    }

    public toString(): string {
        if (!this.encoded) {
            this.encoded = bs58.encode(Buffer.concat([this.version, this.payload, this.checksum]))
        }
        return this.encoded!
    }

    public getBufferPublicKey(): Buffer {
        return this.payload
    }

    public getHexPublicKey(): string {
        return this.payload.toString('hex')
    }
}