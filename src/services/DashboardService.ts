import {
  Server,
  AuthService,
  WebSocketService,
  WebSocketInterface,
  DbService
} from "serendip";

export class DashboardService {
  static dependencies = ["AuthService", "DbService", "WebSocketService"];

  private dbService: DbService;
  private authService: AuthService;
  private wsService: WebSocketService;

  constructor() {
    this.dbService = Server.services["DbService"];
    this.authService = Server.services["AuthService"];
    this.wsService = Server.services["WebSocketService"];
  }

  async start() {
    this.wsService.messageEmitter.on(
      "/dashboard",
      (input: string, ws: WebSocketInterface) => {
        var msg: { command: "sync_grid"; data: any } = JSON.parse(input);
console.log(msg);
        if (msg.command == "sync_grid") {
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
