"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const bson_1 = require("bson");
const common_1 = require("../reports/query/common");
const queryMethods = require("../reports/query");
const formatMethods = require("../reports/format");
const _ = require("underscore");
class ReportService {
    constructor() {
        this._dbService = serendip_1.Server.services["DbService"];
        this._entityService = serendip_1.Server.services["EntityService"];
        this._businessService = serendip_1.Server.services["BusinessService"];
    }
    async start() {
        this.collection = await this._dbService.collection("Reports", false);
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
    aggregate(pipeline) {
        return this.collection.aggregate(pipeline);
    }
    async count(businessId) {
        return this.collection.count({ business: businessId.toString() });
    }
    async report(opts) {
        var reportFields = opts.report.fields || [];
        var model = null;
        if (opts.report._id) {
            var reportsInDb = await this.aggregate([])
                .match({
                _id: new bson_1.ObjectID(opts.report._id),
                _business: opts.access.business._id.toString()
            })
                .toArray();
            if (reportsInDb[0])
                model = reportsInDb[0];
        }
        if (!model) {
            var dataQuery = this._entityService.collection.aggregate([
                {
                    $match: {
                        $and: [
                            { _business: opts.access.business._id.toString() },
                            { _entity: opts.report.entityName }
                        ]
                    }
                }
            ]);
            if (_.filter(reportFields, item => {
                return item.name.indexOf("__") != 0;
            }).length > 0)
                dataQuery = dataQuery.project(_.extend({}, ...reportFields.map(item => {
                    var temp = {};
                    if (item.name.indexOf("__") != 0 && item.enabled)
                        temp[item.name] = 1;
                    return temp;
                })));
            var data = await dataQuery.toArray();
            data = await Promise.all(data.map((document, index) => {
                return this.formatDocument(document, reportFields);
            }));
            if (!data) {
                data = [];
            }
            var queriedData = [];
            await Promise.all(data.map((document, index) => {
                return new Promise(async (resolve, reject) => {
                    var isMatch = await this.documentMatchFieldQueries(document, reportFields);
                    if (isMatch)
                        queriedData.push(document);
                    resolve();
                });
            }));
            model = {
                entityName: opts.report.entityName,
                name: opts.report.name,
                count: queriedData.length,
                data: queriedData,
                fields: reportFields,
                createDate: new Date(),
                label: opts.report.label,
                user: opts.access.member.userId,
                _business: opts.access.business._id.toString()
            };
            if (opts.save)
                model = await this.insert(model);
        }
        var result = _.rest(model.data, opts.skip);
        if (opts.limit)
            result = _.take(result, opts.limit);
        model.data = result;
        return model;
    }
    async formatDocument(document, fields) {
        var fieldsToFormat = await Promise.all(fields
            .filter(item => {
            return item.name.indexOf("__") == 0 && item.enabled;
        })
            .map(field => {
            return new Promise(async (resolve, reject) => {
                var value = null;
                if (formatMethods[field.method])
                    value = await formatMethods[field.method](document._id, field);
                else
                    value = field.method + " not found";
                var fieldToSet = {};
                fieldToSet[field.name] = value;
                resolve(fieldToSet);
            });
        }));
        return _.extend(document, ...fieldsToFormat);
    }
    async documentMatchFieldQueries(record, fields) {
        var results = await Promise.all(fields.map(async (field) => {
            if (!field.enabled)
                return true;
            if (!field.queries)
                return true;
            return Promise.all(field.queries.map(query => {
                return new Promise(async (resolve, reject) => {
                    if (!query.enabled)
                        return resolve(true);
                    console.log(query.enabled, field.enabled, query.method, record[field.name], query.methodInput);
                    if (!query.methodInput)
                        query.methodInput = {};
                    if (common_1.common[query.method]) {
                        if (!query.methodInput.value)
                            query.methodInput.value = "";
                        return resolve(await common_1.common[query.method](record[field.name], query.methodInput.value));
                    }
                    if (queryMethods[query.method])
                        return resolve(await queryMethods[query.method](record, query));
                    else {
                        resolve(false);
                        console.error("query-method-notfound", query);
                    }
                });
            }));
        }));
        return (_.flatten(results).filter(r => {
            return r == false;
        }).length == 0);
    }
}
ReportService.dependencies = ["BusinessService", "EntityService", "DbService"];
exports.ReportService = ReportService;
