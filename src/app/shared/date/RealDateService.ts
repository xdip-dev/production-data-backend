import { DateService } from "./DateService";

export class RealDateService implements DateService {
    public now(): Date {
      // const date = new Date()
      // const dateTime = date.getTime()
      // const diff = date.getTimezoneOffset()
      // return new Date(dateTime + diff * 60* 1000);
      return new Date();
    }
  }
  