import { SaleModel } from "./SaleModel";
import { ServiceModel, ComplaintModel } from ".";
import { PersonModel } from "./PersonModel";
import { CrmModelInterface } from "../interfaces";

export class InteractionModel implements CrmModelInterface {

    _id?: string;
    crm: string;
    validate(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    company: string;
    person: string;
    sales: string[];
    services: string[];
    complaints: string[];

}