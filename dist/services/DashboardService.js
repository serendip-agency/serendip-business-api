"use strict";
/**
 * @module Dashboard
 */
Object.defineProperty(exports, "__esModule", { value: true });
class DashboardService {
    constructor(webSocketService, entityService, businessService) {
        this.webSocketService = webSocketService;
        this.entityService = entityService;
        this.businessService = businessService;
    }
    async start() {
        console.log('starting dashboard service');
        this.webSocketService.messageEmitter.on("/dashboard", async (input, ws) => {
            console.log(input);
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
                    _entity: "_grid",
                    _cuser: ws.token.userId.toString(),
                    _vuser: ws.token.userId.toString(),
                    _vdate: Date.now(),
                    _cdate: Date.now(),
                    data: msg.data
                })
                    .then(() => { })
                    .catch((e) => {
                    console.error('error sync_grid insert', e);
                });
                // console.log(
                //   "grid sync from",
                //   ws.token.username,
                //   "to",
                //   msg.business,
                //   "section",
                //   msg.data.section
                // );
                this.webSocketService.sendToUser(ws.token.userId, "/dashboard", JSON.stringify({ command: "change_grid", data: msg.data }));
            }
        });
    }
}
exports.DashboardService = DashboardService;
