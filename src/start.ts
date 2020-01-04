#!/usr/bin/env node
import { run } from "./app";
import { HttpService } from "serendip";

run(process.env["MODE"] || 'single-user')
    .then(() => {
        console.log(`\n\n\topen dashboard at http://localhost:${HttpService.options.httpPort}\n\n`)
    })
    .catch(msg => console.log(msg));;