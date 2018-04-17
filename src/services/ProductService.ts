import { ServerServiceInterface, DbService, Server, DbCollection } from "serendip";
import { ProductModel } from "../models";
import { ObjectId } from "bson";

export class ProductService implements ServerServiceInterface {

    _dbService: DbService;
    productsCollection: DbCollection<ProductModel>;

    static dependencies = ["CrmService", "DbService"];

    constructor() {

        this._dbService = Server.services["DbService"];
    }

    async start() {

        this.productsCollection = await this._dbService.collection<ProductModel>('CrmProducts', true);

    }

    async insert(model: ProductModel) {
        return this.productsCollection.insertOne(model);
    }

    async update(model: ProductModel) {
        return this.productsCollection.updateOne(model);
    }

    async delete(model: ProductModel) {
        return this.productsCollection.deleteOne(model._id);
    }

    async findById(id: string) {

        var query = await this.productsCollection.find({ _id: new ObjectId(id) });

        if (query.length == 0)
            return undefined;
        else
            return query[0];

    }



}