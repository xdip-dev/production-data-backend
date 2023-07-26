import { Model } from "../Model";

export interface ModelsRepository {
  getAllModels(): Promise<Model[]|null>;
}