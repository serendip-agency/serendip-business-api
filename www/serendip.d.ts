/// <reference path="../../node_modules/request/index.js" />

import { ServerRequestInterface, ServerResponseInterface } from "serendip";
import { Underscore } from "underscore";
import request = require("request");
import moment = require("moment");

declare global {

    const Modules: {
        _: Underscore,
        request: request,
        handlebars: Handlebars,
        moment: moment
    }
    const Server: {
        request: ServerRequestInterface,
        response: ServerResponseInterface
    }

}