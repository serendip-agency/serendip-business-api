import { CrmModelInterface, ValidationErrorInterface } from "../interfaces";

export class AssuranceTemplateModel implements CrmModelInterface {

    static async validate(model: AssuranceTemplateModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];

        if (errs && errs.length > 0)
            throw errs;
    }

    crm: string;


    // could be warranty or guarantee
    type: string;

    _id?: string;

    checklist: string[];

    absoluteExpiration: Date;

    relativeExpiration: Number;
    relativeExpirationUnit: string;


    constructor(model: AssuranceTemplateModel) {

        if (model._id)
            this._id = model._id;

        this.crm = model.crm;
        this.checklist = model.checklist;
    }

}