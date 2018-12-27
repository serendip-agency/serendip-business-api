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
  StorageCommandInterface,
  StorageService
} from "../services/StorageService";
import { join, basename } from "path";
import * as fs from "fs-extra";
import * as _ from "underscore";

import * as promise_serial from "promise-serial";
import { ObjectID } from "bson";
import {
  BusinessCheckAccessResultInterface,
  BusinessService
} from "../services";
export class StorageController {
  private storageService: StorageService;

  constructor() {
    this.storageService = Server.services["StorageService"];
  }

  public async onRequest(
    req: ServerRequestInterface,
    res: ServerResponseInterface,
    next,
    done
  ) {
    next();
  }

  public upload: ServerEndpointInterface = {
    method: "POST",
    actions: [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var command: StorageCommandInterface = req.body;

        if (!command) return;

        if (
          !(await this.storageService.userHasAccessToPath(
            req.user._id.toString(),
            command.path
          ))
        )
          return;

        await fs.ensureFile(join(this.storageService.dataPath, command.path));

        console.log(
          command.type,
          command.path,
          command.start,
          command.end,
          command.total
        );

        if (!command.total) {
          await this.storageService.writeBase64AsFile(
            command.data,
            command.path
          );
          done();
        } else {
          await this.storageService.checkPartsBeforeUpload(command);

          await fs.writeFile(
            join(this.storageService.dataPath, command.path) +
              `.${command.start || "0"}-${command.end || "0"}-${
                command.total
              }.part`,
            command.data
          );

          done();
        }
      }
    ]
  };
}
