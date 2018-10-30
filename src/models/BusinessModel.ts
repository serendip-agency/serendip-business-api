import { BusinessMemberModel } from ".";


export class BusinessModel {

    _id?: string;
    title: string;
    owner: string;
    subDomain: string;
    domain: string;
    members: BusinessMemberModel[];

    static async validate(model: BusinessModel) {

        if (!model)
            throw new Error('model empty');

        if (!model.title)
            throw new Error('model.title required');

        if (!model.owner)
            throw new Error('model.owner required');

    }
}