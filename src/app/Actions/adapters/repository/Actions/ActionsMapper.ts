import { Actions } from "../../../domain/Actions";
import { ModelActionsRepository } from "./ModelActionsRepository";


export class ActionsMapper {
  public static toDomain(props: ModelActionsRepository): Actions {
    return Actions.fromState({
      __id:props.__id,
        operatorId:props.operatorId,
        action:props.action,
        model:props.model,
        bonne:props.bonne,
        rebut:props.rebut,
        start:props.start,
        end:props.end,
        status:props.status,
        timeSeconde:props.timeSeconde,
        productivity:props.productivity,

        

    });
  }
  public static toRepository(props: Actions): ModelActionsRepository {
    const state = props.toState();
    return {
      __id: state.__id,
      operatorId: state.operatorId,
      action: state.action,
      model: state.model,
      bonne: state.bonne,
      rebut: state.rebut,
      start: state.start,
      end: state.end,
      status: state.status,
      timeSeconde: state.timeSeconde,
      productivity: state.productivity,
    };
  }
}