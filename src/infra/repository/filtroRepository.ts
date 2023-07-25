import { knexInstanceFiltro } from "./KnexConfig";

export class filtroRepository {
  protected instance = knexInstanceFiltro;

  constructor() {}

  protected getAllFrom<T extends {}>(tableName:string) {
    return this.instance.select().from<T>(tableName).limit(10);
  }
}