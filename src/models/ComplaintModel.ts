import { ServiceModel, ProductModel } from ".";
import { CrmModelInterface, ValidationErrorInterface } from "../interfaces";

export class ComplaintModel implements CrmModelInterface {
    _id?: string;

    crm: string;

    services: ServiceModel[];

    products: ProductModel[];

    static async validate(model: ComplaintModel): Promise<ValidationErrorInterface[]> {
        var errs: ValidationErrorInterface[] = [];



        return errs;
    }


}