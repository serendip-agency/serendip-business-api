"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const services_1 = require("../services");
const serendip_business_model_1 = require("serendip-business-model");
class SchemaController {
    constructor() {
        this.schema = {
            route: '/api/schema',
            method: 'post',
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    res.json({
                        lists: serendip_business_model_1.ListsSchema,
                        forms: serendip_business_model_1.FormsSchema,
                        dashboard: serendip_business_model_1.DashboardSchema
                    });
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
exports.SchemaController = SchemaController;
