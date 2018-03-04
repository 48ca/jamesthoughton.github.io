"use strict";

class Terminal {
    constructor(body) {
        this.el = body;
        console.log(body);
        this.cdir = ['home', 'james'];
        body.addEventListener("keydown", function(event) {
            console.log(event);
            var key = event.key;
            var num = event.keyCode;
            console.log("Got keycode " + num);
        }, false);
    }
};
