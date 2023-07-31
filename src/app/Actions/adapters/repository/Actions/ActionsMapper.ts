import { Actions } from "../../../domain/Actions";
import { ModelActionsRepository } from "./ModelActionsRepository";


export class ActionsMapper {
  public static toDomain(props: ModelActionsRepository): Actions {
    return Actions.fromState({
      actionId:props.actionId,
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
        breakNumber:props.breakNumber,

        

    });
  }
  public static toRepository(props: Actions): ModelActionsRepository {
    const state = props.toState();
    return {
      actionId: state.actionId,
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
      breakNumber:state.breakNumber,
    };
  }
}