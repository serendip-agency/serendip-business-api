"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
class SmsController {
    constructor() {
        this.counts = {
            method: "get",
            actions: [
                async (req, res, next, done) => {
                    var model = await this.businessService.findBusinessByMember(req.user._id.toString());
                    res.json(model);
                }
            ]
        };
        this.businessService = serendip_1.Server.services["BusinessService"];
        this.authService = serendip_1.Server.services["AuthService"];
    }
}
exports.SmsController = SmsController;
