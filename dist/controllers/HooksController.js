"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sUtil = require("serendip-utility");
const services_1 = require("../services");
class HooksController {
    constructor(entityService, dbService) {
        this.entityService = entityService;
        this.dbService = dbService;
        this.submit = {
            method: "POST",
            publicAccess: true,
            actions: [
                async (req, res, next, done, access) => {
                    var entityName = req.body.entityName;
                    var entityQuery = await this.entityService.find({
                        _entity: "_entity",
                        webhook: req.query.key
                    });
                    if (entityQuery[0]) {
                        var entity = entityQuery[0];
                        await this.entityService.insert(Object.assign({}, req.body, {
                            _entity: entity.name,
                            _business: entity._business
                        }, {
                            req: {
                                headers: req.headers,
                                ip: req.ip()
                            }
                        }));
                        done(200);
                    }
                    else {
                        done(400, "entity not found");
                    }
                }
            ]
        };
        this.submitGet = {
            method: "GET",
            route: "/api/hooks/submit",
            publicAccess: true,
            actions: [
                async (req, res, next, done, access) => {
                    var entityName = req.body.entityName;
                    var entityQuery = await this.entityService.find({
                        _entity: "_entity",
                        webhook: req.query.key
                    });
                    if (entityQuery[0]) {
                        res.write(`
          <div style="font-family:monospace;">
          <b>This is the hook for:</b>
          <pre>
${JSON.stringify(entityQuery[0], null, 2)}
          </pre>
          for inserting data send a [POST] request to this url
          </div>
          `);
                        done(200);
                    }
                    else {
                        done(400, "entity not found");
                    }
                }
            ]
        };
        this.refresh = {
            method: "post",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var entityName = req.body.entityName;
                    var entityQuery = await this.entityService.find({
                        _business: access.business._id.toString(),
                        _entity: "_entity",
                        name: entityName
                    });
                    if (entityQuery[0]) {
                        var entity = entityQuery[0];
                        entity.webhook = sUtil.text.randomAsciiString(64).toLowerCase();
                        await this.entityService.update(entity);
                        done(200);
                    }
                    else {
                        done(400, "entity not found");
                    }
                }
            ]
        };
    }
    async onRequest(req, res, next, done) {
        next();
    }
}
exports.HooksController = HooksController;
