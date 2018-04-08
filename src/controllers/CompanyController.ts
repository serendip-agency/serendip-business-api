import { ServerEndpointInterface } from "serendip";

export class CompanyController {


    static apiPrefix = "CRM";

    constructor() {



    }


    public list : ServerEndpointInterface ={
        actions : [
            (req,res,next,done)=>{

                res.json([]);

            }
        ],
        method : 'get'
    }


}