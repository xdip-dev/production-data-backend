import { OperatorsRepository } from "../domain/ports/OperatorsRepository";
import { InMemoryOperatorsRepository } from "./repositories/Operator/InMemoryOperatorsRepository";
import { RealOperatorsRepository } from "./repositories/Operator/RealOperatorsRepository";

export type FetchDependencies = {
    operatorsRepository: OperatorsRepository;

  } 

export class FetchDependenciesContainer{
    private static instance: FetchDependenciesContainer
    public dependencies: FetchDependencies = {
        operatorsRepository:new RealOperatorsRepository(),
          
    }

    private constructor(){}

    public static getInstance():FetchDependenciesContainer{
        if (!FetchDependenciesContainer.instance) FetchDependenciesContainer.instance = new FetchDependenciesContainer();
        return FetchDependenciesContainer.instance;
    }
}