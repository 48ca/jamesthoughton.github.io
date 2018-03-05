"use strict";

class Terminal {
    constructor(body, win) {
        this.el = body;
        this.win = win;
        this.cdir = root.getDirectory(['home', 'james']);
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
            if(addToCommand) {
                this.executeCommand();
                this.command = "";
                this.printPrompt();
            }
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
            switch(c) {
                default:
                    this.addKeystroke(c, 0, false);
                    break;
                case '\n':
                    this.addKeystroke('', 13, false);
                    break;
                case '\t':
                    for(var i = 0; i < 4; ++i) this.addKeystroke(' ', 0, false);
                    break;
            }
        }
    }
    executeCommand() {
        var c = this.command;
        if(!c) return;
        var tokens = c.split(" ");
        console.warn("Executing '" + c + "'");
        if(!(tokens[0] in commands)) {
            // todo check for other executables?
            this.printString("sh: '" + tokens[0] + "' command not found\n");
        } else {
            commands[tokens[0]](this, tokens);
        }
    }
    printPrompt() {
        this.printString("$PS1 > ");
    }
};
