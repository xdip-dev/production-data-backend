export interface UseCase<S, T> {
    execute(props: S, ...param: any): T;
  }