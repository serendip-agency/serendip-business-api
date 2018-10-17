import { CrmModelInterface, ValidationErrorInterface } from '../interfaces';

export class ServiceTypeModel implements CrmModelInterface {


    _id?: string;
    crm: string;
    static async validate(model: ServiceTypeModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];

        // if (!Validator.isLength(model.name, 3, 64))
        //     errs.push({ property: 'name', type: 'length' })

        if (errs && errs.length > 0)
            throw errs;

    }

    constructor(model: ServiceTypeModel) {

        if (model._id)
            this._id = model._id;

        this.crm = model.crm;


        this.name = model.name;

        this.price = model.price;

        this.priceCurrency = model.priceCurrency;

        this.period = model.period;

        this.periodUnit = model.periodUnit;

        this.periodAbsoluteExpiration = model.periodAbsoluteExpiration;
        this.periodRelevantExpiration = model.periodRelevantExpiration;

    }

    name: string;
    price: number;

    priceCurrency: string;

    period: number;
    periodUnit: string;

    periodAbsoluteExpiration: Date;
    periodRelevantExpiration: Date;

}