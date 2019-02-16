import { AuthService, Server, HttpEndpointInterface } from "serendip";

import { BusinessService } from "../services/BusinessService";
import { UserProfileService } from "../services/UserProfileService";
export class MailController {
  private businessService: BusinessService;
  private authService: AuthService;
  private userProfileService: UserProfileService;

  constructor() {
    this.businessService = Server.services["BusinessService"];
    this.authService = Server.services["AuthService"];
  }
}
