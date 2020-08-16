import {IComment} from "./IComment";
import {ITimeUsage} from "./ITimeUsage";
import {IUser} from "./IUser";
import {IRetrospective} from "./IRetrospective";

export interface IEvaluation {
    id?: string;
    retrospective: IRetrospective|string;
    sprintRating: number;
    sprintRatingExplanation: string;
    suggestedActions: string;
    suggestedTopics: string;
    comments: IComment[];
    timeUsage: ITimeUsage[];
    userId?: number;
    user?: IUser|string;
}