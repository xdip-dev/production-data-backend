import { StepProduction } from '@/step-production/domain/core/StepProduction';
import { ModelProductionRepository } from './ModelProductionRepository';
import { Status } from '@/step-production/domain/core/StepStatus';

export class StepProductionMapper {
    public static toDomain(props: ModelProductionRepository): StepProduction {
        return StepProduction.fromState({
            stepId: props.STEP_ID,
            operatorId: props.OPERATOR_ID,
            action: props.ACTION_ID,
            model: props.MODEL,
            bonne: props.BONNE,
            reference: props.REFERENCE,
            rebut: props.REBUT,
            start: props.START,
            end: props.END,
            status: props.STATUS as Status,
            timeSeconde: props.TIME_SECONDE,
            productivity: props.PRODUCTIVITY,
            breakNumber: props.BREAK_NUMBER,
            previousStepsIds: props.PREVIOUS_STEP_ID,
            stepProblem: props.STEP_PROBLEM,
        });
    }
    public static toRepository(props: StepProduction): ModelProductionRepository {
        const state = props.toState();
        return {
            STEP_ID: state.stepId,
            OPERATOR_ID: state.operatorId,
            ACTION_ID: state.action,
            MODEL: state.model,
            REFERENCE: state.reference,
            BONNE: state.bonne,
            REBUT: state.rebut,
            START: state.start,
            END: state.end,
            STATUS: state.status,
            TIME_SECONDE: state.timeSeconde,
            PRODUCTIVITY: state.productivity,
            BREAK_NUMBER: state.breakNumber,
            PREVIOUS_STEP_ID: state.previousStepsIds,
            STEP_PROBLEM: state.stepProblem,
        };
    }
}
