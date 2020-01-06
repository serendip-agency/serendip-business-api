#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const serendip_1 = require("serendip");
const open = require("open");
const mode = process.env["MODE"] || 'single-user';
const url = `http://localhost:${serendip_1.HttpService.options.httpPort}`;
app_1.run(mode)
    .then(() => {
    if (mode == 'single-user') {
        if (!process.env['NO_BROWSER'])
            open(url).then(() => { }).catch((err) => {
                console.error('error opening dashboard on browser', err);
            });
    }
    console.log(`\n\n\topen dashboard at ${url}\n\n`);
})
    .catch(msg => console.log(msg));
;
