import mongoose from "mongoose";


export const connection = mongoose.connect('mongodb://localhost/retrospective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

