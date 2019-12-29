// eslint-disable-next-line
interface LooseObject<T = any> {
  [key: string]: T;
}

interface Component {
  create(): void;
  destroy(): void;
}
