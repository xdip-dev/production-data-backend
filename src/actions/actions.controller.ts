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
import { ActionService } from './actions.service';
import { Action } from './domain/port/ActionsRepository';
import {
    ActionDto,
    ActionSchema,
    IdValidationAction,
    NameValidationAction,
} from './validations/ActionValidations';

@Controller('actions')
export class ActionController {
    constructor(private readonly action: ActionService) {}

    @Get()
    public async getAllActions(): Promise<Action[]> {
        return await this.action.getAllActions();
    }

    @Post('/create')
    @UsePipes(new ZodValidationPipe(NameValidationAction))
    public async createAction(
        @Body() body: { name: string; zone?: string },
    ): Promise<BadRequestException | void> {
        const res = await this.action.create(body);
        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }
    @Patch('/modify')
    @UsePipes(new ZodValidationPipe(ActionSchema))
    public async modifyAction(@Body() body: ActionDto): Promise<BadRequestException | void> {
        const res = await this.action.modify(body);
        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }

    @Delete('/delete')
    @UsePipes(new ZodValidationPipe(IdValidationAction))
    public async deleteAction(@Body() body: { id: number }): Promise<BadRequestException | void> {
        const res = await this.action.delete(body.id);
        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }
}
