import {ITopic} from "./ITopic";
import {IAction} from "./IAction";
import {IEvaluation} from "./IEvaluation";
import {ITeam} from "./ITeam";

export interface IRetrospective {
    id?: number;
    name: string;
    startDate: string;
    endDate: string;
    topics: ITopic[];
    actions: IAction[];
    evaluation?: IEvaluation;
    teamId: number;
    team?: ITeam;
}