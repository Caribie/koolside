interface GM_Response {
  responseText: string;
  responseJSON: string;
  readyState: number;
  responseHeaders?: string;
  status?: number;
  statusText?: string;
  finalUrl?: string;
}

interface GM_ResponseProgress extends Response {
  lengthComputable: boolean;
  loaded: number;
  total: number;
}

interface GM_RequestInfo {
  method?: 'GET' | 'POST';
  url: string;
  onload?(response: GM_Response): void;
  onprogress?(response: GM_ResponseProgress): void;
  onerror?(response: GM_Response): void;
  onreadystatechange?(response: GM_Response): void;
  data?: string;
  headers?: LooseObject<string>;
  binary?: boolean;
  makePrivate?: boolean;
  mozBackgroundRequest?: boolean;
  user?: string;
  password?: string;
  overrideMimeType?: boolean;
  ignoreCase?: boolean;
  ignoreRedirect?: boolean;
  ignoreTempRedirect?: boolean;
  ignorePermanentRedirect?: boolean;
  failOnRedirect?: boolean;
  redirectionLimit?: number;
  timeout?: number;
}

/**
 * GM_xmlhttpRequest is a cross-origin version of XMLHttpRequest. 
 * The beauty of this function is that a user script can make requests that do not use the same-origin policy, creating opportunities for powerful mashups.
 */
declare function GM_xmlhttpRequest(options: GM_RequestInfo): void

/**
 * Retrieves a value for current script from storage.
 * @param key The name for value to load.
 * @param defaultValue The default value to return if no value exists in the storage.
 */
declare function GM_getValue<T = Storable>(key: string, defaultValue?: T): T

/**
 * Sets a key / value pair for current script to storage.
 * @param key The unique name for value within this script.
 * @param value The value to be stored, which must be JSON serializable (string, number, boolean, null, or an array/object consisting of these types) so for example you can't store DOM elements or objects with cyclic dependencies.
 */
declare function GM_setValue(key: string, value: Storable): void

/**
 * Deletes an existing key / value pair for current script from storage.
 * @param key The unique name for value within this script.
 */
declare function GM_deleteValue(key: string): void

/**
 * Returns an array of keys of all available values within this script.
 */
// eslint-disable-next-line
declare function GM_listValues<T = Storable>(): T

// eslint-disable-next-line
declare type Storable = LooseObject | any[] | string | number | boolean | null
