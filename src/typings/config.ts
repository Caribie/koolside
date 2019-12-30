
interface Config {
  /** 이름 */
  name: string;

  /** 설명 */
  description?: string;
}

interface ConfigRecursive extends Config {
  set: ConfigSet;
}

interface ConfigString extends Config {
  /** 기본 값 */
  default: string;

  /** 설정에 <textarea> 태그를 사용할지? */
  textarea?: boolean;
}

interface ConfigNumber extends Config {
  /** 기본 값 */
  default: number;

  /** 최소 값 */
  min?: number;

  /** 최대 값 */
  max?: number;
}

interface ConfigBoolean extends Config {
  /** 기본 값 */
  default: boolean;
}

type ConfigSet = LooseObject<ConfigRecursive | ConfigString | ConfigNumber | ConfigBoolean>
