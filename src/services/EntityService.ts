import {
  ServerServiceInterface,
  DbService,
  Server,
  DbCollection,
  WebSocketService,
  WebSocketInterface
} from "serendip";
import { EntityModel } from "../models";
import { ObjectId } from "bson";
import { BusinessService } from "./BusinessService";

export class EntityService implements ServerServiceInterface {
  collection: DbCollection<EntityModel>;
  private dbService: DbService;
  private wsService: WebSocketService;
  private businessService: BusinessService;
  static dependencies = ["BusinessService", "WebSocketService", "DbService"];

  constructor() {
    this.wsService = Server.services["WebSocketService"];
    this.dbService = Server.services["DbService"];
    this.businessService = Server.services["BusinessService"];
  }

  async notifyUsers(event: "insert" | "update" | "delete", model: EntityModel) {
    let business = await this.businessService.findById(model._business);

    await Promise.all(
      business.members
        .filter(m => m)
        .map(m =>
          this.wsService.sendToUser(
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

  async start() {
    this.collection = await this.dbService.collection<EntityModel>(
      "Entities",
      true
    );

    this.collection.createIndex({ "$**": "text" }, {});

    this.wsService.messageEmitter.on(
      "/entity",
      async (input: string, ws: WebSocketInterface) => {}
    );
  }

  async insert(model: EntityModel) {
    if (!model._cdate) model._cdate = Date.now();
    await this.notifyUsers("insert", model);
    return this.collection.insertOne(model);
  }

  async update(model: EntityModel) {
    await this.notifyUsers("update", model);

    return this.collection.updateOne(model);
  }

  async delete(id: string | ObjectId, userId?: string) {
    return this.collection.deleteOne(id, userId).then(async model => {
      await this.notifyUsers("delete", model);
    });
  }

  async findById(id: string, skip?: number, limit?: number) {
    var query = await this.collection.find(
      { _id: new ObjectId(id) },
      skip,
      limit
    );

    if (query.length == 0) return undefined;
    else return query[0];
  }

  async findByBusinessId(id: string, skip?: number, limit?: number) {
    return this.collection.find({ _business: id.toString() }, skip, limit);
  }

  async find(query, skip?: number, limit?: number) {
    return this.collection.find(query, skip, limit);
  }

  async count(businessId: string): Promise<Number> {
    return this.collection.count({ _business: businessId.toString() });
  }
}
