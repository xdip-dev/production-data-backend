import { knexInstance } from "./KnexConfig";

export class SqlRepository<T extends {}> {
  protected instance = knexInstance;
  public prefixTable = 'production_'
  protected tableName:string

  constructor(tableName: string) {
    this.tableName = this.prefixTable + tableName
  }

  protected getJoinQuery(key: string) {
    return `${this.tableName}.${key}`;
  }

  protected getTable<R>() {
    return this.instance.table<T, R>(this.tableName);
  }
}
