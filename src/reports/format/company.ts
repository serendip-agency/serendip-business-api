import { CompanyModel } from "../../models";
import { Server } from "serendip";
import { EntityService } from "../../services";
import { ObjectId } from "bson";

export const CompanyProducts = async (companyId: string, opts?: {}) => {
  var entityService: EntityService = Server.services["EntityService"];
  var query = await entityService.find({ _id: new ObjectId(companyId) });

  if(query[0]){
      
  }
  return [];
};

export const CompanyEmployees = async (companyId: string, opts?: {}) => {
  var entityService: EntityService = Server.services["EntityService"];

  return [];
};
