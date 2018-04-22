import { CrmModelInterface } from "../interfaces";

export class ServiceModel implements CrmModelInterface {

    crm: string;

    _id?: string;

    date: number;

    serviceType : string;

    /**
     * related product
     */
    products : string[];

    // async validate() {

    // }



}