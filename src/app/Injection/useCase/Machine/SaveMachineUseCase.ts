import { UseCase } from "../../../shared/UseCase";
import { Machine } from "../../domain/Machine";
import { MachineRepository } from "../../domain/port/MachineRepository";

export class SaveMAchineUseCase implements UseCase<Machine,Promise<void>> {
 
    constructor(
        private readonly machineRepository: MachineRepository
    ) {}

    public async execute(props: Machine): Promise<void> {
        this.machineRepository.save(props);
        return
    }

}