/**
 * @module Hooks
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
import * as jwt from "jsonwebtoken";
import * as sUtil from "serendip-utility";

import {
  BusinessCheckAccessResultInterface,
  BusinessService,
  EntityService
} from "../services";

export class HooksController {
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

  public submit: HttpEndpointInterface = {
    method: "POST",
    publicAccess: true,
    actions: [
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var entityName: string = req.body.entityName;

        var entityQuery = await this.entityService.find({
          _entity: "_entity",
          webhook: req.query.key
        });

        if (entityQuery[0]) {
          var entity = entityQuery[0];

          await this.entityService.insert({
            ...req.body,
            ...{
              _entity: entity.name,
              _business: entity._business
            },
            ...{
              req: {
                headers: req.headers,
                ip: req.ip()
              }
            }
          });
          done(200);
        } else {
          done(400, "entity not found");
        }
      }
    ]
  };

  public submitGet: HttpEndpointInterface = {
    method: "GET",
    route: "/api/hooks/submit",
    publicAccess: true,
    actions: [
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var entityName: string = req.body.entityName;

        var entityQuery = await this.entityService.find({
          _entity: "_entity",
          webhook: req.query.key
        });

        if (entityQuery[0]) {
          res.write(`
          <div style="font-family:monospace;">
          <b>This is the hook for:</b>
          <pre>
${JSON.stringify(entityQuery[0], null, 2)}
          </pre>
          for inserting data send a [POST] request to this url
          </div>
          `);
          done(200);
        } else {
          done(400, "entity not found");
        }
      }
    ]
  };
  public refresh: HttpEndpointInterface = {
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
        var entityName: string = req.body.entityName;

        var entityQuery = await this.entityService.find({
          _business: access.business._id.toString(),
          _entity: "_entity",
          name: entityName
        });

        if (entityQuery[0]) {
          var entity = entityQuery[0];

          entity.webhook = sUtil.text.randomAsciiString(64).toLowerCase();

          await this.entityService.update(entity);

          done(200);
        } else {
          done(400, "entity not found");
        }
      }
    ]
  };
}
