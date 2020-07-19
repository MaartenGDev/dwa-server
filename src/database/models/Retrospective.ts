import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
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
    topics: [topicSchema],
    actions: [actionsSchema],
});

export const Retrospective = mongoose.model('Retrospective', schema);