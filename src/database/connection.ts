import mongoose from "mongoose";

export default {
    connect: (database = 'retrospective') => mongoose.connect(`mongodb://localhost/${database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }),
    destroyDatabase: (database: string) => mongoose.connection.db.dropDatabase(),
    disconnect: (callback: (err: any) => any = (e) => console.log(e)) => mongoose.disconnect(callback),
}