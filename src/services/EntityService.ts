/**
 * @module Entity
 */
import {
  ServerServiceInterface,
  DbService,
  Server,
  WebSocketService,
  WebSocketInterface
} from "serendip";
import {
  DbCollectionInterface,
  EntityModel,
  DbProviderInterface
} from "serendip-business-model";
import { ObjectId } from "bson";
import { BusinessService } from "./BusinessService";
import { MongodbProvider } from "serendip-mongodb-provider";

export class EntityService implements ServerServiceInterface {
  collection: DbCollectionInterface<EntityModel>;

  constructor(
    private dbService: DbService,
    private webSocketService: WebSocketService,
    private businessService: BusinessService
  ) {}

  dataSources: {
    [key: string]: { model: EntityModel; provider: DbProviderInterface }[];
  } = {};

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

    // var records = await this.find({ _entity: "entity" }, 0, 0);
    // for (const r of records) {
    //   r._entity = "_entity";

    //   await this.collection.updateOne(r);
    // }
    this.refreshDataSources();
    this.refreshEntityTypes();
  }

  async refreshDataSources() {
    const businesses = await this.businessService.businessCollection.find({});

    for (const business of businesses) {
      const businessDataSources = await this.find({
        _business: business._id.toString(),
        _entity: "_dataSource"
      });

      if (!this.dataSources[business._id.toString()])
        this.dataSources[business._id.toString()] = [];

      for (const source of businessDataSources) {
        if (
          this.dataSources[business._id.toString()].find(
            p => p.model._id == source._id
          )
        )
          continue;

        if (source.type.toLowerCase() == "mongodb") {
          const mongoProvider = await new MongodbProvider();

          mongoProvider
            .initiate(source.options)
            .then(() => {
              this.dataSources[business._id.toString()].push({
                model: source,
                provider: mongoProvider
              });
              console.info("connected to dataSource!", source);
            })
            .catch(console.error);
        }
      }
    }

    setTimeout(() => {
      this.refreshDataSources();
    }, 3000);
  }
  async refreshEntityTypes() {
    const businesses = await this.businessService.businessCollection.find({});

    for (const business of businesses) {
      const businessEntityTypes = await this.types(business._id.toString());

      for (const entityTypeName of businessEntityTypes) {
        const entityTypeQuery = await this.find({
          name: entityTypeName,
          _business: business._id.toString(),
          _entity: "_entity"
        });

        if (!entityTypeQuery[0]) {
          await this.insert({
            name: entityTypeName,
            _business: business._id.toString(),
            _entity: "_entity"
          });
        }
      }

      if (!this.dataSources[business._id.toString()])
        this.dataSources[business._id.toString()] = [];

      for (const dataSource of this.dataSources[business._id.toString()]) {
        const collections = await dataSource.provider.collections();

        for (const collectionName of collections) {
          const entityTypeQuery = await this.find({
            name: dataSource.model.name + "." + collectionName,
            _business: business._id.toString(),
            _entity: "_entity"
          });

          if (!entityTypeQuery[0]) {
            await this.insert({
              name: dataSource.model.name + "." + collectionName,
              _business: business._id.toString(),
              _entity: "_entity"
            });
          }
        }
      }
    }

    setTimeout(() => {
      this.refreshEntityTypes();
    }, 3000);
  }

  async insert(model: EntityModel): Promise<EntityModel> {
    if (!model._cdate) model._cdate = Date.now();

    return this.collection.insertOne(model).then(() => {
      if (model._entity != "_grid")
        this.notifyUsers("insert", model).catch(console.error);
    }) as any;
  }

  async update(model: EntityModel) {
    await this.notifyUsers("update", model);

    return this.collection.updateOne(model).then(() => {
      this.notifyUsers("update", model).catch(console.error);
    });
  }

  async delete(id: string, userId?: string) {
    return this.collection.deleteOne(id, userId).then(async model => {
      await this.notifyUsers("delete", model);
    });
  }

  async findById(
    id: string,
    skip?: number,
    limit?: number,
    entityName?: string,
    businessId?: string
  ) {
    var query = await this.find(
      { _id: id },
      skip,
      limit,
      entityName,
      businessId
    );

    if (query.length == 0) return undefined;
    else return query[0];
  }

  async findByBusinessId(id: string, skip?: number, limit?: number) {
    return this.collection.find({ _business: id.toString() }, skip, limit);
  }

  async find(
    query: any = {},
    skip?: number,
    limit?: number,
    entityName?: string,
    businessId?: string
  ): Promise<EntityModel[]> {
    if (!businessId) return this.collection.find(query, skip, limit);

    if (!this.dataSources[businessId]) this.dataSources[businessId] = [];
    const dataSource = this.dataSources[businessId].find(
      p =>
        p.model.name == entityName.split(".")[0] &&
        typeof entityName.split(".")[1] === "string"
    );
    if (dataSource) {
      if (query._entity) delete query._entity;

      return (await dataSource.provider.collection(
        entityName.split(".")[1]
      )).find(query);
    } else return this.collection.find(query, skip, limit);
  }

  async count(
    entityName: string,
    query: any = {},
    businessId: string
  ): Promise<Number> {
    if (!this.dataSources[businessId]) this.dataSources[businessId] = [];
    const dataSource = this.dataSources[businessId].find(
      p =>
        p.model.name == entityName.split(".")[0] &&
        typeof entityName.split(".")[1] === "string"
    );

    if (dataSource) {
      delete query._entity;
      return (await dataSource.provider.collection(
        entityName.split(".")[1]
      )).count(query);
    } else {
      return this.collection.count({
        ...{
          _entity: entityName,
          _business: businessId.toString()
        },
        ...query
      });
    }
  }

  async aggregate(
    entityName: string,
    pipeline: any[] = [],
    businessId: string
  ): Promise<string[]> {
    if (!this.dataSources[businessId]) this.dataSources[businessId] = [];
    const dataSource = this.dataSources[businessId].find(
      p =>
        p.model.name == entityName.split(".")[0] &&
        typeof entityName.split(".")[1] === "string"
    );
    if (dataSource) {
      if (pipeline[0] && pipeline[0].$match) {
        delete pipeline[0].$match._entity;
      }
      return (await dataSource.provider.collection(
        entityName.split(".")[1]
      )).aggregate(pipeline);
    } else {
      pipeline.unshift({ $match: { _business: businessId.toString() } });
      return this.collection.aggregate(pipeline);
    }
  }

  async types(businessId: string): Promise<string[]> {
    return (await this.collection.aggregate([
      { $match: { _business: businessId.toString() } },
      {
        $group: {
          _id: "$_entity"
        }
      }
    ]))
      .map(p => p._id)
      .filter(p => !p.startsWith("_"));
  }
}
