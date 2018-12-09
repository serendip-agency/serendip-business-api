"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const archiver = require("archiver");
const serendip_1 = require("serendip");
const _ = require("underscore");
const models_1 = require("../models");
const services_1 = require("../services");
const serendip_2 = require("serendip");
class EntityController {
    constructor() {
        this.zip = {
            route: "/api/entity/:entity/zip",
            method: "post",
            isStream: true,
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var range = {
                        from: req.body.from && serendip_1.Validator.isNumeric(req.body.from)
                            ? req.body.from
                            : 0,
                        to: req.body.to && serendip_1.Validator.isNumeric(req.body.to)
                            ? req.body.to
                            : Date.now()
                    };
                    var model = await this.entityService.find({
                        _business: access.business._id.toString(),
                        _entity: req.params.entity,
                        _vdate: { $gt: range.from, $lt: range.to }
                    });
                    var bigObject = {};
                    model.forEach(doc => {
                        bigObject[doc._id] = doc;
                    });
                    res.setHeader("content-type", "application/zip");
                    var zip = archiver("zip", {
                        zlib: { level: 9 } // Sets the compression level.
                    });
                    zip.pipe(res);
                    zip.append(JSON.stringify(bigObject), { name: "data.json" });
                    zip.finalize();
                }
            ]
        };
        this.details = {
            route: "/api/entity/:entity/details",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var model = await this.entityService.findById(req.body._id);
                    if (!model)
                        return new serendip_1.ServerError(404, "entity not found");
                    if (model._business == access.business._id)
                        res.json(model);
                    else
                        return new serendip_1.ServerError(404, "entity not found");
                }
            ]
        };
        this.changes = {
            route: "/api/entity/changes",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    const possibleQueryFields = [
                        "_id",
                        "model._id",
                        "model._rdate",
                        "model._udate",
                        "model._vdate",
                        "model._cdate",
                        "model._ruser",
                        "model._uuser",
                        "model._vuser",
                        "model._cuser",
                        "model._entity",
                        "type"
                    ];
                    var query = _.extend({
                        "model._business": access.business._id.toString()
                    }, _.pick(req.body, possibleQueryFields));
                    if (req.body.count) {
                        res.json(await this.dbService.entityChangeCollection.count(query));
                    }
                    else {
                        var project = {};
                        var changes = await this.dbService.entityChangeCollection
                            .aggregate([])
                            .match(query)
                            .project({ type: 1, _id: "$model._id" })
                            .toArray();
                        res.json({
                            created: _.filter(changes, (change) => change.type == serendip_2.entityChangeType.Create).length,
                            updated: _.filter(changes, (change) => change.type == serendip_2.entityChangeType.Update).length,
                            deleted: _.map(_.filter(changes, (change) => change.type == serendip_2.entityChangeType.Delete), item => item._id)
                        });
                    }
                }
            ]
        };
        // public entityChanges: ServerEndpointInterface = {
        //   route: "/api/entity/:entity/changes",
        //   method: "post",
        //   actions: [
        //     BusinessService.checkUserAccess,
        //     async (
        //       req,
        //       res,
        //       next,
        //       done,
        //       access: BusinessCheckAccessResultInterface
        //     ) => {
        //       var range = {
        //         from:
        //           req.body.from && Validator.isNumeric(req.body.from)
        //             ? req.body.from
        //             : 0,
        //         to:
        //           req.body.to && Validator.isNumeric(req.body.to)
        //             ? req.body.to
        //             : Date.now()
        //       };
        //       if (req.body._id) {
        //         var actualRecord = await this.entityService.findById(req.body._id);
        //         if (!actualRecord)
        //           return next(new ServerError(400, "record not found"));
        //         var recordChanges = await this.dbService.entityChangeCollection.find({
        //           entityId: actualRecord._id
        //         });
        //         res.json(recordChanges);
        //       } else {
        //         var changedRecords = _.map(
        //           await this.entityService.find({
        //             _business: access.business._id.toString(),
        //             _entity: req.params.entity,
        //             _vdate: {
        //               $gt: range.from,
        //               $lt: range.to
        //             }
        //           }),
        //           (item: EntityModel) => {
        //             return item._id;
        //           }
        //         );
        //         var deletedRecords = _.map(
        //           await this.dbService.entityChangeCollection.find({
        //             "model.business": access.business._id.toString(),
        //             type: 0,
        //             date: { $gt: range.from, $lt: range.to }
        //           }),
        //           item => {
        //             return item.entityId;
        //           }
        //         );
        //         res.json({ changed: changedRecords, deleted: deletedRecords });
        //       }
        //     }
        //   ]
        // };
        this.list = {
            route: "/api/entity/:entity/list",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var model = await this.entityService.find({
                        _business: access.business._id.toString(),
                        _entity: req.params.entity
                    }, req.body.skip, req.body.limit);
                    res.json(model);
                }
            ]
        };
        this.count = {
            route: "/api/entity/:entity/count",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var model = await this.entityService.count(access.business._id);
                    res.json(model);
                }
            ]
        };
        this.reportList = {
            route: "/api/entity/reports",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    res.json(await this.reportService
                        .aggregate([])
                        .match({
                        user: access.member.userId.toString(),
                        entityName: req.body.entityName,
                        _business: access.business._id.toString()
                    })
                        .project({
                        _id: 1,
                        label: 1,
                        fields: 1,
                        createDate: 1,
                        user: 1,
                        _business: 1
                    })
                        .toArray());
                }
            ]
        };
        this.report = {
            route: "/api/entity/report",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var opts = {
                        save: req.body.save,
                        report: req.body.report,
                        skip: req.body.skip || 0,
                        limit: req.body.limit,
                        access: access,
                        zip: req.body.zip
                    };
                    var model = await this.reportService.report(opts);
                    if (opts.zip) {
                        res.setHeader("content-type", "application/zip");
                        var zip = archiver("zip", {
                            zlib: { level: 9 } // Sets the compression level.
                        });
                        zip.pipe(res);
                        zip.append(JSON.stringify(model), { name: "data.json" });
                        zip.finalize();
                    }
                    else
                        res.json(model);
                }
            ]
        };
        this.search = {
            route: "/api/entity/:entity/search",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    //{ '$regex': '.*' + req.body.query + '.*' }
                    var properties = req.body.properties;
                    var propertiesSearchMode = req.body.propertiesSearchMode;
                    var project = {};
                    var q = req.body.query || "";
                    properties.forEach(element => {
                        project[element] = 1;
                    });
                    if (!project._id)
                        project._id = 1;
                    var model = await this.entityService.collection
                        .aggregate([
                        {
                            $match: {
                                _entity: req.params.entity,
                                _business: access.business._id.toString(),
                                $text: { $search: q }
                            }
                        },
                        { $sort: { score: { $meta: "textScore" } } },
                        { $project: project }
                    ])
                        .limit(req.body.limit || 30)
                        .toArray();
                    res.json(model);
                }
            ]
        };
        this.insert = {
            route: "/api/entity/:entity/insert",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var model = req.body;
                    if (!model._entity)
                        model._entity = req.params.entity;
                    try {
                        await models_1.EntityModel.validate(model);
                    }
                    catch (e) {
                        return next(new serendip_1.ServerError(400, JSON.stringify(e)));
                    }
                    try {
                        model = await this.entityService.insert(model);
                    }
                    catch (e) {
                        return next(new serendip_1.ServerError(500, e.message || e));
                    }
                    res.json(model);
                }
            ]
        };
        this.update = {
            route: "/api/entity/:entity/update",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var model = req.body;
                    if (!model._entity)
                        model._entity = req.params.entity;
                    try {
                        await models_1.EntityModel.validate(model);
                    }
                    catch (e) {
                        return next(new serendip_1.ServerError(400, e.message || e));
                    }
                    try {
                        await this.entityService.update(model);
                    }
                    catch (e) {
                        return next(new serendip_1.ServerError(500, e.message || e));
                    }
                    res.json(model);
                }
            ]
        };
        this.delete = {
            route: "/api/entity/:entity/delete",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var _id = req.body._id;
                    if (!_id)
                        return next(new serendip_1.ServerError(400, "_id is missing"));
                    var entity = await this.entityService.findById(_id);
                    if (!entity)
                        return next(new serendip_1.ServerError(400, "entity not found"));
                    if (entity._business.toString() != access.business._id.toString())
                        return next(new serendip_1.ServerError(400, "access mismatch"));
                    try {
                        await this.entityService.delete(_id, req.user._id);
                    }
                    catch (e) {
                        return next(new serendip_1.ServerError(500, e.message || e));
                    }
                    res.json(entity);
                }
            ]
        };
        this.entityService = serendip_1.Server.services["EntityService"];
        this.businessService = serendip_1.Server.services["BusinessService"];
        this.dbService = serendip_1.Server.services["DbService"];
        this.reportService = serendip_1.Server.services["ReportService"];
    }
    async onRequest(req, res, next, done) {
        next();
    }
}
exports.EntityController = EntityController;
