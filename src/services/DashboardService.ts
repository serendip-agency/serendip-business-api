
/**
 * @module Dashboard
 */

import { WebSocketInterface, WebSocketService } from "serendip";

import { BusinessService } from "./BusinessService";
import { EntityService } from "./EntityService";


export class DashboardService {
  constructor(
    private webSocketService: WebSocketService,
    private entityService: EntityService,
    private businessService: BusinessService
  ) {}

  async start() {
    this.webSocketService.messageEmitter.on(
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

          this.webSocketService.sendToUser(
            ws.token.userId,
            "/dashboard",
            JSON.stringify({ command: "change_grid", data: msg.data })
          );
        }
      }
    );
  }
}
