import {
  ServerServiceInterface,
  DbService,
  Server,
  DbCollection,
  HttpError
} from "serendip";
import { BusinessModel, BusinessMemberModel } from "../models";
import * as _ from "underscore";
import { ObjectId } from "bson";
import { HttpRequestInterface, AuthService } from "serendip/src";

export interface BusinessCheckAccessResultInterface {
  member: BusinessMemberModel;
  business: BusinessModel;
}

export class BusinessService implements ServerServiceInterface {
  static dependencies = ["AuthService", "DbService"];

  private dbService: DbService;
  private authService: AuthService;
  public businessCollection: DbCollection<BusinessModel>;

  constructor() {
    this.dbService = Server.services["DbService"];
    this.authService = Server.services["AuthService"];
  }

  async start() {
    this.businessCollection = await this.dbService.collection<BusinessModel>(
      "Businesses",
      true
    );
  }

  async insert(model: BusinessModel) {
    return this.businessCollection.insertOne(model);
  }

  async update(model: BusinessModel) {
    return this.businessCollection.updateOne(model);
  }

  async delete(model: BusinessModel) {
    return this.businessCollection.deleteOne(model._id);
  }

  async findById(id: string) {
    var query = await this.businessCollection.find({ _id: new ObjectId(id) });

    if (query.length == 0) return undefined;
    else return query[0];
  }

  async findBusinessesByUserId(userId: string): Promise<BusinessModel[]> {
    var user = await this.authService.findUserById(userId);

    return this.businessCollection.find({
      $or: [
        {
          members: { $elemMatch: { userId: userId } }
        },
        {
          members: {
            $elemMatch: {
              mobile: user.mobile,
              mobileCountryCode: user.mobileCountryCode
            }
          }
        },
        {
          owner: userId
        }
      ]
    });
  }

  public async userHasAccessToBusiness(userId, businessId) {
    return (
      (await this.findBusinessesByUserId(userId)).filter(
        x => x._id == businessId
      ).length == 1
    );
  }
  public static async checkUserAccess(
    req: HttpRequestInterface,
    res,
    next,
    done
  ) {
    if (!req.body._business) return done(400, "_business field missing");

    var business: BusinessModel;
    try {
      business = await Server.services["BusinessService"].findById(
        req.body._business
      );
    } catch (e) {}

    if (!business) {
      return done(400, "business invalid");
    }

    var businessMember: BusinessMemberModel;

    if (!business.members || business.members.length == 0)
      return done(400, "business has no members");

    businessMember = _.findWhere(business.members, {
      userId: req.user._id.toString()
    });

    if (!businessMember)
      businessMember = _.findWhere(business.members, {
        mobile: parseInt(req.user.mobile),
        mobileCountryCode: req.user.mobileCountryCode
      });

    if (!businessMember)
      return done(400, "you are not member of this business");

    var result: BusinessCheckAccessResultInterface = {
      business: business,
      member: businessMember
    };

    next(result);
  }
}
