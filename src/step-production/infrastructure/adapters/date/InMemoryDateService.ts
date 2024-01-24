import { DateService } from '@/step-production/domain/port/DateService';

export class InMemoryDateService implements DateService {
    public nowDate = new Date();

    public now(): Date {
        return this.nowDate;
    }
}
