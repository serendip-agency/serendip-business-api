"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
const services_1 = require("../services");
class SeedController {
    constructor(entityService, dbService) {
        this.entityService = entityService;
        this.dbService = dbService;
        this.importFromUrl = {
            route: "/api/seed/import_form_url",
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    const query = req.body.query || {};
                    const model = await this.entityService.find(_.extend(query, {
                        _business: access.business._id.toString(),
                        _entity: req.params.entity
                    }), req.body.skip, req.body.limit);
                    res.json(model);
                }
            ]
        };
    }
    async onRequest(req, res, next, done) {
        next();
    }
}
exports.SeedController = SeedController;
