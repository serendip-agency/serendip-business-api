"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const bson_1 = require("bson");
class EntityService {
    constructor() {
        this._dbService = serendip_1.Server.services["DbService"];
    }
    async start() {
        this.collection = await this._dbService.collection("Entities", true);
        this.collection.createIndex({ "$**": "text" }, {});
    }
    async insert(model) {
        return this.collection.insertOne(model);
    }
    async update(model) {
        return this.collection.updateOne(model);
    }
    async delete(id, userId) {
        return this.collection.deleteOne(id, userId);
    }
    async findById(id, skip, limit) {
        var query = await this.collection.find({ _id: new bson_1.ObjectId(id) }, skip, limit);
        if (query.length == 0)
            return undefined;
        else
            return query[0];
    }
    async findByBusinessId(id, skip, limit) {
        return this.collection.find({ _business: id.toString() }, skip, limit);
    }
    async find(query, skip, limit) {
        return this.collection.find(query, skip, limit);
    }
    async count(businessId) {
        return this.collection.count({ _business: businessId.toString() });
    }
}
EntityService.dependencies = ["BusinessService", "DbService"];
exports.EntityService = EntityService;
