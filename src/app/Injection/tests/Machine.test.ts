import { InMemoryMachineRepository } from "../adapters/Machine/InMemoryMachineRepository";
import { Machine } from "../domain/Machine";
import { GetAllMachineUseCase } from "../useCase/Machine/GetAllMachineUseCase";
import { SaveMAchineUseCase } from "../useCase/Machine/SaveMachineUseCase";

let InMemoeryMachineRepository :InMemoryMachineRepository

describe('Machine Interaction', () => {
    beforeEach(() => {
        InMemoeryMachineRepository = new InMemoryMachineRepository();
    });
    it('should return all machines', async() => {
        InMemoeryMachineRepository.data =[
            {id:1,name:'machine1'},
            {id:2,name:'machine2'},
        ]

        const expected:Machine[] =[
            {id:1,name:'machine1'},
            {id:2,name:'machine2'},
        ]
        const actual = await new GetAllMachineUseCase(InMemoeryMachineRepository).execute();
        expect(actual).toEqual(expected);
    })
    it('should save a new machine', async() => {
        const props:Machine = {id:3,name:'machine3'}
        await new SaveMAchineUseCase(InMemoeryMachineRepository).execute(props);
        expect(InMemoeryMachineRepository.data[0]).toEqual(props);
    })
})