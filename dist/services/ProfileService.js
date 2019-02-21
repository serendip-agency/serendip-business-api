"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
class ProfileService {
    constructor(dbService) {
        this.dbService = dbService;
    }
    async start() {
        this.collection = await this.dbService.collection("Profiles", true);
    }
    async findProfileById(id, skip, limit) {
        var query = await this.collection.find({ _id: new bson_1.ObjectId(id) }, skip, limit);
        if (query.length == 0)
            return undefined;
        else
            return query[0];
    }
    async findProfileByUserId(id, skip, limit) {
        var query = await this.collection.find({ userId: id }, skip, limit);
        if (query.length == 0)
            return undefined;
        else
            return query[0];
    }
}
ProfileService.dependencies = ["DbService"];
exports.ProfileService = ProfileService;
