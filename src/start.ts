#!/usr/bin/env node
import { run } from "./app";

run()
    .then(() => { })
    .catch(msg => console.log(msg));;