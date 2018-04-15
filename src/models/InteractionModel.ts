import { SaleModel } from "./SaleModel";
import { ServiceModel, ComplaintModel } from ".";
import { PersonModel } from "./PersonModel";

export class InteractionModel {

    company : string;
    person : string;
    sales : string[];
    services : string[];
    complaints : string[];

}