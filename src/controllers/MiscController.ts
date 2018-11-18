import { ServerEndpointInterface, Server, ServerError, ServerRequestInterface, ServerResponseInterface, DbService, Validator } from "serendip";
import { ExternalService } from "../services";
import * as _ from 'underscore'

export class MiscController {


    static apiPrefix = "";

    private externalService: ExternalService;

    constructor() {

        this.externalService = Server.services["ExternalService"];

    }

    public async onRequest(req: ServerRequestInterface, res: ServerResponseInterface, next, done) {
        next();
    }


    public weather: ServerEndpointInterface = {
        method: 'POST',
        actions: [async (req, res, next, done) => {
            try {
                var model = await this.externalService.weather(req.body.q);
                res.json(model);
            } catch (e) {
                next(new ServerError(500, e.message || e));
            }
        }]
    };

    public ice: ServerEndpointInterface = {
        method: 'POST',
        actions: [async (req, res, next, done) => {
            try {
                var model = await this.externalService.iranCalendarEvent(req.body.year);
                res.json(model);
            } catch (e) {
                next(new ServerError(500, e.message || e));
            }
        }]
    };

}