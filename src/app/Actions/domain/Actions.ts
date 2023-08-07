import { Either, Left, Right } from "purify-ts";
import { DateService } from "../../shared/date/DateService";
import { Status } from "./StautsActions";
import { ActionAlreadyClosedError } from "./errors/ActionAlreadyClosedError";

export class Actions {
	constructor(
		private readonly props: {
			actionId: number;
			operatorId: number;
			action: string;
			model: string;
			bonne: number;
			rebut: number;
			start: Date | null;
			end: Date | null;
			status: Status;
			timeSeconde: number | null;
			productivity: number | null;
			breakNumber: number;
			previousAction:number | null;
		}
	) {}

	public toState() {
		return {
			actionId: this.props.actionId,
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
			breakNumber: this.props.breakNumber,
			previousAction:this.props.previousAction
		};
	}

	public static fromState(state: ReturnType<Actions["toState"]>) {
		return new Actions({
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
			breakNumber: state.breakNumber,
			previousAction:state.previousAction
		});
	}

	public static create(props: {
		actionId: number;
		operatorId: number;
		action: string;
		model: string;
		dateService: DateService;
		previousAction:number|null;
	}): Actions {
		return new Actions({
			actionId: props.actionId,
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
			breakNumber: 0,
			previousAction:props.previousAction
		});
	}

	public static startTime(dateService: DateService) {
		return dateService.now();
	}

	public setEndOfAction(dateService: DateService, bonne = 0, rebut = 0): Either<ActionAlreadyClosedError, Status> {
		if (!!this.props.end) {
			return Left(new ActionAlreadyClosedError(this.props.actionId));
		}
		this.props.end = dateService.now();
		this.props.status = Status.ENDED;
		this.props.timeSeconde =
			this.props.end && this.props.start
				? Math.round(Math.floor(this.props.end.getTime() - this.props.start.getTime()) / 1000)
				: null;
		this.props.bonne = bonne;
		this.props.rebut = rebut;

		this.setBreakNumber();
		this.setProductivity();

		return Right(this.props.status);
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
				(this.props.timeSeconde - this.props.breakNumber * 15 * 60) / (this.props.bonne + this.props.rebut)
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

		let currentDate = this.props.start;
		// jump the first hours to avoid counting action started after the break hours during the same hour
		currentDate.setTime(currentDate.getTime() + 3600000);

		while (currentDate <= this.props.end) {
			hours.push(currentDate.getHours());
			currentDate.setTime(currentDate.getTime() + 3600000); // Move to the next hour
		}

		return hours;
	}

	public cancelAction(dateService: DateService): Either<ActionAlreadyClosedError, Status> {
		if (!!this.props.end) {
			return Left(new ActionAlreadyClosedError(this.props.actionId));
		}
		this.props.bonne = 0;
		this.props.rebut = 0;
		this.props.timeSeconde = null;
		this.props.productivity = null;
		this.props.end = dateService.now();
		this.props.status = Status.CANCELED;

		return Right(this.props.status);
	}
}
