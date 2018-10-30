export class ReportModel {

        _id?: string;

        fields: { name: string, template: string, method?: string, methodInputs: any }[];

        entity: string;

        data: any[];

        createDate: Date;

        user?: string;
        client?: string;

}