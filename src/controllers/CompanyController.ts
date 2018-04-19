import { ServerEndpointInterface, Server, ServerError, ServerRequestInterface, ServerResponseInterface } from "serendip";
import { CompanyService, CrmService, CrmCheckAccessResultInterface } from "../services";
import { CompanyModel } from "../models";

export class CompanyController {


    static apiPrefix = "CRM";

    private companyService: CompanyService;
    private crmService: CrmService;

    constructor() {

        this.companyService = Server.services["CompanyService"];
        this.crmService = Server.services["CrmService"];

    }

    public async onRequest(req: ServerRequestInterface, res: ServerResponseInterface, next, done) {
        next();
    }

    public list: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {


                
                var model = await this.companyService.findByCrmId(
                    access.crm._id,
                    req.body.skip,
                    req.body.limit);

                res.json(model);

            }
        ]
    }

    public count: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                
                var model = await this.companyService.count(access.crm._id);

                res.json(model);

            }
        ]
    }


    public insert: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                var model: CompanyModel = new CompanyModel(req.body);

                try {
                    await CompanyModel.validate(model);
                } catch (e) {
                    return next(new ServerError(400, e.message));
                }

                try {
                    model = await this.companyService.insert(model);
                } catch (e) {
                    return next(new ServerError(500, e.message));
                }

                res.json(model);

            }
        ]
    }


    public update: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                var model: CompanyModel = new CompanyModel(req.body);


                try {
                    await CompanyModel.validate(model);
                } catch (e) {
                    return next(new ServerError(400, e.message));
                }

                try {
                    await this.companyService.update(model);
                } catch (e) {
                    return next(new ServerError(500, e.message));
                }

                res.json(model);

            }
        ]
    }


    public delete: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                var _id = req.body._id;

                if (!_id)
                    return next(new ServerError(400, '_id is missing'));

                var company = await this.companyService.findById(_id);
                if (!company)
                    return next(new ServerError(400, 'company not found'));

                try {
                    await this.companyService.delete(_id, req.user._id);
                } catch (e) {
                    return next(new ServerError(500, e.message));
                }

                res.json(company);

            }
        ]
    }





}