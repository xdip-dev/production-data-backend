export interface ModelProductionRepository {
    STEP_ID: number;
    OPERATOR_ID: string;
    ACTION_ID: number;
    MODEL: string;
    BONNE: number;
    REFERENCE: string | null;
    REBUT: number;
    START: Date | null;
    END: Date | null;
    STATUS: string;
    TIME_SECONDE: number | null;
    PRODUCTIVITY: number | null;
    BREAK_NUMBER: number;
    PREVIOUS_STEP_ID: number[];
    STEP_PROBLEM: string | null;
}
