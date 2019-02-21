import { ServerServiceInterface, DbService, Server } from "serendip";
import { ProfileModel, DbCollectionInterface } from "serendip-business-model";
import { ObjectId } from "bson";

export class ProfileService implements ServerServiceInterface {
  collection: DbCollectionInterface<ProfileModel>;

  static dependencies = ["DbService"];

  constructor(private dbService: DbService) {}

  async start() {
    this.collection = await this.dbService.collection<ProfileModel>(
      "Profiles",
      true
    );
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
}
