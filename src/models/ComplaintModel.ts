import { ServiceModel, ProductModel } from ".";
import { CrmModelInterface } from "../interfaces";

export class ComplaintModel implements CrmModelInterface {
    _id?: string;

    crm: string;

    services: ServiceModel[];

    products: ProductModel[];

    validate(): Promise<any> {
        throw new Error("Method not implemented.");
    }


}