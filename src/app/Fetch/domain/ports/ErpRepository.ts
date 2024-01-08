import { Model } from "../Model";
import { Operator } from "../Operator";

export interface ErpRepository {
  getAllModels(): Promise<Model[]|null>;
  getAllOpertors(): Promise<Operator[] | null>;

}