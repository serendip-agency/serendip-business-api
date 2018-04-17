import { CrmModelInterface } from '../interfaces';
export class ProductCategoryModel implements CrmModelInterface {

    _id?: string;
    crm: string;
    validate(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    name: string;

}