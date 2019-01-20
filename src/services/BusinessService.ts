import {
  ServerServiceInterface,
  DbService,
  Server,
  DbCollection,
  ServerEndpointActionInterface,
  ServerError
} from "serendip";
import { BusinessModel, BusinessMemberModel } from "../models";
import * as _ from "underscore";
import { ObjectId } from "bson";

export interface BusinessCheckAccessResultInterface {
  member: BusinessMemberModel;
  business: BusinessModel;
}

export class BusinessService implements ServerServiceInterface {
  static dependencies = ["AuthService", "DbService"];

  private _dbService: DbService;
  public businessCollection: DbCollection<BusinessModel>;

  constructor() {
    this._dbService = Server.services["DbService"];
  }

  async start() {
    this.businessCollection = await this._dbService.collection<BusinessModel>(
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

  async findBusinessByMember(userId: string): Promise<BusinessModel[]> {
    return this.businessCollection.find({
      $or: [
        {
          members: {
            $elemMatch: { userId: userId }
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
      (await this.findBusinessByMember(userId)).filter(x => x._id == businessId)
        .length == 1
    );
  }
  public static async checkUserAccess(req, res, next, done) {


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
      return done(400, "you are not member of this business");



    var result: BusinessCheckAccessResultInterface = {
      business: business,
      member: businessMember
    };

    next(result);

  }
}
