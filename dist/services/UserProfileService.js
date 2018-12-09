"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const bson_1 = require("bson");
class UserProfileService {
    constructor() {
        this._dbService = serendip_1.Server.services["DbService"];
    }
    async start() {
        this.collection = await this._dbService.collection('UserProfiles', true);
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
    async findByCrmId(id, skip, limit) {
        return this.collection.find({ "crm": id.toString() }, skip, limit);
    }
    async find(query, skip, limit) {
        return this.collection.find(query);
    }
    async count(crmId) {
        return this.collection.count({ "crm": crmId.toString() });
    }
}
UserProfileService.dependencies = ["CrmService", "DbService"];
exports.UserProfileService = UserProfileService;
