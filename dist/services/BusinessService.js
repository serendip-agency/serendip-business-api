"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module Business
 */
const serendip_1 = require("serendip");
const _ = require("underscore");
class BusinessService {
    constructor(webSocketService, dbService, authService) {
        this.webSocketService = webSocketService;
        this.dbService = dbService;
        this.authService = authService;
    }
    async start() {
        this.businessCollection = await this.dbService.collection("Businesses", true);
    }
    async notifyUsers(event, model) {
        if (!model._entity.startsWith("_")) {
            // TODO: check for entity setting
            return;
        }
        let business = await this.findById(model._business);
        await Promise.all(business.members
            .filter(m => m)
            .map(m => this.webSocketService.sendToUser(m.userId, "/entity", JSON.stringify({
            event,
            model
        }))));
    }
    async insert(model) {
        model._entity = "_business";
        return await this.businessCollection.insertOne(model);
    }
    async update(model) {
        model._entity = "_business";
        return this.businessCollection.updateOne(model);
    }
    async delete(model) {
        model._entity = "_business";
        return this.businessCollection.deleteOne(model._id);
    }
    async findById(id) {
        var query = await this.businessCollection.find({ _id: id });
        if (query.length == 0)
            return undefined;
        else
            return query[0];
    }
    async findBusinessesByUserId(userId) {
        var user = await this.authService.findUserById(userId);
        return this.businessCollection.find({
            $or: [
                {
                    members: { $elemMatch: { userId: userId } }
                },
                {
                    members: {
                        $elemMatch: {
                            mobile: user.mobile,
                            mobileCountryCode: user.mobileCountryCode
                        }
                    }
                },
                {
                    owner: userId
                }
            ]
        });
    }
    async userHasAccessToBusiness(userId, businessId) {
        return ((await this.findBusinessesByUserId(userId)).filter(x => x._id == businessId).length == 1);
    }
    static async checkUserAccess(req, res, next, done) {
        if (!req.body._business && !req.query._business)
            return done(400, "_business field missing");
        var business;
        try {
            business = await serendip_1.Server.services["BusinessService"].findById(req.body._business || req.query._business);
        }
        catch (e) { }
        if (!business) {
            return done(400, "business invalid");
        }
        var businessMember;
        if (!business.members || business.members.length == 0)
            return done(400, "business has no members");
        businessMember = _.findWhere(business.members, {
            userId: req.user._id.toString()
        });
        if (!businessMember)
            businessMember = _.findWhere(business.members, {
                mobile: parseInt(req.user.mobile),
                mobileCountryCode: req.user.mobileCountryCode
            });
        if (!businessMember)
            return done(400, "you are not member of this business");
        var result = {
            business: business,
            member: businessMember
        };
        next(result);
    }
}
exports.BusinessService = BusinessService;
