"use strict";

class Terminal {
    constructor(body, win) {
        this.el = body;
        this.win = win;
        this.cdir = ['home', 'james'];
        this.command = ""; // current command string
        this.env = {
            PS1: "\\u \\w"
        };
        var t = this;
        win.addEventListener("keypress", function(event) {
            var key = event.key;
            var num = event.keyCode;
            // console.log("Got keycode " + num);
            // console.log("Got key: " + key);
            if(num == 127) {
                t.removeKeystroke();
                return;
            }
            t.addKeystroke(key, num);
        }, false);
        win.addEventListener("keydown", function(event) {
            // event for miscellaneous inputs
            switch(event.keyCode) {
                case 8: // backspace
                    t.removeKeystroke();
                    break;
                default:
                    // console.warn("Ignoring misc. keystroke (code " + event.keyCode + ")");
                    break;
            }
        });
        this.printPrompt();
    }
    addKeystroke(key, num, addToCommand = true) {
        if(num == 13) {
            this.el.innerHTML += "<br>";
            this.executeCommand();
            this.command = "";
            this.printPrompt();
        } else {
            var s = document.createElement("span");
            s.classList.add("char");
            s.innerHTML = key;
            if(addToCommand)
                this.command += key;
            this.el.appendChild(s);
        }
        // scroll on new keystroke
        this.scrollBottom();
    }
    removeKeystroke() {
        var last = this.el.lastChild;
        if(!last || last.nodeName != "SPAN" || this.command.length == 0) {
            console.warn("No character to remove");
            return;
        }
        this.command = this.command.slice(0, -1);
        this.el.removeChild(last);
        this.scrollBottom();
    }
    scrollBottom() {
        this.el.scrollTop = this.el.scrollHeight;
    }
    printString(str) {
        for(var c of str) {
            this.addKeystroke(c, 0, false);
        }
    }
    executeCommand() {
        var c = this.command;
        var tokens = c.split(" ");
        console.warn("Executing '" + c + "'");
    }
    printPrompt() {
        this.printString("$PS1 > ");
    }
};
