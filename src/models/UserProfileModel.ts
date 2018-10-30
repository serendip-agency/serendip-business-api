import { ValidationErrorInterface } from "./ValidationErrorInterface";



export class UserProfileModel {

    constructor(model?: UserProfileModel) {

        if (model) {
            if (model._id)
                this._id = model._id;

            this.firstName = model.firstName;
            this.lastName = model.lastName;

            this.oid = model.oid;
        }
    }


    static async validate(model: UserProfileModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];

        if (errs && errs.length > 0)
            throw errs;

    }

    oid?: string;

    _id?: string;

    firstName: string;
    lastName: string;
    profilePicture: string;

}