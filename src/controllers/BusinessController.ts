import { ServerEndpointInterface, Server, ServerError, AuthService } from "serendip";
import { BusinessService, BusinessCheckAccessResultInterface } from "../services/BusinessService";
import { BusinessMemberModel, BusinessModel, UserProfileModel } from "../models";
import * as _ from 'underscore'
import { UserProfileService } from "../services/UserProfileService";

export class BusinessController {

    private businessService: BusinessService;
    private authService: AuthService;
    private userProfileService: UserProfileService;

    constructor() {

        this.businessService = Server.services["BusinessService"];
        this.authService = Server.services["AuthService"];



    }


    public list: ServerEndpointInterface = {
        method: 'get',
        actions: [
            async (req, res, next, done) => {

                var model = await this.businessService.findBusinessByMember(req.user._id.toString());
                res.json(model);

            }
        ]
    }

    public members: ServerEndpointInterface = {
        method: 'post',
        actions: [
            BusinessService.checkUserAccess,
            async (req, res, next, done, access: BusinessCheckAccessResultInterface) => {

                var members = access.business.members;

                members.push({ role: 'owner', userId: access.business.owner });

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


    public saveBusiness: ServerEndpointInterface = {
        method: 'post',
        actions: [
            async (req, res, next, done) => {

                var model: BusinessModel = req.body;

                model.owner = req.user._id.toString();

                try {
                    await BusinessModel.validate(model);
                } catch (e) {
                    return next(new ServerError(400, e.message));
                }

                try {
                    model = await this.businessService.insert(model);
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
            BusinessService.checkUserAccess,
            async (req, res, next, done, model: BusinessCheckAccessResultInterface) => {


                var userId = req.body.userId;

                if (!userId)
                    return next(new ServerError(400, 'userId field missing'));

                model.business.members = _.reject(model.business.members, (item) => {
                    return item.userId == userId;
                });

                try {
                    await this.businessService.update(model.business);
                } catch (e) {
                    return next(new ServerError(500, e.message));
                }

                res.json(model.business);

            }
        ]
    }

    public addMember: ServerEndpointInterface = {
        method: 'post',
        actions: [
            BusinessService.checkUserAccess,
            async (req, res, next, done, model: BusinessCheckAccessResultInterface) => {

                var member: BusinessMemberModel = req.body;

                if (!member.role || !member.userId)
                    return next(new ServerError(400, 'role or userId field missing'));

                var user = await this.authService.findUserById(member.userId);

                if (!user)
                    return next(new ServerError(400, 'user not found'));

                model.business.members.push(member);

                try {
                    await this.businessService.update(model.business);
                } catch (e) {
                    return next(new ServerError(500, e.message));
                }

                res.json(model.business);

            }
        ]
    }



}