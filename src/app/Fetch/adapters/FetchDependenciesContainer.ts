import { ErpRepository } from "../domain/ports/ErpRepository";
import { InMemoryErpRepository } from "./repositories/InMemoryErpRepository";


export type FetchDependencies = {
    erpRepository:ErpRepository,

  } 

export class FetchDependenciesContainer{
    private static instance: FetchDependenciesContainer
    public dependencies: FetchDependencies = {
        erpRepository: new InMemoryErpRepository(),
          
    }

    private constructor(){}

    public static getInstance():FetchDependenciesContainer{
        if (!FetchDependenciesContainer.instance) FetchDependenciesContainer.instance = new FetchDependenciesContainer();
        return FetchDependenciesContainer.instance;
    }
}