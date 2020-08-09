import {IComment} from "./IComment";
import {ITimeUsage} from "./ITimeUsage";
import {IUser} from "./IUser";
import {IUserRetrospective} from "./IUserRetrospective";

export interface IEvaluation {
    id?: string;
    retrospective: IUserRetrospective|string;
    sprintRating: number;
    suggestedActions: string;
    suggestedTopics: string;
    comments: IComment[];
    timeUsage: ITimeUsage[];
    userId?: number;
    user?: IUser|string;
}