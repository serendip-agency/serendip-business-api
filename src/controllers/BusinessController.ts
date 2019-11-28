/**
 * @module Business
 */
import {
  HttpEndpointInterface,
  Server,
  HttpError,
  AuthService
} from "serendip";
import {
  BusinessService,
  BusinessCheckAccessResultInterface
} from "../services/BusinessService";
import { BusinessModel, BusinessMemberModel } from "serendip-business-model";
import * as _ from "underscore";
import { EntityService } from "../services";

export class BusinessController {
  constructor(
    private businessService: BusinessService,
    private authService: AuthService,
    private entityService: EntityService
  ) {}

  public list = {
    method: "get",
    actions: [
      async (req, res, next, done) => {
        var model = await this.businessService.findBusinessesByUserId(
          req.user._id.toString()
        );

        for (let i = 0; i < model.length; i++) {
          let business = model[i];
          for (let mi = 0; mi < business.members.length; mi++) {
            let member = business.members[mi];
            let queryUser;

            if (!member.userId && member.mobile) {
              queryUser = await this.authService.findUserByMobile(
                member.mobile,
                member.mobileCountryCode
              );

              if (queryUser) {
                member.userId = queryUser._id.toString();
                await this.businessService.update(business);
              }
            }

            if (member.userId && !queryUser)
              queryUser = await this.authService.findUserById(member.userId);

            if (!member.mobile && queryUser) {
              member.mobile = queryUser.mobile;
              member.mobileCountryCode = queryUser.mobileCountryCode;
            }

            // member.profile = await this.profileService.findProfileByUserId(
            //   member.userId
            // );

            business.members[mi] = member;
          }
          model[i] = business;
        }

        res.json(model);
      }
    ]
  };

  public grid: HttpEndpointInterface = {
    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var query = (
          await this.entityService.collection.find({
            _entity: "_grid",
            _business: access.business._id.toString(),
            _cuser: access.member.userId.toString(),
            "data.section": req.body.section
          })
        ).sort((a, b) => {
          return b._cdate - a._cdate;
        });

        if (query[0]) {
          res.json(query[0].data);
        } else done(400, "no grid found");
      }
    ]
  };

  public save: HttpEndpointInterface = {
    method: "post",
    actions: [
      async (req, res, next, done) => {
        var model: BusinessModel = req.body;

        model.owner = req.user._id.toString();

        if (!model.members) model.members = [];

        if (_.where(model.members, { userId: model.owner }).length == 0)
          model.members.push({
            mails: [],
            userId: model.owner,
            groups: [],
            scope: []
          });
        try {
          await BusinessModel.validate(model);
        } catch (e) {
          return next(new HttpError(400, e.message));
        }

        if (model._id) {
          await this.businessService.update(model);
        } else model = await this.businessService.insert(model);

        res.json(model);
      }
    ]
  };

  public deleteMember: HttpEndpointInterface = {
    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        model: BusinessCheckAccessResultInterface
      ) => {
        var userId = req.body.userId;

        if (!userId) return next(new HttpError(400, "userId field missing"));

        model.business.members = _.reject(
          model.business.members,
          (item: BusinessMemberModel) => {
            return item.userId == userId;
          }
        );

        try {
          await this.businessService.update(model.business);
        } catch (e) {
          return next(new HttpError(500, e.message));
        }

        res.json(model.business);
      }
    ]
  };

  public addMember: HttpEndpointInterface = {
    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        model: BusinessCheckAccessResultInterface
      ) => {
        if (!req.body.mobile || !parseInt(req.body.mobile)) {
          return next(new HttpError(400, "enter mobile"));
        }

        let toAdd = {
          mobile: parseInt(req.body.mobile).toString(),
          mobileCountryCode: req.body.mobileCountryCode || "+98"
        };

        var user = await this.authService.findUserByMobile(
          toAdd.mobile,
          toAdd.mobileCountryCode
        );

        if (user) {
          const userBusinesses = await this.businessService.findBusinessesByUserId(
            user._id.toString()
          );

          if (
            userBusinesses.filter(
              b => b._id.toString() == model.business._id.toString()
            ).length != 0
          ) {
            return next(new HttpError(400, "duplicate"));
          }
        }

        model.business.members.push(toAdd as any);

        try {
          await this.businessService.update(model.business);
        } catch (e) {
          return next(new HttpError(500, e.message));
        }

        res.json(model.business);
      }
    ]
  };
}
