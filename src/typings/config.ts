
interface ConfigItem<T = ConfigStorable> {
  /** 이름 */
  name: string;

  /** 설명 */
  description?: string;

  default: T;

  /** 값을 가져올 때 한번 거칠 함수 */
  // eslint-disable-next-line
  format?: (v: any) => any;

  /** 값 수정 됐을 때 실행할 함수 */
  // eslint-disable-next-line
  onUpdate? (oldValue: any, newValue: any): void;
}

interface ConfigRecursive {
  /** 이름 */
  name: string;

  /** 설명 */
  description?: string;

  items: LooseObject<ConfigRecursive|ConfigTypes>;
}

interface ConfigString extends ConfigItem<string> {
  /** 값이 없을 때 보여질 내용 */
  placeholder?: string;

  /** 설정에 <textarea> 태그를 사용할지? */
  textarea?: boolean;
}

interface ConfigNumber extends ConfigItem<number> {
  /** 최소 값 */
  min?: number;

  /** 최대 값 */
  max?: number;

  /** 단계 */
  step?: number;
}

interface ConfigBoolean extends ConfigItem<boolean> {
  /** 참일 시 body 에 추가될 클래스 명 */
  class?: string;
}

type ConfigTypes = ConfigString | ConfigNumber | ConfigBoolean
type ConfigStorable = string | number | boolean
