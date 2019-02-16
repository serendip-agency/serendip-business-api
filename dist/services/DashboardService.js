"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
class DashboardService {
    constructor() {
        this.dbService = serendip_1.Server.services["DbService"];
        this.authService = serendip_1.Server.services["AuthService"];
        this.wsService = serendip_1.Server.services["WebSocketService"];
        this.entityService = serendip_1.Server.services["EntityService"];
        this.businessService = serendip_1.Server.services["BusinessService"];
    }
    async start() {
        this.wsService.messageEmitter.on("/dashboard", async (input, ws) => {
            var msg = JSON.parse(input);
            msg.data = JSON.parse(msg.data);
            if (!(await this.businessService.userHasAccessToBusiness(ws.token.userId, msg.business))) {
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
                    .then(() => { })
                    .catch(() => { });
                // console.log(
                //   "grid sync from",
                //   ws.token.username,
                //   "to",
                //   msg.business,
                //   "section",
                //   msg.data.section
                // );
                this.wsService.sendToUser(ws.token.userId, "/dashboard", JSON.stringify({ command: "change_grid", data: msg.data }));
            }
        });
    }
}
DashboardService.dependencies = [
    "AuthService",
    "DbService",
    "EntityService",
    "WebSocketService"
];
exports.DashboardService = DashboardService;
