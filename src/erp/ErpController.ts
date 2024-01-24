import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ErpService } from './ErpService';

@Controller('erp')
export class ErpController {
    constructor(private readonly erpService: ErpService) {}

    @Get('models')
    async getModels() {
        try {
            return await this.erpService.getAllModels();
        } catch (error) {
            throw new HttpException('Failed to get models', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('operators')
    async getOperators() {
        try {
            return await this.erpService.getAllOperators();
        } catch (error) {
            throw new HttpException('Failed to get operators', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
