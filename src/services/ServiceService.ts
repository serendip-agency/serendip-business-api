import { ServerServiceInterface, DbService, Server, DbCollection } from "serendip";
import { ServiceModel } from "../models";
import { ObjectId } from "bson";

export class ServiceService implements ServerServiceInterface {

    _dbService: DbService;
    collection: DbCollection<ServiceModel>;

    static dependencies = ["CrmService" , "DbService"];

    constructor() {

        this._dbService = Server.services["DbService"];
    }

    async start() {

        this.collection = await this._dbService.collection<ServiceModel>('CrmServices', true);

    }

    async insert(model: ServiceModel) {
        return this.collection.insertOne(model);
    }

    async update(model: ServiceModel) {
        return this.collection.updateOne(model);
    }

    async delete(model: ServiceModel) {
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