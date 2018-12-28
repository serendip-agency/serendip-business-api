import {
  Server,
  AuthService,
  WebSocketService,
  WebSocketInterface,
  DbService,
  DbCollection
} from "serendip";
import { join, basename } from "path";
import * as fs from "fs-extra";
import * as _ from "underscore";
import * as glob from "glob";
import * as promise_serial from "promise-serial";
import { ObjectID } from "bson";
import * as mime from "mime-types";
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
  static dependencies = ["AuthService", "DbService", "WebSocketService"];

  private dbService: DbService;
  private authService: AuthService;
  private wsService: WebSocketService;
  usersCollection: DbCollection<{}>;
  businessesCollection: DbCollection<{}>;
  dataPath: string;

  constructor() {
    this.dbService = Server.services["DbService"];
    this.authService = Server.services["AuthService"];
    this.wsService = Server.services["WebSocketService"];
  }

  async userHasAccessToPath(userId: string, path: string): Promise<boolean> {
    if (!path.startsWith("users/") && !path.startsWith("businesses/"))
      return false;

    if (path.startsWith("users/" + userId + "/")) return true;

    if (path.startsWith("users/")) return false;

    var businessId = path.split("/")[1];

    var business: { members?: any },
      businessQuery = await this.businessesCollection.find({
        _id: new ObjectID(businessId)
      });

    business = businessQuery[0];

    var hasAccessToBusiness = _.any(business.members, {
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

    console.log(path);
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
    await this.wsService.sendToUser(userId, "/storage", JSON.stringify(model));
  }

  async getFilePartsInfo(
    filePath: string
  ): Promise<StorageFilePartInfoInterface[]> {
    var fileName = basename(filePath);

    var partFiles = (await fs.readdir(
      this.getDirectoryOfPath(filePath)
    )).filter(item => item.startsWith(fileName + "."));
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

  async assemblePartsIfPossible(filePath, userId) {
    console.log("assemblePartsIfPossible", filePath);
    if ((await this.uploadPercent(filePath)) < 100) return;

    fs.writeFileSync(filePath, "");

    var parts = await this.getFilePartsInfo(filePath);

    console.log("assembling to ", filePath);

    var packed = "";
    await promise_serial(
      parts.map(
        part => {
          return async () => {
            console.log("assembling   ", part.start, part.end);

            // packed += fs.readFileSync(part.path).toString();
            await fs.appendFile(
              filePath,
              fs.readFileSync(part.path).toString()
            );
            await fs.unlink(part.path);
          };
        },
        { parallelize: 1 }
      )
    );

    //  await this.writeBase64AsFile(packed, filePath);
    await this.writeBase64AsFile(
      fs.readFileSync(filePath).toString(),
      filePath
    );
  }

  getDirectoryOfPath(path: string): string {
    var pathSplit = path.split("/");
    pathSplit.pop();
    var pathDir = pathSplit.join("/");

    return pathDir;
  }

  async list(storagePath: string) {
    return promise_serial(
      _.map(
        await new Promise<string[]>((resolve, reject) => {
          glob(join(this.dataPath, storagePath), (err, matches) => {
            resolve(
              matches.filter(subPath => {
                return (
                  !subPath.endsWith(".part") &&
                  subPath !=
                    join(this.dataPath, this.getDirectoryOfPath(storagePath))
                );
              })
            );
          });
        }),
        subPath => {
          return async () => {
            var stat = await fs.stat(subPath);

            var model: any = {
              path: subPath.replace(this.dataPath + "/", ""),
              isFile: stat.isFile(),
              isLink: stat.isSymbolicLink(),
              isDirectory: stat.isDirectory(),
              size: stat.size,
              basename: basename(subPath),
              mime: mime.lookup(subPath),
              ext: subPath
                .split(".")
                .reverse()[0]
                .toLowerCase(),
              sizeInMB: parseFloat((stat.size / 1024 / 1024).toFixed(2))
            };

            if (stat.size == 0) {
              model.uploadPercent = await this.uploadPercent(subPath);
            }
            return model;
          };
        }
      ),
      { parallelize: 1 }
    );
  }
  async start() {
    this.dataPath = join(Server.dir, "..", "data");
    fs.ensureDirSync(this.dataPath);

    console.log(await this.list("users/5c1ebd3118fd58469acdd0aa/**"));

    this.usersCollection = await this.dbService.collection("Users");

    this.businessesCollection = await this.dbService.collection("Businesses");

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

    this.wsService.messageEmitter.on(
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
