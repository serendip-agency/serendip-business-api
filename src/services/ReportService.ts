import {
  ServerServiceInterface,
  DbService,
  Server,
  DbCollection
} from "serendip";
import {
  ReportModel,
  ReportFieldQueryInterface,
  ReportFieldInterface,
  EntityModel
} from "../models";

import { ObjectId } from "bson";
import { common } from "../reports/query/common";
import * as queryMethods from "../reports/query";
import * as formatMethods from "../reports/format";
import * as _ from "underscore";

export class ReportService implements ServerServiceInterface {
  _dbService: DbService;
  collection: DbCollection<ReportModel>;

  static dependencies = ["BusinessService", "DbService"];

  constructor() {
    this._dbService = Server.services["DbService"];
  }

  async start() {
    this.collection = await this._dbService.collection<ReportModel>(
      "Reports",
      false
    );
  }

  async insert(model: ReportModel) {
    return this.collection.insertOne(model);
  }

  async update(model: ReportModel) {
    return this.collection.updateOne(model);
  }

  async delete(id, userId) {
    return this.collection.deleteOne(id, userId);
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

  aggregate(pipeline: any) {
    return this.collection.aggregate(pipeline);
  }

  async count(businessId: string): Promise<Number> {
    return this.collection.count({ business: businessId.toString() });
  }

  async formatDocument(document: EntityModel, fields: ReportFieldInterface[]) {
    var fieldsToFormat = await Promise.all(
      fields
        .filter(item => {
          return item.name.indexOf("__") == 0 && item.enabled;
        })
        .map(field => {
          return new Promise(async (resolve, reject) => {
            var value = null;

            if (formatMethods[field.method])
              value = await formatMethods[field.method](
                document._id,
                field.methodInputs
              );
            else value = document[field.name];

            var fieldToSet = {};
            fieldToSet[field.name] = value;
            resolve(fieldToSet);
          });
        })
    );

    return _.extend(document, ...fieldsToFormat);
  }

  async documentMatchFieldQueries(
    record: EntityModel,
    fields: ReportFieldInterface[]
  ): Promise<boolean> {
    var results = await Promise.all(
      fields.map(async field => {
        if (!field.queries) return true;
        return Promise.all(
          field.queries.map(query => {
            return new Promise(async (resolve, reject) => {
              if (common[query.method])
                return resolve(
                  await common[query.method](
                    record[field.name],
                    query.methodInput
                  )
                );

              if (queryMethods[query.method])
                resolve(await queryMethods[query.method](record, query));
              else {
                resolve(false);
                console.error("query-method-notfound", query);
              }
            });
          })
        );
      })
    );

    return (
      results.filter(r => {
        return !r;
      }).length == 0
    );
  }
}
