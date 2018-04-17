import { ServerServiceInterface, DbService, Server, DbCollection } from "serendip";
import { ComplaintModel } from "../models";
import { ObjectId } from "bson";

export class ComplaintService implements ServerServiceInterface {

    _dbService: DbService;
    collection: DbCollection<ComplaintModel>;

    static dependencies = ["CrmService" , "DbService"];

    constructor() {

        this._dbService = Server.services["DbService"];
    }

    async start() {

        this.collection = await this._dbService.collection<ComplaintModel>('CrmComplaints', true);

    }

    async insert(model: ComplaintModel) {
        return this.collection.insertOne(model);
    }

    async update(model: ComplaintModel) {
        return this.collection.updateOne(model);
    }

    async delete(model: ComplaintModel) {
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