"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
class MiscController {
    constructor() {
        this.weather = {
            method: 'POST',
            actions: [async (req, res, next, done) => {
                    try {
                        var model = await this.externalService.weather(req.body.q);
                        res.json(model);
                    }
                    catch (e) {
                        next(new serendip_1.ServerError(500, e.message || e));
                    }
                }]
        };
        this.ice = {
            method: 'POST',
            actions: [async (req, res, next, done) => {
                    try {
                        var model = await this.externalService.iranCalendarEvent(req.body.year);
                        res.json(model);
                    }
                    catch (e) {
                        next(new serendip_1.ServerError(500, e.message || e));
                    }
                }]
        };
        this.externalService = serendip_1.Server.services["ExternalService"];
    }
    async onRequest(req, res, next, done) {
        next();
    }
}
MiscController.apiPrefix = "";
exports.MiscController = MiscController;
