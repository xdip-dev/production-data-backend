import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class DateService {
    abstract now(): Date;
}
