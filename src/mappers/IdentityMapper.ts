import mongoose from "mongoose";

export class IdentityMapper {
    static map(doc: mongoose.MongooseDocument|mongoose.MongooseDocument[]){
        if(Array.isArray(doc)){
            return doc.map(this.addId)
        }
        return this.addId(doc);
    }

    private static addId(doc: mongoose.MongooseDocument) {
        (doc as any['$__'] as any)._doc.id = doc._id;
        return doc;
    }
}