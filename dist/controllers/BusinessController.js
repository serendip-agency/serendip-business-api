"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module Business
 */
const serendip_1 = require("serendip");
const BusinessService_1 = require("../services/BusinessService");
const serendip_business_model_1 = require("serendip-business-model");
const _ = require("underscore");
class BusinessController {
    constructor(businessService, authService, entityService) {
        this.businessService = businessService;
        this.authService = authService;
        this.entityService = entityService;
        this.mode = {
            method: "get",
            publicAccess: true,
            actions: [
                async (req, res, next, done) => {
                    res.json(BusinessService_1.BusinessService.mode);
                }
            ]
        };
        this.list = {
            method: "get",
            actions: [
                async (req, res, next, done) => {
                    var model = await this.businessService.findBusinessesByUserId(req.user._id.toString());
                    for (let i = 0; i < model.length; i++) {
                        let business = model[i];
                        for (let mi = 0; mi < business.members.length; mi++) {
                            let member = business.members[mi];
                            let queryUser;
                            if (!member.userId && member.mobile) {
                                queryUser = await this.authService.findUserByMobile(member.mobile, member.mobileCountryCode);
                                if (queryUser) {
                                    member.userId = queryUser._id.toString();
                                    await this.businessService.update(business);
                                }
                            }
                            if (member.userId && !queryUser)
                                queryUser = await this.authService.findUserById(member.userId);
                            if (!member.mobile && queryUser) {
                                member.mobile = queryUser.mobile;
                                member.mobileCountryCode = queryUser.mobileCountryCode;
                            }
                            member.profile = (await this.entityService.collection.find({
                                _entity: "_profile",
                                _business: business._id,
                                userId: member.userId
                            }))[0];
                            business.members[mi] = member;
                        }
                        model[i] = business;
                    }
                    res.json(model);
                }
            ]
        };
        this.grid = {
            method: "post",
            actions: [
                BusinessService_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var query = (await this.entityService.collection.find({
                        _entity: "_grid",
                        _business: access.business._id.toString(),
                        _cuser: access.member.userId.toString(),
                        "data.section": req.body.section
                    })).sort((a, b) => {
                        return b._cdate - a._cdate;
                    });
                    if (query[0]) {
                        res.json(query[0].data);
                    }
                    else
                        done(400, "no grid found");
                }
            ]
        };
        this.save = {
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
                        await serendip_business_model_1.BusinessModel.validate(model);
                    }
                    catch (e) {
                        return next(new serendip_1.HttpError(400, e.message));
                    }
                    if (model._id) {
                        await this.businessService.update(model);
                    }
                    else
                        model = await this.businessService.insert(model);
                    res.json(model);
                }
            ]
        };
        this.deleteMember = {
            method: "post",
            actions: [
                BusinessService_1.BusinessService.checkUserAccess,
                async (req, res, next, done, model) => {
                    const toAdd = req.body;
                    const user = await this.authService.findUserByMobile(toAdd.mobile, toAdd.mobileCountryCode);
                    model.business.members = _.reject(model.business.members, (item) => {
                        return item.userId == user._id.toString();
                    });
                    await this.entityService.insert({
                        _entity: "_notification",
                        viewed: false,
                        icon: "club-1",
                        text: `user access of (${toAdd.mobileCountryCode})${toAdd.mobile} deleted`,
                        flash: false,
                        _business: model.business._id.toString()
                    });
                    try {
                        await this.businessService.update(model.business);
                    }
                    catch (e) {
                        return next(new serendip_1.HttpError(500, e.message));
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
                    if (!req.body.mobile || !parseInt(req.body.mobile)) {
                        return next(new serendip_1.HttpError(400, "enter mobile"));
                    }
                    let toAdd = {
                        mobile: parseInt(req.body.mobile).toString(),
                        mobileCountryCode: req.body.mobileCountryCode || "+98"
                    };
                    var user = await this.authService.findUserByMobile(toAdd.mobile, toAdd.mobileCountryCode);
                    if (user) {
                        const userBusinesses = await this.businessService.findBusinessesByUserId(user._id.toString());
                        if (userBusinesses.filter(b => b._id.toString() == model.business._id.toString()).length != 0) {
                            return next(new serendip_1.HttpError(400, "duplicate"));
                        }
                    }
                    model.business.members.push(toAdd);
                    await this.entityService.insert({
                        _entity: "_notification",
                        viewed: false,
                        icon: "club-1",
                        text: `New user granted access to business (${toAdd.mobileCountryCode})${toAdd.mobile}`,
                        flash: false,
                        _business: model.business._id.toString()
                    });
                    try {
                        await this.businessService.update(model.business);
                    }
                    catch (e) {
                        return next(new serendip_1.HttpError(500, e.message));
                    }
                    res.json(model.business);
                }
            ]
        };
    }
}
exports.BusinessController = BusinessController;
