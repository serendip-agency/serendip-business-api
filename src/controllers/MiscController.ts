import { ServerEndpointInterface, Server, ServerError, ServerRequestInterface, ServerResponseInterface, DbService, Validator } from "serendip";
import { CompanyService, CrmService, CrmCheckAccessResultInterface, ExternalService } from "../services";
import { CompanyModel } from "../models";
import * as archiver from 'archiver';
import * as fs from 'fs';
import { join } from "path";
import * as _ from 'underscore'
import { ObjectID, ObjectId } from "bson";

export class MiscController {


    static apiPrefix = "CRM";

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