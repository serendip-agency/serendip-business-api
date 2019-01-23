"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
class SmsController {
    constructor() {
        this.businessService = serendip_1.Server.services["BusinessService"];
        this.authService = serendip_1.Server.services["AuthService"];
    }
}
exports.SmsController = SmsController;
