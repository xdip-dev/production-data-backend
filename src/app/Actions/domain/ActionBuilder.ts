import { DateService } from "../../shared/date/DateService";
import { Actions } from "./Actions";
import { Status } from "./StautsActions";

interface Props {}

export class ActionBuilder {
    
    private data: Actions;

    constructor() {
        this.data = Actions.fromState({
            actionId: 1,
            operatorId: 1244,
            action: "asm",
            model: "ref",
            bonne: 0,
            rebut: 0,
            start: null,
            end: null,
            status: Status.STARTED,
            timeSeconde: null,
            productivity:null,
            breakNumber:0,
            previousAction:null,
            actionProblem:null,
        });
    }

    withStart(start: Date) {
        this.data = Actions.fromState({
            ...this.data.toState(),
            start,
        });
        return this;
    }
    withId(actionId: number) {
        this.data = Actions.fromState({
            ...this.data.toState(),
            actionId,
        });
        return this;
    }

    withOperatorId(operatorId:number){
        this.data=Actions.fromState({
            ...this.data.toState(),
            operatorId
        })
        return this
    }
    withEnd(end:Date){
        this.data=Actions.fromState({
            ...this.data.toState(),
            end,
        })
        return this
    }
    withStatus(status:Status){
        this.data=Actions.fromState({
            ...this.data.toState(),
            status,
        })
        return this
    }
    withTimeSeconde(timeSeconde:number|null){
        this.data=Actions.fromState({
            ...this.data.toState(),
            timeSeconde,
        })
        return this
    }
    withBonne(bonne:number){
        this.data=Actions.fromState({
            ...this.data.toState(),
            bonne,
        })
        return this
    }
    withRebut(rebut:number){
        this.data=Actions.fromState({
            ...this.data.toState(),
            rebut,
        })
        return this
    }
    
    withProductivity(productivity:number | null) {
        this.data=Actions.fromState({
            ...this.data.toState(),
            productivity,
        })
        return this
    }
    
    withBreakNumber(breakNumber: number) {
        this.data=Actions.fromState({
            ...this.data.toState(),
            breakNumber,
        })
        return this
    }

    withPreviousAction(previousAction:number | null){
        this.data=Actions.fromState({
            ...this.data.toState(),
            previousAction,
        })
        return this
    }
    withActionProblem(actionProblem:string | null){
        this.data=Actions.fromState({
            ...this.data.toState(),
            actionProblem,
        })
        return this
    }
    build(): Actions {
        return this.data;
    }
}
