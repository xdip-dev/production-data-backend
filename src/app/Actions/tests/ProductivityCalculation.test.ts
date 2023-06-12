import { ActionsMapper } from "../adapters/repository/Actions/ActionsMapper";
import { InMemoryActionsRepository } from "../adapters/repository/Actions/InMemoryActionsRepository";
import { ActionBuilder } from "../domain/ActionBuilder";
import { InMemoryDateService } from "../../shared/date/InMemoryDateService";
import ProductivityCalculationUseCase from "../useCase/ProductivityCalculationUseCase";
import { ActionNotFoundError } from "../domain/errors/ActionNotFoundError";

let actionRepository: InMemoryActionsRepository;
let dateService: InMemoryDateService;
describe('Productivity calcul',() => {

    beforeEach(() => {
        actionRepository = new InMemoryActionsRepository();
        dateService = new InMemoryDateService();
    });

  it.each([
    {time:500,bonne:100,rebut:10},
    {time:900,bonne:0,rebut:10},
    {time:500,bonne:100,rebut:0},
    {time:0,bonne:100,rebut:100},
    {time:0,bonne:0,rebut:0},
  ])('should calculate the productivity based on the time passed and the bonne pieces $time,$bonne,$rebut',async ({time,bonne,rebut}) => {
    const props = {
        __id:1
    }
    const expected = (bonne+rebut) >0 ? Math.round(time/(bonne+rebut)) : null
    actionRepository.datas = [ActionsMapper.toRepository(new ActionBuilder()
      .withBonne(bonne)
      .withRebut(rebut)
      .withTimeSeconde(time)
      .build()),];

    await new ProductivityCalculationUseCase(actionRepository).execute(props)

    expect(actionRepository.savedWith[0])
      .toEqual(new ActionBuilder().withProductivity(expected)
        .withBonne(bonne)
        .withRebut(rebut)
        .withTimeSeconde(time)
        .build())
  })

  it('should return an Error if the Id doesnt exist',async() => {
          
    const props = {
      __id: 1,
  };

  actionRepository.datas = [
      ActionsMapper.toRepository(new ActionBuilder().withId(2).build()),
  ];

  const sut = await new ProductivityCalculationUseCase(actionRepository).execute(props)
  
  expect(sut).toEqual(new ActionNotFoundError())
  })
})