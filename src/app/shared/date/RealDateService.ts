import { DateService } from "./DateService";

export class RealDateService implements DateService {
    public now(): Date {
      return new Date();
    }
  }
  