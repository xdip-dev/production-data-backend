import { InMemoryErpRepository } from "../adapters/repositories/InMemoryErpRepository";
import { NoDataFound } from "../domain/errors/NoDataFound";
import { FetchOperatorUseCase } from "../useCase/FetchOperatorUseCase";

let operatorRepository: InMemoryErpRepository;
describe("Data fetching for Operator", () => {
  beforeEach(() => {
    operatorRepository = new InMemoryErpRepository();
  });
  it("should return the operator datas", async () => {
    const expected = [
      { id: 1, name: "Roger", barcode: "0002" },
      { id: 98, name: "RogerFrere", barcode: "0152" },
      { id: 169, name: "RogerSoeur", barcode: "1698" },
      { id: 2, name: "RogerPere", barcode: "3654" },
    ];
    const actual = await new FetchOperatorUseCase(operatorRepository).execute();

    expect(actual).toEqual(expected);
  }),
    it("should throw an error if empty the dataset", async () => {
      operatorRepository.dataOperators=[]

      const actual = await new FetchOperatorUseCase(
        operatorRepository
      ).execute();

      expect(actual).toEqual(new NoDataFound());
    });
});
