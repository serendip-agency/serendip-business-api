import { ServerServiceInterface, DbService, Server, DbCollection } from "serendip";
import { InteractionModel } from "../models";
import { ObjectId } from "bson";

export class InteractionService implements ServerServiceInterface {

    _dbService: DbService;
    collection: DbCollection<InteractionModel>;

    static dependencies = ["CrmService" , "DbService"];

    constructor() {

        this._dbService = Server.services["DbService"];
    }

    async start() {

        this.collection = await this._dbService.collection<InteractionModel>('CrmInteractions', true);

    }

    async insert(model: InteractionModel) {
        return this.collection.insertOne(model);
    }

    async update(model: InteractionModel) {
        return this.collection.updateOne(model);
    }

    async delete(model: InteractionModel) {
        return this.collection.deleteOne(model._id);
    }

    async findById(id: string) {

        var query = await this.collection.find({ _id: new ObjectId(id) });

        if (query.length == 0)
            return undefined;
        else
            return query[0];

    }



}