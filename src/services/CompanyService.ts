import { ServerServiceInterface, DbService, Server, DbCollection } from "serendip";
import { CrmModel, CompanyModel } from "../models";

export class CompanyService implements ServerServiceInterface {

    _dbService: DbService;
    _companyCollection: DbCollection<CompanyModel>;

    static dependencies = ["CrmService"];
    
    constructor() {

        this._dbService = Server.services["DbService"];
    }

    async start() {

        this._companyCollection = await this._dbService.collection<CompanyModel>('CrmCompanies', true);

    }







}