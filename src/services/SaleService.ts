import { ServerServiceInterface, DbService, Server, DbCollection } from "serendip";
import { SaleModel } from "../models";
import { ObjectId } from "bson";

export class SaleService implements ServerServiceInterface {

    _dbService: DbService;
    collection: DbCollection<SaleModel>;

    static dependencies = ["CrmService" , "DbService"];

    constructor() {

        this._dbService = Server.services["DbService"];
    }

    async start() {

        this.collection = await this._dbService.collection<SaleModel>('CrmSales', true);

    }

    async insert(model: SaleModel) {
        return this.collection.insertOne(model);
    }

    async update(model: SaleModel) {
        return this.collection.updateOne(model);
    }

    async delete(model: SaleModel) {
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