// tslint:disable: max-classes-per-file

import { Lazy } from '../../../../../data/Lazy'
import { MichelineDataNode, MichelinePrimitiveApplication } from '../../micheline/MichelineNode'
import { isMichelinePrimitiveApplication } from '../../utils'
import { MichelsonGrammarData } from '../grammar/MichelsonGrammarData'
import { MichelsonType } from '../MichelsonType'

export type MichelsonOptionType = 'Some' | 'None'

export abstract class MichelsonOption extends MichelsonType {
  protected abstract type: MichelsonOptionType

  public static from(value: unknown, mappingFunction?: unknown): MichelsonOption {
    if (value instanceof MichelsonOption) {
      return value
    }

    if (!(value instanceof MichelsonType) && typeof mappingFunction !== 'function') {
      throw new Error('MichelsonOption: unknown generic mapping factory function.')
    }

    return isMichelinePrimitiveApplication(value)
      ? MichelsonOption.fromMicheline(value, mappingFunction)
      : MichelsonOption.fromUnknown(value, mappingFunction)
  }

  public static fromMicheline(micheline: MichelinePrimitiveApplication<MichelsonGrammarData>, mappingFunction: unknown): MichelsonOption {
    return MichelsonOption.fromUnknown(micheline.prim === 'Some' && micheline.args ? micheline.args[0] : null, mappingFunction)
  }

  public static fromUnknown(unknownValue: unknown, mappingFunction: unknown): MichelsonOption {
    if (unknownValue === undefined || unknownValue === null) {
      return new MichelsonNone()
    }

    const lazyValue: Lazy<MichelsonType> = unknownValue instanceof MichelsonType
      ? new Lazy(() => unknownValue)
      : new Lazy(() => {
          const value: unknown = typeof mappingFunction === 'function' ? mappingFunction(unknownValue) : undefined

          if (!(value instanceof MichelsonType)) {
            throw new Error('MichelsonOption: unknown generic mapping type.')
          }

          return value
        })

    return new MichelsonSome(lazyValue)
  }
}

export class MichelsonSome extends MichelsonOption {
  protected type: MichelsonOptionType = 'Some'

  constructor(public readonly value: Lazy<MichelsonType>, name?: string) {
    super(name)
  }

  public asRawValue(): any {
    const value = this.value.get().asRawValue()

    return this.name ? { [this.name]: value } : value
  }

  public toMichelineJSON(): MichelineDataNode {
    return {
      prim: 'Some',
      args: [
        this.value.get().toMichelineJSON()
      ]
    }
  }

  public eval(): void {
    this.value.get()
  }
}

export class MichelsonNone extends MichelsonOption {
  protected type: MichelsonOptionType = 'None'

  public asRawValue(): Record<string, null> | null {
    return this.name ? { [this.name]: null } : null
  }

  public toMichelineJSON(): MichelineDataNode {
    return {
      prim: 'None'
    }
  }
}

