import { DateService } from "./DateService";

export class InMemoryDateService implements DateService {
    public nowDate = new Date();
    public now(): Date {
      return this.nowDate;
    }
  }
