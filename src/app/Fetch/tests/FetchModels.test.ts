import { InMemoryModelsRepository } from "../adapters/repositories/Model/InMemoryModelsRepository";
import { NoDataFound } from "../domain/errors/NoDataFound";
import { ModelsRepository } from "../domain/ports/ModelRepository";
import { FetchModelUseCase } from "../useCase/FetchModelUseCase";

let modelRepository: InMemoryModelsRepository;
describe("Data fetching for Models", () => {
  beforeEach(() => {
    modelRepository = new InMemoryModelsRepository();
  });
  it("should return the Models datas", async () => {
    const expected = [
      { name: "Model1" },
      { name: "Model2" },
      { name: "Model3" },
      { name: "Model4" },
      { name: "Model5" },
    ];
    const actual = await new FetchModelUseCase(modelRepository).execute();

    expect(actual).toEqual(expected);
  }),
    it("should throw an error if empty the dataset", async () => {
      modelRepository.data = [];

      const actual = await new FetchModelUseCase(modelRepository).execute();

      expect(actual).toEqual(new NoDataFound());
    });
});
