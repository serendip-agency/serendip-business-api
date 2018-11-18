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
  EntityModel,
  ReportInterface
} from "../models";

import { ObjectId, ObjectID } from "bson";
import { common } from "../reports/query/common";
import * as queryMethods from "../reports/query";
import * as formatMethods from "../reports/format";
import * as _ from "underscore";
import { BusinessCheckAccessResultInterface } from "./BusinessService";

export interface ReportOptionsInterface {
  report: ReportInterface;
  save: boolean;
  skip: number;
  limit: number;
  zip: boolean;
  access: BusinessCheckAccessResultInterface;
}
export class ReportService implements ServerServiceInterface {
  static dependencies = ["BusinessService", "EntityService", "DbService"];

  private _dbService: DbService;
  private _businessService: any;
  private _entityService: any;

  collection: DbCollection<ReportModel>;

  constructor() {
    this._dbService = Server.services["DbService"];
    this._entityService = Server.services["EntityService"];
    this._businessService = Server.services["BusinessService"];
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

  async report(opts: ReportOptionsInterface) {
    var reportFields: ReportFieldInterface[] = opts.report.fields || [];
    var model: ReportModel = null;
    if (opts.report._id) {
      var reportsInDb = await this.aggregate([])
        .match({
          _id: new ObjectID(opts.report._id),
          _business: opts.access.business._id.toString()
        })
        .toArray();

      if (reportsInDb[0]) model = reportsInDb[0];

      console.log(model.fields);
    }

    if (!model) {
      var dataQuery = this._entityService.collection.aggregate([
        {
          $match: {
            $and: [{ _business: opts.access.business._id.toString() }]
          }
        }
      ]);

      if (
        _.filter(reportFields, item => {
          return item.name.indexOf("__") != 0;
        }).length > 0
      )
        dataQuery = dataQuery.project(
          _.extend(
            {},
            ...reportFields.map(item => {
              var temp = {};
              if (item.name.indexOf("__") != 0 && item.enabled)
                temp[item.name] = 1;
              return temp;
            })
          )
        );

      var data = await dataQuery.toArray();
      data = await Promise.all(
        data.map((document, index) => {
          return this.formatDocument(document, reportFields);
        })
      );

      var queriedData = [];
      await Promise.all(
        data.map((document, index) => {
          return new Promise(async (resolve, reject) => {
            var isMatch = await this.documentMatchFieldQueries(
              document,
              reportFields
            );
            if (isMatch) queriedData.push(document);
            resolve();
          });
        })
      );

      model = {
        entityName: opts.report.entityName,
        name: opts.report.name,
        count: queriedData.length,
        data: queriedData,
        fields: reportFields,
        createDate: new Date(),
        label: opts.report.label,
        user: opts.access.member.userId,
        _business: opts.access.business._id.toString()
      };

      if (opts.save) model = await this.insert(model);
    }

    var result = _.rest(model.data, opts.skip);

    if (opts.limit) result = _.take(result, opts.limit);

    model.data = result;

    return model;
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
              value = await formatMethods[field.method](document._id, field);
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
        if (!field.enabled) return true;
        if (!field.queries) return true;
        return Promise.all(
          field.queries.map(query => {
            return new Promise(async (resolve, reject) => {
              if (!query.enabled) return resolve(true);

              console.log(
                query.enabled,
                field.enabled,
                query.method,
                record[field.name],
                query.methodInput
              );

              if (!query.methodInput) query.methodInput = {};

              if (common[query.method]) {
                if (!query.methodInput.value) query.methodInput.value = "";
                return resolve(
                  await common[query.method](
                    record[field.name],
                    query.methodInput.value
                  )
                );
              }
              if (queryMethods[query.method])
                return resolve(await queryMethods[query.method](record, query));
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
      _.flatten(results).filter(r => {
        return r == false;
      }).length == 0
    );
  }
}
