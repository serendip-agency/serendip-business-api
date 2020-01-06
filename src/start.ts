#!/usr/bin/env node
import { run } from "./app";
import { HttpService } from "serendip";
import * as open from 'open';
const mode = process.env["MODE"] || 'single-user';
const url = `http://localhost:${HttpService.options.httpPort}`;

run(mode)
    .then(() => {

        if (mode == 'single-user') {

            if (!process.env['NO_BROWSER'])
                open(url).then(() => { }).catch((err) => {
                    console.error('error opening dashboard on browser', err)
                })
        }

        console.log(`\n\n\topen dashboard at ${url}\n\n`)
    })
    .catch(msg => console.log(msg));;