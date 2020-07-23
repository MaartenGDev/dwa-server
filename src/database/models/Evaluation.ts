import mongoose, {Document} from "mongoose";
import {IEvaluation} from "../../models/IEvaluation";
import {ITimeUsageCategory} from "../../models/ITimeUsageCategory";

const commentSchema = new mongoose.Schema({
    body: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'CommentCategory', required: true},
});

const timeUsageCategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    color: {type: String, required: true},
    initialPercentage: {type: Number, required: true},
    increaseIsPositive: {type: Boolean, required: true},
});

const timeUsageSchema = new mongoose.Schema({
    percentage: {type: Number, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'TimeUsageCategory', required: true},
});

const schema = new mongoose.Schema({
    retrospective: {type: mongoose.Schema.Types.ObjectId, ref: 'Retrospective', required: true},
    sprintRating: {type: Number, required: true},
    suggestedActions: String,
    suggestedTopics: String,
    comments: [commentSchema],
    timeUsage: [timeUsageSchema],
});

commentSchema.set('toJSON', {virtuals: true});
timeUsageCategorySchema.set('toJSON', {virtuals: true});
timeUsageSchema.set('toJSON', {virtuals: true});
schema.set('toJSON', {virtuals: true});

export const TimeUsageCategory = mongoose.model<ITimeUsageCategory & Document>('TimeUsageCategory', timeUsageCategorySchema, 'timeUsageCategories');
export const Evaluation = mongoose.model<IEvaluation & Document>('Evaluation', schema);