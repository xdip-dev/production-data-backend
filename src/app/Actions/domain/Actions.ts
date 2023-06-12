import { Either, Left, Right } from "purify-ts";
import { DateService } from "../../shared/date/DateService";
import { Status } from "./StautsActions";
import { ActionAlreadyClosedError } from "./errors/ActionAlreadyClosedError";

export class Actions {
    constructor(
        private readonly props: {
            __id: number;
            operatorId: string;
            action: string;
            model: string;
            bonne: number;
            rebut: number;
            start: Date | null;
            end: Date | null;
            status: Status;
            timeSeconde: number | null;
            productivity: number | null;
        }
    ) {}

    public toState() {
        return {
            __id: this.props.__id,
            operatorId: this.props.operatorId,
            action: this.props.action,
            model: this.props.model,
            bonne: this.props.bonne,
            rebut: this.props.rebut,
            start: this.props.start,
            end: this.props.end,
            status: this.props.status,
            timeSeconde: this.props.timeSeconde,
            productivity: this.props.productivity,
        };
    }

    public static fromState(state: ReturnType<Actions["toState"]>) {
        return new Actions({
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
        });
    }

    public static create(props: {
        __id: number;
        operatorId: string;
        action: string;
        model: string;
        dateService: DateService;
    }): Actions {
        return new Actions({
            __id: props.__id,
            operatorId: props.operatorId,
            action: props.action,
            model: props.model,
            bonne: 0,
            rebut: 0,
            start: Actions.startTime(props.dateService),
            end: null,
            status: Status.STARTED,
            timeSeconde: null,
            productivity: null,
        });
    }

    public static startTime(dateService: DateService) {
        return dateService.now();
    }

    public setEndOfAction(dateService: DateService, bonne = 0, rebut = 0):Either<ActionAlreadyClosedError , Status> {
        if (!!this.props.end) { 
            return Left(new ActionAlreadyClosedError(this.props.__id))         
        }
        this.props.end = dateService.now();
        this.props.status = Status.ENDED;
        this.props.timeSeconde =
            this.props.end && this.props.start
                ? Math.round(Math.floor(this.props.end.getTime() - this.props.start.getTime()) / 1000)
                : null;
        this.props.bonne = bonne;
        this.props.rebut = rebut;

        this.setProductivity();

        return Right(this.props.status)
    }

    public setProductivity() {
        if (this.props.bonne + this.props.rebut === 0) {
            this.props.productivity = null;
        } else {
            this.props.productivity =
                this.props.timeSeconde !== null
                    ? Math.round(this.props.timeSeconde / (this.props.bonne + this.props.rebut))
                    : null;
        }
    }

    public cancelAction(dateService: DateService):Either<ActionAlreadyClosedError , Status> {
        if (!!this.props.end) { 
            return Left(new ActionAlreadyClosedError(this.props.__id))         
        }
        this.props.bonne = 0;
        this.props.rebut = 0;
        this.props.timeSeconde = null;
        this.props.productivity = null;
        this.props.end = dateService.now();
        this.props.status = Status.CANCELED;

        return Right(this.props.status)
    }
}
