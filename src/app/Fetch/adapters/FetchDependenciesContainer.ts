import { ModelsRepository } from "../domain/ports/ModelRepository";
import { OperatorsRepository } from "../domain/ports/OperatorsRepository";
import { RealModelsRepository } from "./repositories/Model/RealModelsRepository";
import { RealOperatorsRepository } from "./repositories/Operator/RealOperatorsRepository";

export type FetchDependencies = {
    operatorsRepository: OperatorsRepository;
    modelsRepository: ModelsRepository;

  } 

export class FetchDependenciesContainer{
    private static instance: FetchDependenciesContainer
    public dependencies: FetchDependencies = {
        operatorsRepository:new RealOperatorsRepository(),
        modelsRepository:new RealModelsRepository()
          
    }

    private constructor(){}

    public static getInstance():FetchDependenciesContainer{
        if (!FetchDependenciesContainer.instance) FetchDependenciesContainer.instance = new FetchDependenciesContainer();
        return FetchDependenciesContainer.instance;
    }
}