import { ServerEndpointInterface, Server, ServerError, AuthService } from "serendip";
import { CrmService, CrmCheckAccessResultInterface } from "../services/CrmService";
import { CrmMemberModel, CrmModel, UserProfileModel } from "../models";
import * as _ from 'underscore'
import { UserProfileService } from "../services/UserProfileService";

export class ManageController {

    static apiPrefix = "CRM";
    private crmService: CrmService;
    private authService: AuthService;
    private userProfileService: UserProfileService;


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

    public members: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                var members = access.crm.members;

                members.push({ role: 'owner', userId: access.crm.owner });

                var model = [];

                await Promise.all(_.map(members, (item) => {
                    return new Promise(async (resolve, reject) => {

                        var memberProfile = await this.userProfileService.findById(item.userId);

                        if (memberProfile == undefined)
                            return resolve(new UserProfileModel({ firstName: '', lastName: '', profilePicture: '' }));
                        else
                            return resolve(memberProfile);

                    });
                }));

                if (req.body.query)
                    model = _.filter(model as any, (item: { firstName: string, lastName: string }) => {
                        return item.firstName.indexOf(req.body.query) != -1 || item.lastName.indexOf(req.body.query) != -1;
                    });

                res.json(model);
            }
        ]
    }




    public saveCrm: ServerEndpointInterface = {
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