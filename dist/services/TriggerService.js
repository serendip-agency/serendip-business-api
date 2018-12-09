"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TaskService {
    constructor() {
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
TaskService.dependencies = ["DbService", "NotificationService"];
exports.TaskService = TaskService;
