import { ServerServiceInterface, EmailService, Server, EmailModel, SmsIrService, ServerRequestInterface, ServerResponseInterface } from "serendip";

export class WebService implements ServerServiceInterface {

    static dependencies = ["DbService"];


    static processRequest(req: ServerRequestInterface, res: ServerResponseInterface, next, done) {
 
       console.log(req.ip());
       next();
        // next();

    }
    constructor() {



    }

    async start() {




    }


}