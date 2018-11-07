import { ServerEndpointInterface, Server, ServerError, ServerRequestInterface, ServerResponseInterface, DbService, Validator } from "serendip";
import { EntityService, BusinessService, BusinessCheckAccessResultInterface } from "../services";
import {
    ListsSchema,
    FormsSchema,
    DashboardSchema
} from "serendip-business-model";
import * as archiver from 'archiver';
import * as fs from 'fs';
import { join } from "path";
import * as _ from 'underscore'
import { ObjectID, ObjectId } from "bson";
import { ReportService } from "../services/ReportService";

export class SchemaController {


    private entityService: EntityService;
    private businessService: BusinessService;
    private dbService: DbService;
    reportService: ReportService;

    constructor() {

        this.entityService = Server.services["EntityService"];
        this.businessService = Server.services["BusinessService"];
        this.dbService = Server.services["DbService"];
        this.reportService = Server.services["ReportService"];

    }

    public async onRequest(req: ServerRequestInterface, res: ServerResponseInterface, next, done) {
        next();
    }


    public schema: ServerEndpointInterface = {
        route: '/api/schema',
        method: 'post',
        actions: [
            BusinessService.checkUserAccess,
            async (req, res, next, done, access: BusinessCheckAccessResultInterface) => {

                res.json({
                    lists: ListsSchema,
                    forms: FormsSchema,
                    dashboard: DashboardSchema
                });

            }
        ]
    }


}