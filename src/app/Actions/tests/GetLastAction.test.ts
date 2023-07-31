import { ActionsMapper } from "../adapters/repository/Actions/ActionsMapper"
import { InMemoryActionsRepository } from "../adapters/repository/Actions/InMemoryActionsRepository"
import { ActionBuilder } from "../domain/ActionBuilder"
import { ActionNotFoundError } from "../domain/errors/ActionNotFoundError"
import { GetLastActionUseCase } from "../useCase/GetLastActionUseCase"

let actionRepository:InMemoryActionsRepository

describe('last Action UseCase',() => {
    beforeEach(() => {
        actionRepository=new InMemoryActionsRepository()
    })
  it('should give back the last action',async() => {
    const props = {
        operatorId: "xxx",
      }
      actionRepository.datas = [
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId('xxx').withId(1).build()),
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId('xxx').withId(15).build()),
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId('xxx').withId(2).build()),
      ];
      
      const actual = await new GetLastActionUseCase(actionRepository).execute(props);

      expect(actual).toEqual(new ActionBuilder().withOperatorId('xxx').withId(15).build())
    })
  it('should throw an error if no action found',async() => {
    const props = {
        operatorId: "xxx",
      }
      actionRepository.datas = [
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId('yyy').withId(1).build()),
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId('yyy').withId(15).build()),
        ActionsMapper.toRepository(new ActionBuilder().withOperatorId('yyy').withId(2).build()),
      ];
      
      const actual = await new GetLastActionUseCase(actionRepository).execute(props);

      expect(actual).toEqual(new ActionNotFoundError())
  })
})