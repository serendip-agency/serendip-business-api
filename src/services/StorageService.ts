/**
 * @module Storage
 */

import {
  Server,
  AuthService,
  WebSocketService,
  WebSocketInterface,
  DbService
} from "serendip";
import { join, basename } from "path";
import * as fs from "fs-extra";
import * as _ from "underscore";
import * as glob from "glob";
import * as promise_serial from "promise-serial";
import { ObjectID } from "bson";
import * as mime from "mime-types";
import * as multiStream from "multistream";
import * as os from 'os';

import {
  UserModel,
  BusinessModel,
  DbCollectionInterface
} from "serendip-business-model";

export interface StorageCommandInterface {
  type: "upload" | "download" | "assemble";
  path: string;
  data?: string;
  start?: number;
  end?: number;
  total?: number;
}

export interface StorageFilePartInfoInterface {
  path: string;
  start: number;
  end: number;
  total: number;
}

export class StorageService {
  usersCollection: DbCollectionInterface<UserModel>;
  businessesCollection: DbCollectionInterface<BusinessModel>;
  dataPath: string;
  filesCollection: DbCollectionInterface<any>;
  chunksCollection: DbCollectionInterface<any>;

  constructor(
    private dbService: DbService,
    private webSocketService: WebSocketService
  ) {}

  async userHasAccessToPath(userId: string, path: string): Promise<boolean> {
    if (!path.startsWith("/users/") && !path.startsWith("/businesses/"))
      return false;

    if (path.startsWith("/users/" + userId + "/")) return true;

    if (path.startsWith("/users/")) return false;

    // extract id from paths like businesses/_id
    const businessId = path.split("/")[2];

    let business: { members?: any },
      businessQuery = await this.businessesCollection.find({
        _id: new ObjectID(businessId)
      });

      
    business = businessQuery[0];

    let hasAccessToBusiness = _.any(business.members, {
      userId: userId.toString()
    });

    return hasAccessToBusiness;
  }

  async writeBase64AsFile(base64, path) {
    var matches = base64.match(/^data:([0-9A-Za-z-+\/]+);base64,(.+)$/);

    console.log(
      matches ? matches[2].length : "",
      base64.slice(0, 100).toString()
    );

    var buffer = new Buffer(
      matches && matches[2] ? matches[2] : base64,
      "base64"
    );

    await fs.writeFile(path, buffer);
    // await fs.writeFile(join(this.dataPath, path), base64, 'base64');
  }

  async notifyUser(
    userId,
    model: {
      type: "command_done" | "command_failed" | "parts_total_mismatch";
      path: string;
    }
  ) {
    await this.webSocketService.sendToUser(
      userId,
      "/storage",
      JSON.stringify(model)
    );
  }

  async getFilePartsInfo(
    filePath: string
  ): Promise<StorageFilePartInfoInterface[]> {
    var fileName = basename(filePath);

    var partFiles = (await fs.pathExists(this.getDirectoryOfPath(filePath)))
      ? (await fs.readdir(this.getDirectoryOfPath(filePath))).filter(item =>
          item.startsWith(fileName + ".")
        )
      : [];
    var parts: StorageFilePartInfoInterface[] = [];

    var totalMisMatch = false;

    partFiles.forEach(partFileName => {
      var numbers = partFileName
        .replace(".part", "")
        .split(".")
        .reverse()[0]
        .split("-");

      var part = {
        path: join(this.getDirectoryOfPath(filePath), partFileName),
        start: parseInt(numbers[0]),
        end: parseInt(numbers[1]),
        total: parseInt(numbers[2])
      };

      parts.push(part);

      if (_.where(parts, { total: part.total }).length != parts.length)
        totalMisMatch = true;
    });

    if (totalMisMatch) {
      console.log("totalMisMatch");
      await Promise.all(parts.map(item => fs.unlink(item.path)));

      return [];
    } else
      return _.sortBy(parts, part => {
        return part.start;
      });
  }
  /**
   * calculate upload percent base on uploaded parts divide by total
   */
  async uploadPercent(filePath) {
    var parts = await this.getFilePartsInfo(filePath);

    if (parts.length == 0) return 0;
    var total = parts[0].total;

    var done = _.reduce(
      parts as any,
      (mem: number, item: StorageFilePartInfoInterface) => {
        return mem + item.end - item.start;
      },
      0
    );

    var p = parseFloat(((done / total) * 100).toFixed(2));

    console.log("uploaded parts of " + filePath, p + "%");

    return p;
  }
  async checkPartsBeforeUpload(command: StorageCommandInterface) {
    this.getFilePartsInfo(join(this.dataPath, command.path));
  }

