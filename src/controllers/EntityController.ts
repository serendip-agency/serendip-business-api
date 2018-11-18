import {
  ServerEndpointInterface,
  Server,
  ServerError,
  ServerRequestInterface,
  ServerResponseInterface,
  DbService,
  Validator
} from "serendip";
import {
  EntityService,
  BusinessService,
  BusinessCheckAccessResultInterface
} from "../services";
import {
  EntityModel,
  ReportModel,
  ReportFieldQueryInterface,
  ReportFieldInterface,
  ReportInterface
} from "../models";
import * as archiver from "archiver";
import * as fs from "fs";
import { join } from "path";
import * as _ from "underscore";
import { ObjectID, ObjectId } from "bson";
import {
  ReportService,
  ReportOptionsInterface
} from "../services/ReportService";

export class EntityController {
  private entityService: EntityService;
  private businessService: BusinessService;
  private dbService: DbService;
  reportService: ReportService;

  constructor() {
    this.entityService = Server.services["EntityService"];
    this.businessService = Server.services["BusinessService"];
    this.dbService = Server.services["DbService"];
    this.reportService = Server.services["ReportService"];
  }

  public async onRequest(
    req: ServerRequestInterface,
    res: ServerResponseInterface,
    next,
    done
  ) {
    next();
  }

  public zip: ServerEndpointInterface = {
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

  public details: ServerEndpointInterface = {
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
        var model = await this.entityService.findById(req.body._id);

        if (!model) return new ServerError(404, "entity not found");

        if (model._business == access.business._id) res.json(model);
        else return new ServerError(404, "entity not found");
      }
    ]
  };

  public changes: ServerEndpointInterface = {
    route: "/api/entity/:entity/changes",
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

        if (req.body._id) {
          var actualRecord = await this.entityService.findById(req.body._id);
          if (!actualRecord)
            return next(new ServerError(400, "record not found"));

          var recordChanges = await this.dbService.entityCollection.find({
            entityId: actualRecord._id
          });

          res.json(recordChanges);
        } else {
          var changedRecords = _.map(
            await this.entityService.find({
              _business: access.business._id.toString(),
              _entity: req.params.entity,
              _vdate: {
                $gt: range.from,
                $lt: range.to
              }
            }),
            (item: EntityModel) => {
              return item._id;
            }
          );

          var deletedRecords = _.map(
            await this.dbService.entityCollection.find({
              "model.business": access.business._id.toString(),
              type: 0,
              date: { $gt: range.from, $lt: range.to }
            }),
            item => {
              return item.entityId;
            }
          );

          res.json({ changed: changedRecords, deleted: deletedRecords });
        }
      }
    ]
  };

  public list: ServerEndpointInterface = {
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
        var model = await this.entityService.find(
          {
            _business: access.business._id.toString(),
            _entity: req.params.entity
          },
          req.body.skip,
          req.body.limit
        );

        res.json(model);
      }
    ]
  };

  public count: ServerEndpointInterface = {
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
        var model = await this.entityService.count(access.business._id);
        res.json(model);
      }
    ]
  };

  public reportList: ServerEndpointInterface = {
    route: "/api/entity/reports",
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
        res.json(
          await this.reportService
            .aggregate([])
            .match({
              user: access.member.userId.toString(),
              _business: access.business._id.toString()
            })
            .project({
              _id: 1,
              label: 1,
              fields: 1,
              createDate: 1,
              user: 1,
              _business: 1
            })
            .toArray()
        );
      }
    ]
  };

  public report: ServerEndpointInterface = {
    route: "/api/entity/report",
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
        var opts: ReportOptionsInterface = {
          save: req.body.save,
          report: req.body.report,
          skip: req.body.skip || 0,
          limit: req.body.limit,
          access: access,
          zip: req.body.zip
        };

        var model = await this.reportService.report(opts);

        if (opts.zip) {
          res.setHeader("content-type", "application/zip");

          var zip = archiver("zip", {
            zlib: { level: 9 } // Sets the compression level.
          });

          zip.pipe(res);
          zip.append(JSON.stringify(model), { name: "data.json" });
          zip.finalize();
        } else res.json(model);
      }
    ]
  };

  public search: ServerEndpointInterface = {
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
        //{ '$regex': '.*' + req.body.query + '.*' }
        var model = await this.entityService.collection
          .aggregate([
            {
              $match: {
                $or: [{ name: { $regex: ".*" + req.body.query + ".*" } }]
              }
            }
          ])
          .project({ name: 1 })
          .limit(req.body.take)
          .toArray();
        res.json(model);
      }
    ]
  };

  public insert: ServerEndpointInterface = {
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
        var model: EntityModel = req.body;

        try {
          await EntityModel.validate(model);
        } catch (e) {
          return next(new ServerError(400, JSON.stringify(e)));
        }

        try {
          model = await this.entityService.insert(model);
        } catch (e) {
          return next(new ServerError(500, e.message || e));
        }

        res.json(model);
      }
    ]
  };

  public update: ServerEndpointInterface = {
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

        try {
          await EntityModel.validate(model);
        } catch (e) {
          return next(new ServerError(400, e.message || e));
        }

        try {
          await this.entityService.update(model);
        } catch (e) {
          return next(new ServerError(500, e.message || e));
        }

        res.json(model);
      }
    ]
  };

  public delete: ServerEndpointInterface = {
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

        if (!_id) return next(new ServerError(400, "_id is missing"));

        var entity = await this.entityService.findById(_id);
        if (!entity) return next(new ServerError(400, "entity not found"));

        try {
          await this.entityService.delete(_id, req.user._id);
        } catch (e) {
          return next(new ServerError(500, e.message || e));
        }

        res.json(entity);
      }
    ]
  };
}
