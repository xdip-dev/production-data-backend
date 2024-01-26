import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Patch,
    UsePipes,
    Get,
    Delete,
} from '@nestjs/common';
import { ZodValidationPipe } from '../shared/ZodValidationPipe';
import {
    IdValidationMachine,
    MachineDto,
    MachineSchema,
    NameValidationMachine,
} from './validations/MachineValidations';
import { MachineService } from './machine.service';

@Controller('machine')
export class MachineController {
    constructor(private readonly machine: MachineService) {}

    @Get()
    public async getAllOperatorsMachine(): Promise<MachineDto[]> {
        return await this.machine.getAllMachine();
    }

    @Post('/create')
    @UsePipes(new ZodValidationPipe(NameValidationMachine))
    public async createMachine(
        @Body() body: { name: string },
    ): Promise<BadRequestException | void> {
        const res = await this.machine.create(body.name);
        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }
    @Patch('/modify')
    @UsePipes(new ZodValidationPipe(MachineSchema))
    public async modifyMachine(@Body() body: MachineDto): Promise<BadRequestException | void> {
        const res = await this.machine.modify(body);
        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }

    @Delete('/delete')
    @UsePipes(new ZodValidationPipe(IdValidationMachine))
    public async deleteMachine(@Body() body: { id: string }): Promise<BadRequestException | void> {
        const res = await this.machine.delete(body.id);
        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }
}
