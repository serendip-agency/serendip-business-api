import { ServerServiceInterface, EmailService, Server, EmailModel, SmsIrService } from "serendip";

export class NotificationService implements ServerServiceInterface {

    static dependencies = ["DbService", "SmsIrService", "EmailService", "FaxService"];

    _emailService: EmailService;
    _smsIrService: SmsIrService;

    constructor() {

        this._emailService = Server.services["EmailService"];
        this._smsIrService = Server.services["SmsIrService"];

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