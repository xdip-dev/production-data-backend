import { DateService } from "./DateService";

export class InMemoryDateService implements DateService {
    public nowDate = new Date();

    public now(): Date {
      // const dateTime = this.nowDate.getTime()
      // const diff = this.nowDate.getTimezoneOffset()
      // return new Date(dateTime + diff * 60* 1000);
      return this.nowDate;
    }
  }
