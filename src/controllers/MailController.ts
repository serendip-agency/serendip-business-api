import { AuthService, Server, ServerEndpointInterface } from 'serendip';

import { BusinessService } from '../services/BusinessService';
import { UserProfileService } from '../services/UserProfileService';

export class MailController {
  private businessService: BusinessService;
  private authService: AuthService;
  private userProfileService: UserProfileService;

  constructor() {
    this.businessService = Server.services["BusinessService"];
    this.authService = Server.services["AuthService"];
  }

  public counts: ServerEndpointInterface = {
    method: "get",
    actions: [
      async (req, res, next, done) => {
        var model = await this.businessService.findBusinessByMember(
          req.user._id.toString()
        );
        res.json(model);
      }
    ]
  };
}
