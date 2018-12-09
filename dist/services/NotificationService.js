"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
class NotificationService {
    constructor() {
        this._emailService = serendip_1.Server.services["EmailService"];
        this._smsIrService = serendip_1.Server.services["SmsIrService"];
    }
    async start() {
        // try {
        //     var credit = await this._smsIrService.credit();
        //     console.log(`remaining credit in sms.ir service : ${credit}`);
        // } catch (e) {
        //     console.log(e);
        // }
        // this._emailService = Server.services["EmailService"];
        // this._emailService.send({
        //     from: 'dev@serendip.agency',
        //     to: 'nowroozi.vahid@gmail.com',
        //     subject: 'Verify your email address on serendip.agency',
        //     template: {
        //         data: {
        //             name: 'mohsen'
        //         },
        //         name: 'verify_email'
        //     }
        // }).then((msg) => {
        //     console.log(msg);
        // }).catch((err) => {
        //     console.log(err);
        // });
    }
}
NotificationService.dependencies = ["DbService", "SmsIrService", "EmailService", "FaxService"];
exports.NotificationService = NotificationService;
