"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const BusinessService_1 = require("../services/BusinessService");
const models_1 = require("../models");
const _ = require("underscore");
class BusinessController {
    constructor() {
        this.list = {
            method: "get",
            actions: [
                async (req, res, next, done) => {
                    var model = await this.businessService.findBusinessByMember(req.user._id.toString());
                    res.json(model);
                }
            ]
        };
        this.grid = {
            method: "get",
            actions: [
                async (req, res, next, done) => {
                    res.json({});
                }
            ]
        };
        this.members = {
            method: "post",
            actions: [
                BusinessService_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var members = access.business.members;
                    var model = [];
                    await Promise.all(_.map(members, item => {
                        return new Promise(async (resolve, reject) => {
                            var memberProfile = await this.userProfileService.findById(item.userId);
                            if (memberProfile == undefined)
                                return resolve(new models_1.UserProfileModel({
                                    firstName: "",
                                    lastName: "",
                                    profilePicture: ""
                                }));
                            else
                                return resolve(memberProfile);
                        });
                    }));
                    if (req.body.query)
                        model = _.filter(model, (item) => {
                            return (item.firstName.indexOf(req.body.query) != -1 ||
                                item.lastName.indexOf(req.body.query) != -1);
                        });
                    res.json(model);
                }
            ]
        };
        this.saveBusiness = {
            method: "post",
            actions: [
                async (req, res, next, done) => {
                    var model = req.body;
                    model.owner = req.user._id.toString();
                    if (!model.members)
                        model.members = [];
                    if (_.where(model.members, { userId: model.owner }).length == 0)
                        model.members.push({
                            mails: [],
                            userId: model.owner,
                            groups: [],
                            scope: []
                        });
                    try {
                        await models_1.BusinessModel.validate(model);
                    }
                    catch (e) {
                        return next(new serendip_1.ServerError(400, e.message));
                    }
                    try {
                        model = await this.businessService.insert(model);
                    }
                    catch (e) {
                        return next(new serendip_1.ServerError(500, e.message));
                    }
                    res.json(model);
                }
            ]
        };
        this.deleteMember = {
            method: "post",
            actions: [
                BusinessService_1.BusinessService.checkUserAccess,
                async (req, res, next, done, model) => {
                    var userId = req.body.userId;
                    if (!userId)
                        return next(new serendip_1.ServerError(400, "userId field missing"));
                    model.business.members = _.reject(model.business.members, item => {
                        return item.userId == userId;
                    });
                    try {
                        await this.businessService.update(model.business);
                    }
                    catch (e) {
                        return next(new serendip_1.ServerError(500, e.message));
                    }
                    res.json(model.business);
                }
            ]
        };
        this.addMember = {
            method: "post",
            actions: [
                BusinessService_1.BusinessService.checkUserAccess,
                async (req, res, next, done, model) => {
                    var member = req.body;
                    if (!member.scope || !member.userId)
                        return next(new serendip_1.ServerError(400, "scope or userId field missing"));
                    var user = await this.authService.findUserById(member.userId);
                    if (!user)
                        return next(new serendip_1.ServerError(400, "user not found"));
                    model.business.members.push(member);
                    try {
                        await this.businessService.update(model.business);
                    }
                    catch (e) {
                        return next(new serendip_1.ServerError(500, e.message));
                    }
                    res.json(model.business);
                }
            ]
        };
        this.businessService = serendip_1.Server.services["BusinessService"];
        this.authService = serendip_1.Server.services["AuthService"];
    }
}
exports.BusinessController = BusinessController;
