import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    body: {type: String, required: true},
});

const timeUsageSchema = new mongoose.Schema({
    percentage: {type: Number, required: true}
});

const schema = new mongoose.Schema({
    retrospective: {type: mongoose.Schema.Types.ObjectId, ref: 'Retrospective', required: true},
    sprintRating: {type: Number, required: true},
    suggestedActions: String,
    suggestedTopics: String,
    comments: [commentSchema],
    timeUsage: [timeUsageSchema],
});

export const Evaluation = mongoose.model('Evaluation', schema);