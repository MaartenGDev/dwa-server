import {ITopic} from "./ITopic";
import {IAction} from "./IAction";
import {IEvaluation} from "./IEvaluation";
import {ITeam} from "./ITeam";

export interface IRetrospective {
    id?: string;
    name: string;
    startDate: Date;
    endDate: Date;
    topics: ITopic[];
    actions: IAction[];
    evaluation?: IEvaluation;
    teamId: number;
    team?: ITeam|string;
}