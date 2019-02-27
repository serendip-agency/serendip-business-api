import {
  ServerServiceInterface,
  DbService,
  Server,
  WebSocketService,
  WebSocketInterface
} from "serendip";
import { DbCollectionInterface, EntityModel } from "serendip-business-model";
import { ObjectId } from "bson";
import { BusinessService } from "./BusinessService";

export class EntityService implements ServerServiceInterface {
  collection: DbCollectionInterface<EntityModel>;

  constructor(
    private dbService: DbService,
    private webSocketService: WebSocketService,
    private businessService: BusinessService
  ) {}

  async notifyUsers(event: "insert" | "update" | "delete", model: EntityModel) {
    let business = await this.businessService.findById(model._business);

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

  async start() {
    this.collection = await this.dbService.collection<EntityModel>(
      "Entities",
      true
    );

    //this.collection.createIndex({ "$**": "text" }, {});

    this.webSocketService.messageEmitter.on(
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

  async delete(id: string, userId?: string) {
    return this.collection.deleteOne(id, userId).then(async model => {
      await this.notifyUsers("delete", model);
    });
  }

  async findById(id: string, skip?: number, limit?: number) {
    var query = await this.collection.find(
      { _id: id },
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
