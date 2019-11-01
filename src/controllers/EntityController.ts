/**
 * @module Entity
 */
import * as archiver from "archiver";
import {
  DbService,
  HttpEndpointInterface,
  HttpError,
  HttpRequestInterface,
  HttpResponseInterface,
  Server,
  Validator
} from "serendip";
import { EntityChangeType, EntityModel } from "serendip-business-model";
import * as _ from "underscore";

import {
  BusinessCheckAccessResultInterface,
  BusinessService,
  EntityService
} from "../services";

export class EntityController {
  constructor(
    private entityService: EntityService,
    private dbService: DbService
  ) {}

  public async onRequest(
    req: HttpRequestInterface,
    res: HttpResponseInterface,
    next,
    done
  ) {
    next();
  }

  public zip: HttpEndpointInterface = {
    route: "/api/entity/:entity/zip",
    method: "post",
    isStream: true,
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var range = {
          from:
            req.body.from && Validator.isNumeric(req.body.from)
              ? req.body.from
              : 0,
          to:
            req.body.to && Validator.isNumeric(req.body.to)
              ? req.body.to
              : Date.now()
        };

        var model = await this.entityService.find({
          _business: access.business._id.toString(),
          _entity: req.params.entity,
          _vdate: { $gt: range.from, $lt: range.to }
        });

        res.setHeader("content-type", "application/zip");

        var zip = archiver("zip", {
          zlib: { level: 9 } // Sets the compression level.
        });

        zip.pipe(res);
        zip.append(JSON.stringify(model), { name: "data.json" });
        zip.finalize();
      }
    ]
  };

  public export: HttpEndpointInterface = {
    route: "/api/entity/export",
    method: "post",
    isStream: true,
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var range = {
          from:
            req.body.from && Validator.isNumeric(req.body.from)
              ? req.body.from
              : 0,
          to:
            req.body.to && Validator.isNumeric(req.body.to)
              ? req.body.to
              : Date.now()
        };

        var entities = await this.entityService.find({
          _business: access.business._id.toString(),
          _entity: "entity"
        });

        res.setHeader("content-type", "application/zip");

        var zip = archiver("zip", {
          zlib: { level: 9 } // Sets the compression level.
        });

        zip.pipe(res);

        const collections = ["dashboard", "entity", "form", "people", "report"];
        entities.forEach(item => {
          if (collections.indexOf(item.name) === -1)
            collections.push(item.name);
        });

        for (const entityName of collections) {
          const entityData = await this.entityService.find({
            _business: access.business._id.toString(),
            _vdate: { $gt: range.from, $lt: range.to },
            _entity: entityName
          });
          zip.append(JSON.stringify(entityData), {
            name: entityName + ".json"
          });
        }

        zip.finalize();
      }
    ]
  };

  public entityTypes: HttpEndpointInterface = {
    route: "/api/entity/types",
    method: "get",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        res.json(await this.entityService.types(access.business._id));
      }
    ]
  };

  public details: HttpEndpointInterface = {
    route: "/api/entity/:entity/details",
    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var model = await this.entityService.findById(
          req.body._id,
          req.query.skip,
          req.query.limit,
          req.params.entity,
          access.business._id
        );

        console.log(model);

        if (!model) return done(404, "entity not found");

        res.json(model);
      }
    ]
  };

  // public groups: HttpEndpointInterface = {
  //   route: "/api/entity/groups",
  //   method: "post",
  //   actions: [
  //     BusinessService.checkUserAccess,
  //     async (
  //       req,
  //       res,
  //       next,
  //       done,
  //       access: BusinessCheckAccessResultInterface
  //     ) => {
  //       (await this.entityService.findByBusinessId(
  //         access.business._id.toString()
  //       )).reduce((prev: any, current) => {
  //         if (!prev) {
  //           prev = [];
  //           prev.push(current._entity);
  //         } else if (prev.indexOf(current._entity) === -1)
  //           prev.push(current._entity);

  //         return prev;
  //       });
  //     }
  //   ]
  // };

  public changes: HttpEndpointInterface = {
    route: "/api/entity/changes",
    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        const possibleQueryFields = [
          "_id",
          "model._id",
          "model._rdate",
          "model._udate",
          "model._vdate",
          "model._cdate",
          "model._ruser",
          "model._uuser",
          "model._vuser",
          "model._cuser",
          "model._entity",
          "type"
        ];

        const changesCollection = await this.dbService.collection(
          "EntityChanges"
        );
        var query = _.extend(
          {
            "model._business": access.business._id.toString()
          },
          _.pick(req.body, possibleQueryFields)
        );

        if (req.body.count) {
          res.json(await changesCollection.count(query));
        } else {
          const changesQuery: {
            type: EntityChangeType;
            _id: string;
          }[] = (await changesCollection.find(query)).map((p: EntityModel) => {
            return { type: p.type, _id: p.model._id };
          });

          res.json({
            created: changesQuery.filter(p => p.type == EntityChangeType.Create)
              .length,
            updated: changesQuery.filter(p => p.type == EntityChangeType.Update)
              .length,
            deleted: changesQuery
              .filter(p => p.type == EntityChangeType.Create)
              .map(item => item._id)
          });
        }
      }
    ]
  };

  // public entityChanges: HttpEndpointInterface = {
  //   route: "/api/entity/:entity/changes",
  //   method: "post",
  //   actions: [
  //     BusinessService.checkUserAccess,
  //     async (
  //       req,
  //       res,
  //       next,
  //       done,
  //       access: BusinessCheckAccessResultInterface
  //     ) => {
  //       var range = {
  //         from:
  //           req.body.from && Validator.isNumeric(req.body.from)
  //             ? req.body.from
  //             : 0,
  //         to:
  //           req.body.to && Validator.isNumeric(req.body.to)
  //             ? req.body.to
  //             : Date.now()
  //       };

  //       if (req.body._id) {
  //         var actualRecord = await this.entityService.findById(req.body._id);
  //         if (!actualRecord)
  //           return next(new HttpError(400, "record not found"));

  //         var recordChanges = await this.dbService.entityChangeCollection.find({
  //           entityId: actualRecord._id
  //         });

  //         res.json(recordChanges);
  //       } else {
  //         var changedRecords = _.map(
  //           await this.entityService.find({
  //             _business: access.business._id.toString(),
  //             _entity: req.params.entity,
  //             _vdate: {
  //               $gt: range.from,
  //               $lt: range.to
  //             }
  //           }),
  //           (item: EntityModel) => {
  //             return item._id;
  //           }
  //         );

  //         var deletedRecords = _.map(
  //           await this.dbService.entityChangeCollection.find({
  //             "model.business": access.business._id.toString(),
  //             type: 0,
  //             date: { $gt: range.from, $lt: range.to }
  //           }),
  //           item => {
  //             return item.entityId;
  //           }
  //         );

  //         res.json({ changed: changedRecords, deleted: deletedRecords });
  //       }
  //     }
  //   ]
  // };

  public list: HttpEndpointInterface = {
    route: "/api/entity/:entity/list",

    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        const query = req.body.query || {};

        const model = await this.entityService.find(
          _.extend(query, {
            _business: access.business._id.toString(),
            _entity: req.params.entity
          }),
          req.body.skip,
          req.body.limit
        );

        res.json(model);
      }
    ]
  };

  public aggregate: HttpEndpointInterface = {
    route: "/api/entity/:entity/aggregate",

    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        const model = await this.entityService.aggregate(
          req.params.entity,
          req.body.pipeline,
          access.business._id
        );

        res.json(model);
      }
    ]
  };

  public count: HttpEndpointInterface = {
    route: "/api/entity/:entity/count",
    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var model = await this.entityService.count(
          req.params.entity,
          req.body.query,
          access.business._id
        );
        res.json(model);
      }
    ]
  };

  public search: HttpEndpointInterface = {
    route: "/api/entity/:entity/search",
    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        const queryText = req.body.query,
          propertiesToSearch = req.body.properties || [];

        if (propertiesToSearch.indexOf("_id") === -1)
          propertiesToSearch.push("_id");

        const query = {
          _entity: req.params.entity,
          _business: access.business._id.toString(),
          $or: []
        };

        for (const prop of propertiesToSearch) {
          const subQuery = {};
          subQuery[prop] = { $regex: ".*" + queryText + ".*", $options: "i" };
          query.$or.push(subQuery);
        }

        console.log(JSON.stringify(query, null, 2));

        var model = await this.entityService.collection.find(query);
        res.json(model);
      }
    ]
  };

  public insert: HttpEndpointInterface = {
    route: "/api/entity/:entity/insert",
    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        let model: EntityModel = req.body;

        if (!model._entity) model._entity = req.params.entity;

        if (!model._business) model._business = access.business._id.toString();

        model._cuser = model._vuser = access.member.userId.toString();

        if (!model._vdate) model._vdate = Date.now();

        if (!model._cdate) model._cdate = Date.now();

        try {
          model = await this.entityService.insert(model);
        } catch (e) {
          return done(500, e.message || e);
        }

        res.json(model);
      }
    ]
  };

  public update: HttpEndpointInterface = {
    route: "/api/entity/:entity/update",

    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var model: EntityModel = req.body;

        if (!model._entity) model._entity = req.params.entity;

        model._vuser = model._uuser = access.member.userId.toString();
        model._vdate = model._udate = Date.now();

        try {
          await EntityModel.validate(model);
        } catch (e) {
          return next(new HttpError(400, e.message || e));
        }

        try {
          await this.entityService.update(model);
        } catch (e) {
          return next(new HttpError(500, e.message || e));
        }

        res.json(model);
      }
    ]
  };

  public delete: HttpEndpointInterface = {
    route: "/api/entity/:entity/delete",
    method: "post",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var _id = req.body._id;

        if (!_id) return next(new HttpError(400, "_id is missing"));

        var entity = await this.entityService.findById(_id);
        if (!entity) return next(new HttpError(400, "entity not found"));

        if (entity._business.toString() != access.business._id.toString())
          return next(new HttpError(400, "access mismatch"));

        entity._vdate = entity._rdate = Date.now();

        entity._ruser = entity._vuser = access.member.userId.toString();

        await this.entityService.update(entity);

        try {
          await this.entityService.delete(_id, req.user._id);
        } catch (e) {
          return next(new HttpError(500, e.message || e));
        }

        res.json(entity);
      }
    ]
  };
}
