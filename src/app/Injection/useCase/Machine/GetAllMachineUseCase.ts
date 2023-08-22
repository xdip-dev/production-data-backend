import { UseCase } from "../../../shared/UseCase";
import { Machine } from "../../domain/Machine";
import { MachineRepository } from "../../domain/port/MachineRepository";

export class GetAllMachineUseCase implements UseCase<void,Promise<Machine[]>> {

    constructor(
        private readonly machineRepository: MachineRepository
    ) {}

    public async execute(): Promise<Machine[]> {
        return this.machineRepository.getAllMachine();
    }
    
}