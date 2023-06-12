export interface UseCase<S, T> {
    execute(params: S, ...props: any): T;
  }