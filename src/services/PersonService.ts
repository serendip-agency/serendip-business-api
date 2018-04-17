import { ServerServiceInterface, DbService, Server, DbCollection } from "serendip";
import { PersonModel } from "../models";
import { ObjectId } from "bson";

export class PersonService implements ServerServiceInterface {

    _dbService: DbService;
    collection: DbCollection<PersonModel>;

    static dependencies = ["CrmService", "DbService"];

    constructor() {

        this._dbService = Server.services["DbService"];
    }

    async start() {

        this.collection = await this._dbService.collection<PersonModel>('CrmPersons', true);

    }

    async insert(model: PersonModel) {
        return this.collection.insertOne(model);
    }

    async update(model: PersonModel) {
        return this.collection.updateOne(model);
    }

    async delete(model: PersonModel) {
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