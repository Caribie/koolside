import dotProp from 'dot-prop'

interface StorageOptions {
  defaultValue?: LooseObject;
  onSync?(this: Storage): void;
}

export default class Storage {
  public readonly key: string
  public readonly opts: StorageOptions
  private storage: LooseObject

  constructor (key: string, opts?: StorageOptions) {
    opts = opts || {}
    opts.defaultValue = opts.defaultValue || {}

    this.key = key
    this.opts = opts
    this.storage = GM_getValue<LooseObject>(key, opts.defaultValue)
  }

  reset () {
    GM_setValue(this.key, this.opts.defaultValue)
    this.storage = this.opts.defaultValue
  }

  sync () {
    GM_setValue(this.key, this.storage)

    if (this.opts.onSync) {
      this.opts.onSync.apply(this)
    }
  }

  get<T = Storable> (key: string) {
    const value = dotProp.get<T>(this.storage, key)
    const defaultValue = dotProp.get<T>(this.opts.defaultValue, key)

    if ([undefined, null].includes(value)) {
      return defaultValue
    }

    if (typeof value !== typeof defaultValue) {
      console.warn(`Storage ${key} mismatched, set to default (${value} !== ${defaultValue})`)
      this.set(key, defaultValue)
      return defaultValue
    }

    return value
  }

  set (key: string, value: Storable) {
    dotProp.set(this.storage, key, value)
    this.sync()
  }

  export () {
    return this.storage
  }

  import (value: LooseObject) {
    this.storage = value
    this.sync()
  }
}
