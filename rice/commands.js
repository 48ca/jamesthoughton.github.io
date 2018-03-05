"use strict";

var commands = {
    '': function() { return 0; },
    'ls': function(term, tokens) {
        console.log("Listing files");
        Object.keys(term.cdir.files).forEach(function(file) {
            term.printString(file + "   ");
        });
        term.printString("\n");
        return 0;
    },
    'cat': function(term, tokens) {
        if(tokens.length == 1) {
            term.printString("cat: no input files\n");
            return 1;
        }
        for(var i = 1; i < tokens.length; ++i) {
            var fn = tokens[i];
            if(!(fn in term.cdir.files)) {
                term.printString("cat: cannot open file '" + fn + "'\n");
            } else {
                term.printString(term.cdir.files[tokens[i]].contents);
            }
        }
        return 0;
    },
    'touch': function(term, tokens) {
        if(tokens.length == 1) {
            term.printString("touch: no input files\n");
            return 1;
        }
    },
    'cd': function(term, tokens) {
        if(tokens.length == 1) {
            term.printString("cd: no destination provided\n");
            return 1;
        }
        var dest = tokens[1].split('/');
        var cdir = term.cdir;
        for(var i = 0; i < dest.length; i++) {
            var fn = dest[i];
            if(fn in cdir.files) cdir = cdir.files[fn];
            else {
                term.printString("cd: '" + tokens[1] + "' directory not found\n");
                return 127;
            }
        }
        term.cdir = cdir;
        return 0;
    }
};
