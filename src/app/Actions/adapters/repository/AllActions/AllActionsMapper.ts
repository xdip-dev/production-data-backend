import { AllActions } from "../../../domain/AllActions";
import { ModelAllActionRepository } from "./ModelAllActionRepository";

export class AllActionsMapper {
    public static toDomain(props: ModelAllActionRepository): AllActions {
        return {
            action: props.action,
            zone: props.zone,
        };
    }

    public static toRepository(props: AllActions): ModelAllActionRepository {
        return {
            action: props.action,
            zone: props.zone,
        };
    }

}