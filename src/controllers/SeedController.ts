/**
 * @module Entity
 */
import * as archiver from "archiver";
import  axios from 'axios'
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

export class SeedController {
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

  public importFromUrl: HttpEndpointInterface = {
    route: "/api/seed/import_form_url",

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

 
}
