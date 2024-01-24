import { BadRequestException, Body, Controller, Post, Patch, UsePipes } from '@nestjs/common';
import { CreateStepDto, CreateStepSchema } from './Validations/CreateStepValidation';
import { ZodValidationPipe } from '../../../shared/ZodValidationPipe';
import { CreateStepUseCase } from '@/step-production/use-cases/step-production/CreateStepUseCase';
import { CancelStepDto, CancelStepSchema } from './Validations/CancelStepValidation';
import { CancelStepUseCase } from '@/step-production/use-cases/step-production/CancelStepUseCase';
import { EndStepDto, EndStepSchema } from './Validations/EndStepValidation';
import { EndStepUseCase } from '@/step-production/use-cases/step-production/EndStepUseCase';

@Controller()
export class StepProductionController {
    constructor(
        private creationUseCase: CreateStepUseCase,
        private cancelUseCase: CancelStepUseCase,
        private endUseCase: EndStepUseCase,
    ) {}

    @Post('/create-step')
    @UsePipes(new ZodValidationPipe(CreateStepSchema))
    public async createStep(@Body() body: CreateStepDto): Promise<BadRequestException | void> {
        const res = await this.creationUseCase.execute(body);
        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }

    @Patch('/cancel-step')
    @UsePipes(new ZodValidationPipe(CancelStepSchema))
    public async cancelStep(@Body() body: CancelStepDto): Promise<BadRequestException | void> {
        const res = await this.cancelUseCase.execute(body);

        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }
    @Patch('/end-step')
    @UsePipes(new ZodValidationPipe(EndStepSchema))
    public async endStep(@Body() body: EndStepDto): Promise<BadRequestException | void> {
        const res = await this.endUseCase.execute(body);

        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }
}
