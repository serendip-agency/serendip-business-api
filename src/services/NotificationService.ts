import { ServerServiceInterface, EmailService, Server, EmailModel } from "serendip";

export class NotificationService implements ServerServiceInterface {

    static dependencies = ["DbService", "SmsService", "EmailService", "FaxService"];

    _emailService: EmailService;

    async start() {

        this._emailService = Server.services["EmailService"];

        // this._emailService.send({
        //     from: 'dev@serendip.agency',
        //     to: 'test@serendip.agency',
        //     subject: 'Verify your email address on serendip.agency',
        //     template: {
        //         data : {
        //             name : 'mohsen'
        //         },
        //         name : 'verify_email'
        //     }
        // }).then((msg) => {

        //     console.log(msg);

        // }).catch((err) => {
        //     console.log(err);
        // });


    }


}