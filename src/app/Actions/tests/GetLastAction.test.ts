import { ActionsMapper } from "../adapters/repository/Actions/ActionsMapper"
import { InMemoryActionsRepository } from "../adapters/repository/Actions/InMemoryActionsRepository"
import { ActionBuilder } from "../domain/ActionBuilder"
import { ActionNotFoundError } from "../domain/errors/ActionNotFoundError"
import { GetLastActionUseCase } from "../useCase/Action/GetLastActionUseCase"

let actionRepository:InMemoryActionsRepository

describe('last Action UseCase',() => {
    beforeEach(() => {
        actionRepository=new InMemoryActionsRepository()
    })
  it('should give back the last action',async() => {
    const props = {
        operatorId: 1244,
      }
      actionRepository.datas = [
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId(1244).withId(1).build()),
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId(1244).withId(15).build()),
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId(1244).withId(2).build()),
      ];
      
      const actual = await new GetLastActionUseCase(actionRepository).execute(props);

      expect(actual).toEqual(new ActionBuilder().withOperatorId(1244).withId(15).build())
    })
  it('should throw an error if no action found',async() => {
    const props = {
        operatorId: 1224,
      }
      actionRepository.datas = [
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId(1569).withId(1).build()),
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId(1569).withId(15).build()),
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId(1569).withId(2).build()),
      ];
      
      const actual = await new GetLastActionUseCase(actionRepository).execute(props);

      expect(actual).toEqual(new ActionNotFoundError())
  })
})