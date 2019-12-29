// eslint-disable-next-line
interface LooseObject<T = any> {
  [key: string]: T;
}

interface Component {
  onCreate(): void;
  onDestroy(): void;
}
