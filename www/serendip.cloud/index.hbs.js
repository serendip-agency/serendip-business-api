
/// <reference path="../serendip.d.ts" />

async () => {

%
    console.log(Date.now());

    Server.response.write(JSON.stringify(Server.request.ip()));

    Server.response.statusCode = 500;

    Server.response.end();
    return;
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });

    return {
        handlebars: Modules.handlebars,
        model: {
            name: 'mohsen',
            footer: {
                site_name: 'serendip.cloud'
            }
        }
    };

};
