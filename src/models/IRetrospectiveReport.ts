import {IComment} from "./IComment";
import {IRetrospective} from "./IRetrospective";
import {ISuggestedTopic} from "./ISuggestedTopic";
import {ISuggestedAction} from "./ISuggestedAction";

export interface IRetrospectiveReport {
    retrospective: IRetrospective;
    comments: IComment[];
    suggestedTopics: ISuggestedTopic[];
    suggestedActions: ISuggestedAction[];
}