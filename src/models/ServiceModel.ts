import { CrmModelInterface, ValidationErrorInterface } from "../interfaces";

export class ServiceModel implements CrmModelInterface {


    constructor(model?: ServiceModel) {

        if (model) {
            if (model._id)
                this._id = model._id;

            this.crm = model.crm;

            this.submitDate = model.submitDate;
            this.dueDate = model.dueDate;
            this.doneDate = model.doneDate;

            this.submitter = model.submitter;
            this.person = model.person;
            this.company = model.company;

            this.applicator = model.applicator;
            this.type = model.type;
            this.products = model.products;

            this.receivedDate = model.receivedDate;

            this.period = model.period;
            this.periodAbsoluteExpiration = model.periodAbsoluteExpiration;
            this.periodRelevantExpiration = model.periodRelevantExpiration;
            this.periodUnit = model.periodUnit;
            this.periodUntil = model.periodUntil;

            this.assurance = model.assurance;


        }
    }


    crm: string;

    _id?: string;


    receivedDate: Date;

    submitDate: Date;

    dueDate: Date;

    doneDate: Date;

    submitter: string;

    person: string;

    company: string;

    applicator: string;

    type: string;

    /**
     * related product
     */
    products: string[];


    period: number;
    periodUnit: string;
    periodUntil: Date;

    periodAbsoluteExpiration: Date;
    periodRelevantExpiration: Date;

    assurance: any;


    static async validate(model: ServiceModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];

        if (errs && errs.length > 0)
            throw errs;

    }

}