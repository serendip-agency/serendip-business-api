#!/usr/bin/env node
import { run } from "./app";

run(process.env["MODE"] || 'single-user')
    .then(() => { })
    .catch(msg => console.log(msg));;