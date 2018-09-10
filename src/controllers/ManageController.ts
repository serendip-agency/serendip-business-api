import { ServerEndpointInterface, Server, ServerError, AuthService } from "serendip";
import { CrmService, CrmCheckAccessResultInterface } from "../services/CrmService";
import { CrmMemberModel, CrmModel } from "../models";
import * as _ from 'underscore'

export class ManageController {

    static apiPrefix = "CRM";
    private crmService: CrmService;
    private authService: AuthService;

    constructor() {

        this.crmService = Server.services["CrmService"];
        this.authService = Server.services["AuthService"];

    }


    public list: ServerEndpointInterface = {
        method: 'get',
        actions: [
            async (req, res, next, done) => {

                var model = await this.crmService.findCrmByMember(req.user._id.toString());
                res.json(model);

            }
        ]
    }


    public createCrm: ServerEndpointInterface = {
        method: 'post',
        actions: [
            async (req, res, next, done) => {

                var model: CrmModel = req.body;

                model.owner = req.user._id.toString();

                try {
                    await CrmModel.validate(model);
                } catch (e) {
                    return next(new ServerError(400, e.message));
                }

                try {
                    model = await this.crmService.insert(model);
                } catch (e) {
                    return next(new ServerError(500, e.message));
                }
                res.json(model);

            }
        ]
    }


    public deleteMember: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, model: CrmCheckAccessResultInterface) => {


                var userId = req.body.userId;

                if (!userId)
                    return next(new ServerError(400, 'userId field missing'));

                model.crm.members = _.reject(model.crm.members, (item) => {
                    return item.userId == userId;
                });

                try {
                    await this.crmService.update(model.crm);
                } catch (e) {
                    return next(new ServerError(500, e.message));
                }

                res.json(model.crm);

            }
        ]
    }

    public addMember: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, model: CrmCheckAccessResultInterface) => {

                var member: CrmMemberModel = req.body;

                if (!member.role || !member.userId)
                    return next(new ServerError(400, 'role or userId field missing'));

                var user = await this.authService.findUserById(member.userId);

                if (!user)
                    return next(new ServerError(400, 'user not found'));

                model.crm.members.push(member);

                try {
                    await this.crmService.update(model.crm);
                } catch (e) {
                    return next(new ServerError(500, e.message));
                }

                res.json(model.crm);

            }
        ]
    }



}