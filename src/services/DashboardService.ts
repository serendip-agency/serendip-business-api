import {
  Server,
  AuthService,
  WebSocketService,
  WebSocketInterface,
  DbService
} from "serendip";
import { EntityService } from "./EntityService";
import { EntityModel } from "../models";
import { BusinessService } from "./BusinessService";

export class DashboardService {
  static dependencies = [
    "AuthService",
    "DbService",
    "EntityService",
    "WebSocketService"
  ];

  private dbService: DbService;
  private authService: AuthService;
  private wsService: WebSocketService;
  private entityService: EntityService;
  private businessService: BusinessService;

  constructor() {
    this.dbService = Server.services["DbService"];
    this.authService = Server.services["AuthService"];
    this.wsService = Server.services["WebSocketService"];
    this.entityService = Server.services["EntityService"];
    this.businessService = Server.services["BusinessService"];
  }

  async start() {
    this.wsService.messageEmitter.on(
      "/dashboard",
      async (input: string, ws: WebSocketInterface) => {
        var msg: {
          command: "sync_grid";
          business: string;
          data: any;
        } = JSON.parse(input);

        msg.data = JSON.parse(msg.data);

        if (
          !(await this.businessService.userHasAccessToBusiness(
            ws.token.userId,
            msg.business
          ))
        ) {
          console.log("unauthorized access");
          return;
        }
        if (msg.command == "sync_grid") {
          this.entityService
            .insert({
              _business: msg.business,
              _entity: "grid",
              _cuser: ws.token.userId.toString(),
              _vuser: ws.token.userId.toString(),
              _vdate: Date.now(),
              _cdate: Date.now(),
              data: msg.data
            })
            .then(() => {})
            .catch(() => {});

          // console.log(
          //   "grid sync from",
          //   ws.token.username,
          //   "to",
          //   msg.business,
          //   "section",
          //   msg.data.section
          // );

          this.wsService.sendToUser(
            ws.token.userId,
            "/dashboard",
            JSON.stringify({ command: "change_grid", data: msg.data })
          );
        }
      }
    );
  }
}
