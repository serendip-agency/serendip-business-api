#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const serendip_1 = require("serendip");
app_1.run(process.env["MODE"] || 'single-user')
    .then(() => {
    console.log(`\n\n\topen dashboard at http://localhost:${serendip_1.HttpService.options.httpPort}\n\n`);
})
    .catch(msg => console.log(msg));
;
