/**
 * @module Business
 */
import {
  AuthService,
  DbService,
  HttpRequestInterface,
  Server,
  ServerServiceInterface,
  WebSocketService
} from "serendip";
import {
  BusinessMemberModel,
  BusinessModel,
  DbCollectionInterface,
  EntityModel
} from "serendip-business-model";
import * as _ from "underscore";
import { EntityService } from "./EntityService";

export interface BusinessCheckAccessResultInterface {
  member: BusinessMemberModel;
  business: BusinessModel;
}

export class BusinessService implements ServerServiceInterface {
  public businessCollection: DbCollectionInterface<BusinessModel>;

  static mode;
  constructor(
    private webSocketService: WebSocketService,
    private dbService: DbService,
    private authService: AuthService
  ) {


  }

  async start() {
    this.businessCollection = await this.dbService.collection<BusinessModel>(
      "Businesses",
      true
    );

    if (BusinessService.mode === 'single-user') {

      let defaultUser = await this.authService.findUserByUsername('default');
      if (!defaultUser) {

        defaultUser = await this.authService.registerUser({
          username: 'default',
          password: "serendip",
          "email": "serendip@localhost.default",

        }, null, null, true);


        const defaultBusinesses = await this.findBusinessesByUserId(defaultUser._id);

        if (!defaultBusinesses.find(p => p.title.toLowerCase() === 'default'))
          await this.insert({
            title: 'Default',
            description: "default business for single-user mode",
            owner: defaultUser._id,
            members: [
              {
                userId: defaultUser._id,
              }
            ],
          } as any)
      }

    }
  }

  async notifyUsers(event: "insert" | "update" | "delete", model: EntityModel) {
    if (!model._entity.startsWith("_")) {
      // TODO: check for entity setting
      return;
    }

    let business = await this.findById(model._business);

    await Promise.all(
      business.members
        .filter(m => m)
        .map(m =>
          this.webSocketService.sendToUser(
            m.userId,
            "/entity",
            JSON.stringify({
              event,
              model
            })
          )
        )
    );
  }

  async insert(model: BusinessModel) {
    (model as any)._entity = "_business";

    return await this.businessCollection.insertOne(model);
  }

  async update(model: BusinessModel) {
    (model as any)._entity = "_business";

    return this.businessCollection.updateOne(model);
  }

  async delete(model: BusinessModel) {
    (model as any)._entity = "_business";

    return this.businessCollection.deleteOne(model._id);
  }

  async findById(id: string) {
    var query = await this.businessCollection.find({ _id: id });

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
    if (!req.body._business && !req.query._business)
      return done(400, "_business field missing");

    var business: BusinessModel;
    try {
      business = await Server.services["BusinessService"].findById(
        req.body._business || req.query._business
      );
    } catch (e) { }

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
