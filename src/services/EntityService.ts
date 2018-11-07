import { ServerServiceInterface, DbService, Server, DbCollection } from "serendip";
import { EntityModel } from "../models";
import { ObjectId } from "bson";

export class EntityService implements ServerServiceInterface {

    _dbService: DbService;
    collection: DbCollection<EntityModel>;

    static dependencies = ["BusinessService", "DbService"];

    constructor() {

        this._dbService = Server.services["DbService"];
    }

    async start() {

        this.collection = await this._dbService.collection<EntityModel>('Entities', true);

    }

    async insert(model: EntityModel) {
        return this.collection.insertOne(model);
    }

    async update(model: EntityModel) {
        return this.collection.updateOne(model);
    }

    async delete(id, userId) {
        return this.collection.deleteOne(id, userId);
    }

    async findById(id: string, skip?: number, limit?: number) {

        var query = await this.collection.find({ _id: new ObjectId(id) }, skip, limit);

        if (query.length == 0)
            return undefined;
        else
            return query[0];

    }

    async findByBusinessId(id: string, skip?: number, limit?: number) {

        return this.collection.find({ "_business": id.toString() }, skip, limit);

    }


    async find(query, skip?: number, limit?: number) {

        return this.collection.find(query,skip,limit);

    }


    async count(businessId: string): Promise<Number> {

        return this.collection.count({ "_business": businessId.toString() });

    }



}