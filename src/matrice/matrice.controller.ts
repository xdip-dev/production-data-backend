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

import { MatriceService } from './matrice.service';
import { Matrice } from './domain/port/MatriceRepository';
import { IdValidationMatrice, MatriceDto, MatriceSchema } from './validations/MatriceValidations';

@Controller('matrice')
export class MatriceController {
    constructor(private readonly matrice: MatriceService) {}

    @Get()
    public async getAllMatrice(): Promise<Matrice[]> {
        return await this.matrice.getAllMatrice();
    }

    @Post('/create')
    @UsePipes(new ZodValidationPipe(MatriceSchema))
    public async createMatrice(@Body() body: MatriceDto): Promise<BadRequestException | void> {
        const res = await this.matrice.create(body);
        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }
    @Patch('/modify')
    @UsePipes(new ZodValidationPipe(MatriceSchema))
    public async modifyMatrice(@Body() body: MatriceDto): Promise<BadRequestException | void> {
        const res = await this.matrice.modify(body);
        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }

    @Delete('/delete')
    @UsePipes(new ZodValidationPipe(IdValidationMatrice))
    public async deleteMatrice(
        @Body() body: { code_id: string },
    ): Promise<BadRequestException | void> {
        const res = await this.matrice.delete(body.code_id);
        if (res.isErr()) {
            throw new BadRequestException(res.error.message);
        }
    }
}