  /**
   * check .part files for specific filePath if all required files are available it will get assemble the file
   */
  async assemblePartsIfPossible(filePath, userId) {
    console.log("assemblePartsIfPossible", filePath);
    if ((await this.uploadPercent(filePath)) < 100) return;

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    var parts = await this.getFilePartsInfo(filePath);
    var uploadName = filePath.replace(this.dataPath, "");
    if (!uploadName.startsWith("/")) uploadName = "/" + uploadName;
    await new Promise(async (resolve, reject) => {
      multiStream(parts.map(p => fs.createReadStream(p.path)))
        .pipe(
          await this.dbService.openUploadStreamByFilePath(uploadName, {
            userId
          })
        )
        .on("finish", () => {
          resolve();
        });
    });

    // await promise_serial(
    //   parts.map(
    //     part => {
    //       return async () => {
    //         console.log("assembling   ", part.start, part.end);

    //         await fs.appendFile(
    //           filePath,
    //           fs.readFileSync(part.path).toString(), { encoding: 'binary' }
    //         );
    //         //   await fs.unlink(part.path);
    //       };
    //     },
    //     { parallelize: 1 }
    //   )
    // );

    // //  await this.writeBase64AsFile(packed, filePath);
    // await this.writeBase64AsFile(
    //   fs.readFileSync(filePath).toString(),
    //   filePath
    // );
  }

  getDirectoryOfPath(path: string): string {
    var pathSplit = path.split("/");
    pathSplit.pop();
    var pathDir = pathSplit.join("/");

    return pathDir;
  }

  // async list(storagePath: string) {
  //   return promise_serial(
  //     _.map(
  //       await new Promise<string[]>((resolve, reject) => {
  //         glob(join(this.dataPath, storagePath), (err, matches) => {
  //           resolve(
  //             matches.filter(subPath => {
  //               return (
  //                 !subPath.endsWith(".part") &&
  //                 subPath !=
  //                 join(this.dataPath, this.getDirectoryOfPath(storagePath))
  //               );
  //             })
  //           );
  //         });
  //       }),
  //       subPath => {
  //         return async () => {
  //           var stat = await fs.stat(subPath);

  //           var model: any = {
  //             path: subPath.replace(this.dataPath + "/", ""),
  //             isFile: stat.isFile(),
  //             isLink: stat.isSymbolicLink(),
  //             isDirectory: stat.isDirectory(),
  //             size: stat.size,
  //             basename: basename(subPath),
  //             mime: mime.lookup(subPath),
  //             ext: subPath
  //               .split(".")
  //               .reverse()[0]
  //               .toLowerCase(),
  //             sizeInMB: parseFloat((stat.size / 1024 / 1024).toFixed(2))
  //           };

  //           if (stat.size == 0) {
  //             model.uploadPercent = await this.uploadPercent(subPath);
  //           }
  //           return model;
  //         };
  //       }
  //     ),
  //     { parallelize: 1 }
  //   );
  // }
  async start() {
    this.filesCollection = await this.dbService.collection<any>(
      "fs.files",
      false
    );
    this.chunksCollection = await this.dbService.collection<any>(
      "fs.chunks",
      false
    );
    this.filesCollection.ensureIndex({ filename: 1 }, { unique: true });

    this.dataPath = join(os.homedir(), ".serendip", "temp");


    await fs.ensureDir(this.dataPath);

    this.usersCollection = await this.dbService.collection<UserModel>("Users");

    this.businessesCollection = await this.dbService.collection<BusinessModel>(
      "Businesses"
    );

    var ensureDirPromises = [];

    (await this.usersCollection.find({})).forEach((item: any) => {
      ensureDirPromises.push(() =>
        fs.ensureDir(join(this.dataPath, "users", item._id.toString()))
      );
    });

    (await this.businessesCollection.find({})).forEach((item: any) => {
      ensureDirPromises.push(() =>
        fs.ensureDir(join(this.dataPath, "businesses", item._id.toString()))
      );
    });

    await promise_serial(ensureDirPromises, { parallelize: 100 });

    this.webSocketService.messageEmitter.on(
      "/storage",
      async (input: string, ws: WebSocketInterface) => {
        var command: StorageCommandInterface;
        try {
          command = JSON.parse(input);
        } catch (error) {}

        if (!command) return;

        if (!(await this.userHasAccessToPath(ws.token.userId, command.path)))
          return;

        if (command.type === "assemble") {
          await this.assemblePartsIfPossible(
            join(this.dataPath, command.path),
            ws.token.userId
          );
        }
      }
    );
  }
}
