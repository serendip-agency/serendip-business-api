import { CrmMemberModel } from ".";

export class CrmModel {

    _id?: string;
    title: string;
    owner: string;
    subDomain: string;
    domain: string;
    members: CrmMemberModel[];

    static async validate(model: CrmModel) {

        if (!model)
            throw new Error('model empty');

        if (!model.title)
            throw new Error('model.title required');

        if (!model.owner)
            throw new Error('model.owner required');

    }
}