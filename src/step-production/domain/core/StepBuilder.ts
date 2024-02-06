import { StepProduction } from './StepProduction';
import { Status } from './StepStatus';

export class StepBuilder {
    private data: StepProduction;

    constructor() {
        this.data = StepProduction.fromState({
            stepId: 1,
            operatorId: '1244',
            action: 1,
            model: 'ref',
            reference: null,
            bonne: 0,
            rebut: 0,
            start: null,
            end: null,
            status: Status.IN_PROGRESS,
            timeSeconde: null,
            productivity: null,
            breakNumber: 0,
            previousStepsIds: [],
            stepProblem: null,
        });
    }

    withStart(start: Date) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            start,
        });
        return this;
    }
    withId(stepId: number) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            stepId,
        });
        return this;
    }
    withOperatorId(operatorId: string) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            operatorId,
        });
        return this;
    }
    withModel(model: string) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            model,
        });
        return this;
    }
    withAction(action: number) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            action,
        });
        return this;
    }
    withReference(reference: string) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            reference,
        });
        return this;
    }

    withEnd(end: Date) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            end,
        });
        return this;
    }
    withStatus(status: Status) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            status,
        });
        return this;
    }
    withTimeSeconde(timeSeconde: number | null) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            timeSeconde,
        });
        return this;
    }
    withBonne(bonne: number) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            bonne,
        });
        return this;
    }
    withRebut(rebut: number) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            rebut,
        });
        return this;
    }

    withProductivity(productivity: number | null) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            productivity,
        });
        return this;
    }

    withBreakNumber(breakNumber: number) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            breakNumber,
        });
        return this;
    }

    withPreviousStepIds(previousStepsIds: number[]) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            previousStepsIds,
        });
        return this;
    }
    withStepProblem(stepProblem: string) {
        this.data = StepProduction.fromState({
            ...this.data.toState(),
            stepProblem,
        });
        return this;
    }
    build(): StepProduction {
        return this.data;
    }
}
