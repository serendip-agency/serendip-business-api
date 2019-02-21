"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const _ = require("underscore");
class BusinessService {
    constructor() {
        this.dbService = serendip_1.Server.services["DbService"];
        this.authService = serendip_1.Server.services["AuthService"];
    }
    async start() {
        this.businessCollection = await this.dbService.collection("Businesses", true);
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
        if (!req.body._business)
            return done(400, "_business field missing");
        var business;
        try {
            business = await serendip_1.Server.services["BusinessService"].findById(req.body._business);
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
BusinessService.dependencies = ["AuthService", "DbService"];
exports.BusinessService = BusinessService;
