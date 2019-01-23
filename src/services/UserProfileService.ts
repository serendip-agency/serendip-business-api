import {
  ServerServiceInterface,
  DbService,
  Server,
  DbCollection
} from "serendip";
import { UserProfileModel } from "../models";
import { ObjectId } from "bson";

export class UserProfileService implements ServerServiceInterface {
  _dbService: DbService;
  collection: DbCollection<UserProfileModel>;

  static dependencies = ["DbService"];

  constructor() {
    this._dbService = Server.services["DbService"];
  }

  async start() {
    this.collection = await this._dbService.collection<UserProfileModel>(
      "UserProfiles",
      true
    );
  }

  async insert(model: UserProfileModel) {
    return this.collection.insertOne(model);
  }

  async update(model: UserProfileModel) {
    return this.collection.updateOne(model);
  }

  async delete(id, userId) {
    return this.collection.deleteOne(id, userId);
  }

  async findProfileById(id: string, skip?: number, limit?: number) {
    var query = await this.collection.find(
      { _id: new ObjectId(id) },
      skip,
      limit
    );

    if (query.length == 0) return undefined;
    else return query[0];
  }

  async findProfileByUserId(id: string, skip?: number, limit?: number) {
    var query = await this.collection.find({ userId: id }, skip, limit);

    if (query.length == 0) return undefined;
    else return query[0];
  }

  async find(query, skip?: number, limit?: number) {
    return this.collection.find(query);
  }

  async count(crmId: string): Promise<Number> {
    return this.collection.count({ crm: crmId.toString() });
  }
}
