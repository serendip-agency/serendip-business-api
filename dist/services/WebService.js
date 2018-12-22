"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebService {
    constructor() {
    }
    static processRequest(req, res, next, done) {
        console.log(req.ip());
        next();
        // next();
    }
    async start() {
    }
}
WebService.dependencies = ["DbService"];
exports.WebService = WebService;
