import { DateService } from "../../shared/date/DateService";
import { InMemoryDateService } from "../../shared/date/InMemoryDateService";
import { RealDateService } from "../../shared/date/RealDateService";
import { IdGenerator } from "../../shared/id-generator/IdGenerator";
import { InMemoryIdGenerator } from "../../shared/id-generator/InMemoryIdGenerator";
import { RealIdGenerator } from "../../shared/id-generator/RealIdGenerator";
import { ActionRepository } from "../domain/ActionRepository";
import { InMemoryActionsRepository } from "./repository/Actions/InMemoryActionsRepository";
import { RealActionsRepository } from "./repository/Actions/RealActionRepository";

export type ActionsDependencies = {
    actionRepository: ActionRepository;
    dateService: DateService;
    idGenerator:IdGenerator
  } 
  //sharedependencie ?

export class ActionsDependenciesContainer{
    private static instance: ActionsDependenciesContainer
    public dependencies: ActionsDependencies = {
        actionRepository:new RealActionsRepository(),
        dateService:new RealDateService(),
        idGenerator:new RealIdGenerator(),
           
    }

    private constructor(){}

    public static getInstance():ActionsDependenciesContainer{
        if (!ActionsDependenciesContainer.instance) ActionsDependenciesContainer.instance = new ActionsDependenciesContainer();
        return ActionsDependenciesContainer.instance;
    }
}