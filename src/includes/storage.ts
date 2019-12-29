import dotProp from 'dot-prop'

interface StorageOptions {
  defaultValue?: LooseObject;
  onSync?(this: Storage): void;
}

export default class Storage {
  private readonly key: string
  private readonly opts: StorageOptions
  private storage: LooseObject

  constructor (key: string, opts?: StorageOptions) {
    this.key = key
    this.opts = opts || {}
    this.storage = GM_getValue<LooseObject>(key, opts.defaultValue)
  }

  sync () {
    GM_setValue(this.key, this.storage)

    if (this.opts.onSync) {
      this.opts.onSync.apply(this)
    }
  }

  get<T = Storable> (key: string) {
    return dotProp.get<T>(this.storage, key) || dotProp.get<T>(this.opts.defaultValue, key)
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
