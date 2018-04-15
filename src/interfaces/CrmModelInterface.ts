export interface CrmModelInterface {

    /**
     * related CRM
     */
    crm: string;



    /**
     * model validation
     */
   validate(): Promise<any>;


}