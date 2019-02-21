"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
class EntityService {
    constructor(dbService, webSocketService, businessService) {
        this.dbService = dbService;
        this.webSocketService = webSocketService;
        this.businessService = businessService;
    }
    async notifyUsers(event, model) {
        let business = await this.businessService.findById(model._business);
        await Promise.all(business.members
            .filter(m => m)
            .map(m => this.webSocketService.sendToUser(m.userId, "/entity", JSON.stringify({
            event,
            model
        }))));
    }
    async start() {
        this.collection = await this.dbService.collection("Entities", true);
        //this.collection.createIndex({ "$**": "text" }, {});
        this.webSocketService.messageEmitter.on("/entity", async (input, ws) => { });
    }
    async insert(model) {
        if (!model._cdate)
            model._cdate = Date.now();
        await this.notifyUsers("insert", model);
        return this.collection.insertOne(model);
    }
    async update(model) {
        await this.notifyUsers("update", model);
        return this.collection.updateOne(model);
    }
    async delete(id, userId) {
        return this.collection.deleteOne(id, userId).then(async (model) => {
            await this.notifyUsers("delete", model);
        });
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
exports.EntityService = EntityService;
