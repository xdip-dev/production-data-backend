import { Status } from './StepStatus';
import { AlreadyClosedError } from '../errors/AlreadyClosedError';
import { DateService } from '../port/DateService';
import { Err, Ok, Result } from '@/shared/result';

export class StepProduction {
    constructor(
        private readonly props: {
            stepId: number;
            operatorId: string;
            action: number;
            model: string;
            reference: string | null;
            matrice: string | null;
            bonne: number;
            rebut: number;
            start: Date | null;
            end: Date | null;
            status: Status;
            timeSeconde: number | null;
            productivity: number | null;
            breakNumber: number;
            previousStepsIds: number[];
            stepProblem: string | null;
        },
    ) {}

    public toState() {
        return {
            stepId: this.props.stepId,
            operatorId: this.props.operatorId,
            action: this.props.action,
            model: this.props.model,
            matrice: this.props.matrice,
            bonne: this.props.bonne,
            reference: this.props.reference,
            rebut: this.props.rebut,
            start: this.props.start,
            end: this.props.end,
            status: this.props.status,
            timeSeconde: this.props.timeSeconde,
            productivity: this.props.productivity,
            breakNumber: this.props.breakNumber,
            previousStepsIds: this.props.previousStepsIds,
            stepProblem: this.props.stepProblem,
        };
    }

    public static fromState(state: ReturnType<StepProduction['toState']>) {
        return new StepProduction({
            stepId: state.stepId,
            operatorId: state.operatorId,
            action: state.action,
            model: state.model,
            matrice: state.matrice,
            bonne: state.bonne,
            reference: state.reference,
            rebut: state.rebut,
            start: state.start,
            end: state.end,
            status: state.status,
            timeSeconde: state.timeSeconde,
            productivity: state.productivity,
            breakNumber: state.breakNumber,
            previousStepsIds: state.previousStepsIds,
            stepProblem: state.stepProblem,
        });
    }

    public static create(props: {
        stepId: number;
        operatorId: string;
        action: number;
        model: string;
        dateService: DateService;
        previousStepsIds?: number[];
        reference?: string;
        matrice?: string;
    }): StepProduction {
        return new StepProduction({
            stepId: props.stepId,
            operatorId: props.operatorId,
            action: props.action,
            model: props.model,
            matrice: props.matrice ?? null,
            bonne: 0,
            reference: props.reference ?? null,
            rebut: 0,
            start: StepProduction.startTime(props.dateService),
            end: null,
            status: Status.IN_PROGRESS,
            timeSeconde: null,
            productivity: null,
            breakNumber: 0,
            previousStepsIds: props.previousStepsIds ?? [],
            stepProblem: null,
        });
    }

    public static startTime(dateService: DateService) {
        return dateService.now();
    }

    public setEndOfAction(
        dateService: DateService,
        bonne = 0,
        rebut = 0,
        stepProblem?: string,
    ): Result<void, AlreadyClosedError> {
        if (!!this.props.end) {
            return Err.of(new AlreadyClosedError(this.props.stepId));
        }
        this.props.end = dateService.now();
        this.props.status = Status.ENDED;
        this.props.timeSeconde =
            this.props.end && this.props.start
                ? Math.round(
                      Math.floor(this.props.end.getTime() - this.props.start.getTime()) / 1000,
                  )
                : null;
        this.props.bonne = bonne < 0 ? 0 : bonne;
        this.props.rebut = rebut < 0 ? 0 : rebut;
        this.props.stepProblem = stepProblem ?? null;

        this.setBreakNumber();
        this.setProductivity();

        return Ok.of(undefined);
    }

    public setProductivity() {
        if (
            this.props.bonne + this.props.rebut === 0 ||
            this.props.timeSeconde === null ||
            this.props.timeSeconde - this.props.breakNumber * 15 * 60 < 0
        ) {
            this.props.productivity = null;
        } else {
            this.props.productivity = Math.round(
                (this.props.timeSeconde - this.props.breakNumber * 15 * 60) /
                    (this.props.bonne + this.props.rebut),
            );
        }
    }

    public setBreakNumber() {
        if (this.props.start && this.props.end) {
            const hours = this.getHoursBetweenDates();
            const breakHours = [9, 11, 13];
            this.props.breakNumber = hours.filter((hour) => breakHours.includes(hour)).length;
        }
    }

    private getHoursBetweenDates(): number[] {
        const hours: number[] = [];
        if (!this.props.start || !this.props.end) {
            return hours;
        }

        const currentDate = new Date(this.props.start);
        // jump the first hours to avoid counting action started after the break hours during the same hour
        currentDate.setTime(currentDate.getTime() + 3600000);

        while (currentDate <= this.props.end) {
            hours.push(currentDate.getHours());
            currentDate.setTime(currentDate.getTime() + 3600000); // Move to the next hour
        }

        return hours;
    }

    public cancelAction(dateService: DateService): Result<void, AlreadyClosedError> {
        if (!!this.props.end) {
            return Err.of(new AlreadyClosedError(this.props.stepId));
        }
        this.props.bonne = 0;
        this.props.rebut = 0;
        this.props.timeSeconde = null;
        this.props.productivity = null;
        this.props.end = dateService.now();
        this.props.status = Status.CANCELED;

        return Ok.of(undefined);
    }
}
