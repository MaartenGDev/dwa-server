import mongoose, {Document} from "mongoose";
import {IRetrospective} from "../../models/IRetrospective";

const topicSchema = new mongoose.Schema({
    order: Number,
    description: String,
    durationInMinutes: Number
});
const actionsSchema = new mongoose.Schema({
    description: String,
    responsible: String,
    isCompleted: Boolean,
});

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true, autopopulate: true},
    topics: [topicSchema],
    actions: [actionsSchema],
});

topicSchema.set('toJSON', {virtuals: true});
actionsSchema.set('toJSON', {virtuals: true});
schema.set('toJSON', {virtuals: true});

schema.plugin(require('mongoose-autopopulate'));

export const Retrospective = mongoose.model<IRetrospective & Document>('Retrospective', schema);