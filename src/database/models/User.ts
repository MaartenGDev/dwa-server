import mongoose from "mongoose";
import {IUser} from "../../models/IUser";

const schema = new mongoose.Schema({
    fullName: {type: String, required: true},
    email: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: {type: String, required: true},
});

export const User = mongoose.model<IUser & mongoose.Document>('User', schema);