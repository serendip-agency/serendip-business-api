
/// <reference path="../serendip.d.ts" />


async () => {



    // Server.response.send(Server.request.ip());
    // Server.response.end();


    return {
        handlebars: Modules.handlebars,
        model: {
            name: 'mohsen',
            footer:{
                site_name:'serendip.cloud'
            }
        }
    };

};
