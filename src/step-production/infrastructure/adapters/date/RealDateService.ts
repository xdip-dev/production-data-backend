import { DateService } from '@/step-production/domain/port/DateService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RealDateService implements DateService {
    public now(): Date {
        return new Date();
    }
}
