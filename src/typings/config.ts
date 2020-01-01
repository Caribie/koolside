
interface Config {
  /** 이름 */
  name: string;

  /** 설명 */
  description?: string;

  /** 값 수정 됐을 때 실행할 함수 */
  // eslint-disable-next-line
  onChange?<T = any>(oldValue: T, newValue: T): void;
}

interface ConfigRecursive extends Config {
  set: ConfigSet;
}

interface ConfigString extends Config {
  /** 기본 값 */
  default: string;

  /** 값이 없을 때 보여질 내용 */
  placeholder?: string;

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
