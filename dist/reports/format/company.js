"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const bson_1 = require("bson");
exports.CompanyProducts = async (companyId, opts) => {
    var entityService = serendip_1.Server.services["EntityService"];
    var query = await entityService.find({ _id: new bson_1.ObjectId(companyId) });
    if (query[0]) {
    }
    return [];
};
exports.CompanyEmployees = async (companyId, opts) => {
    var entityService = serendip_1.Server.services["EntityService"];
    return [];
};
