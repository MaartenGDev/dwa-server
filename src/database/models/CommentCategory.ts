import mongoose, {Document} from "mongoose";
import {ICommentCategory} from "../../models/ICommentCategory";

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    iconLabel: {type: String, required: true},
    iconColor: {type: String, required: true},
    minimalCommentCount: {type: Number, required: true},
});

export const CommentCategory = mongoose.model<ICommentCategory & Document>('CommentCategory', schema, 'commentCategories');