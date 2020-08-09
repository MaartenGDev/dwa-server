import mongoose, {Document} from "mongoose";
import {IEvaluation} from "../../models/IEvaluation";
import {ITimeUsageCategory} from "../../models/ITimeUsageCategory";

const commentSchema = new mongoose.Schema({
    body: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'CommentCategory', required: true, autopopulate: true},
});

const timeUsageCategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    color: {type: String, required: true},
    initialPercentage: {type: Number, required: true},
    increaseIsPositive: {type: Boolean, required: true},
});

const timeUsageSchema = new mongoose.Schema({
    percentage: {type: Number, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'TimeUsageCategory', required: true, autopopulate: true},
});

const schema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    retrospective: {type: mongoose.Schema.Types.ObjectId, ref: 'Retrospective', required: true, autopopulate: true},
    sprintRating: {type: Number, required: true},
    sprintRatingExplanation: {type: String},
    suggestedActions: String,
    suggestedTopics: String,
    comments: [commentSchema],
    timeUsage: [timeUsageSchema],
});

commentSchema.set('toJSON', {virtuals: true});
timeUsageCategorySchema.set('toJSON', {virtuals: true});
timeUsageSchema.set('toJSON', {virtuals: true});
schema.set('toJSON', {virtuals: true});

schema.plugin(require('mongoose-autopopulate'));
timeUsageSchema.plugin(require('mongoose-autopopulate'));
commentSchema.plugin(require('mongoose-autopopulate'));

export const TimeUsageCategory = mongoose.model<ITimeUsageCategory & Document>('TimeUsageCategory', timeUsageCategorySchema, 'timeUsageCategories');
export const Evaluation = mongoose.model<IEvaluation & Document>('Evaluation', schema);