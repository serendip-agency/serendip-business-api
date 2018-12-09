"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const _ = require("underscore");
const bson_1 = require("bson");
class BusinessService {
    constructor() {
        this._dbService = serendip_1.Server.services["DbService"];
    }
    async start() {
        this.businessCollection = await this._dbService.collection("Businesses", true);
    }
    async insert(model) {
        return this.businessCollection.insertOne(model);
    }
    async update(model) {
        return this.businessCollection.updateOne(model);
    }
    async delete(model) {
        return this.businessCollection.deleteOne(model._id);
    }
    async findById(id) {
        var query = await this.businessCollection.find({ _id: new bson_1.ObjectId(id) });
        if (query.length == 0)
            return undefined;
        else
            return query[0];
    }
    async findBusinessByMember(userId) {
        return this.businessCollection.find({
            $or: [
                {
                    members: {
                        $elemMatch: { userId: userId }
                    }
                },
                {
                    owner: userId
                }
            ]
        });
    }
    static async checkUserAccess(req, res, next, done) {
        if (!req.body._business)
            return next(new serendip_1.ServerError(400, "_business field missing"));
        var business;
        try {
            business = await serendip_1.Server.services["BusinessService"].findById(req.body._business);
        }
        catch (e) { }
        if (!business)
            return next(new serendip_1.ServerError(400, "business invalid"));
        var businessMember;
        if (!business.members || business.members.length == 0)
            return next(new serendip_1.ServerError(400, "business has no members"));
        businessMember = _.findWhere(business.members, {
            userId: req.user._id.toString()
        });
        if (!businessMember)
            return next(new serendip_1.ServerError(400, "you are not member of this business"));
        var result = {
            business: business,
            member: businessMember
        };
        next(result);
    }
}
BusinessService.dependencies = ["AuthService", "DbService"];
exports.BusinessService = BusinessService;
