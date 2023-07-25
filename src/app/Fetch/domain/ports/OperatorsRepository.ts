import { Operator } from "../Operator";

export interface OperatorsRepository {
  getAllOpertors(): Promise<Operator[] | null>;
}
