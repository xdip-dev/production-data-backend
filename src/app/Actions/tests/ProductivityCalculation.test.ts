import { ActionsMapper } from "../adapters/repository/Actions/ActionsMapper";
import { InMemoryActionsRepository } from "../adapters/repository/Actions/InMemoryActionsRepository";
import { ActionBuilder } from "../domain/ActionBuilder";
import { InMemoryDateService } from "../../shared/date/InMemoryDateService";
import ProductivityCalculationUseCase from "../useCase/ProductivityCalculationUseCase";
import { ActionNotFoundError } from "../domain/errors/ActionNotFoundError";

let actionRepository: InMemoryActionsRepository;
let dateService: InMemoryDateService;
describe("Productivity calcul", () => {
	beforeEach(() => {
		actionRepository = new InMemoryActionsRepository();
		dateService = new InMemoryDateService();
	});

	it.each([
		{ time: 5000, bonne: 10, rebut: 10, breakNumber: 0, expected: 250 },
		{ time: 13542, bonne: 500, rebut: 23, breakNumber: 3, expected: 21 },
		{ time: 3, bonne: 500, rebut: 23, breakNumber: 0, expected: 0 },
		{ time: 90000, bonne: 1, rebut: 1, breakNumber: 0, expected: 45000 },
		{ time: 5000, bonne: 0, rebut: 10, breakNumber: 0, expected: 500 },
		{ time: 5000, bonne: 10, rebut: 0, breakNumber: 0, expected: 500 },
		{ time: 0, bonne: 10, rebut: 10, breakNumber: 0, expected: 0 },
		{ time: 0, bonne: 10, rebut: 10, breakNumber: 1, expected: null },
		{ time: null, bonne: 10, rebut: 10, breakNumber: 0, expected: null },
		{ time: 5000, bonne: 0, rebut: 0, breakNumber: 0, expected: null },
	])(
		"should calculate the productivity based on the time passed and the bonne pieces $time,$bonne,$rebut",
		async ({ time, bonne, rebut, breakNumber, expected }) => {
			const props = {
				actionId: 1,
			};
			actionRepository.datas = [
				ActionsMapper.toRepository(
					new ActionBuilder()
						.withBonne(bonne)
						.withRebut(rebut)
						.withTimeSeconde(time)
						.withBreakNumber(breakNumber)
						.build()
				),
			];

			await new ProductivityCalculationUseCase(actionRepository).execute(props);

			expect(actionRepository.savedWith[0]).toEqual(
				new ActionBuilder()
					.withProductivity(expected)
					.withBonne(bonne)
					.withRebut(rebut)
					.withBreakNumber(breakNumber)
					.withTimeSeconde(time)
					.build()
			);
		}
	);

	it("should return an Error if the Id doesnt exist", async () => {
		const props = {
			actionId: 1,
		};

		actionRepository.datas = [ActionsMapper.toRepository(new ActionBuilder().withId(2).build())];

		const sut = await new ProductivityCalculationUseCase(actionRepository).execute(props);

		expect(sut).toEqual(new ActionNotFoundError());
	});
});
