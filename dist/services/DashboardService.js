"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
class DashboardService {
    constructor() {
        this.dbService = serendip_1.Server.services["DbService"];
        this.authService = serendip_1.Server.services["AuthService"];
        this.wsService = serendip_1.Server.services["WebSocketService"];
    }
    async start() {
        this.wsService.messageEmitter.on("/dashboard", (input, ws) => {
            var msg = JSON.parse(input);
            if (msg.command == "sync_grid") {
                this.wsService.sendToUser(ws.token.userId, "/dashboard", JSON.stringify({ command: "change_grid", data: msg.data }));
            }
        });
    }
}
DashboardService.dependencies = ["AuthService", "DbService", "WebSocketService"];
exports.DashboardService = DashboardService;
