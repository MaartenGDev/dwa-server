import mongoose from "mongoose";

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

export interface IUser {
    fullName: string;
    email: string;
    password: string;
}

export const User = mongoose.model<IUser & mongoose.Document>('User', schema);