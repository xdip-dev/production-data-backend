import { InMemoryErpRepository } from "../adapters/repositories/InMemoryErpRepository";
import { NoDataFound } from "../domain/errors/NoDataFound";
import { FetchModelUseCase } from "../useCase/FetchModelUseCase";

let erpRepository: InMemoryErpRepository;
describe("Data fetching for Models", () => {
  beforeEach(() => {
    erpRepository = new InMemoryErpRepository();
  });
  it("should return the Models datas", async () => {
    const expected = [
      { name: "Model1" },
      { name: "Model2" },
      { name: "Model3" },
      { name: "Model4" },
      { name: "Model5" },
    ];
    const actual = await new FetchModelUseCase(erpRepository).execute();

    expect(actual).toEqual(expected);
  }),
    it("should throw an error if empty the dataset", async () => {
      erpRepository.dataModels = [];

      const actual = await new FetchModelUseCase(erpRepository).execute();

      expect(actual).toEqual(new NoDataFound());
    });
});
