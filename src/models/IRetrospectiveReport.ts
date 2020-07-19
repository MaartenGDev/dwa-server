import {IComment} from "./IComment";
import {IRetrospective} from "./IRetrospective";
import {IAction} from "./IAction";
import {ISuggestedTopic} from "./ISuggestedTopic";

export interface IRetrospectiveReport {
    retrospective: IRetrospective;
    comments: IComment[];
    suggestedTopics: ISuggestedTopic[];
    suggestedActions: IAction[];
}