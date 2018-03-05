"use strict";

// maybe implement groups sometime

class User {
    constructor(username, home, uid) {
        this.username = username;
        this.home = home;
        this.uid = uid;
    }
}

var users = {
    0: new User('root', '/root', 0),
    1000: new User('james', '/home/james', 1000)
}

class File {
    constructor(name, owner, attributes) {
        this.type = "file";
        this.name = name;
        this.owner = owner;
        this.attributes = attributes;
        this.contents = "";
    }
}

class Directory {
    constructor(name, owner, attributes) {
        this.name = name;
        this.dir = '/';
        this.owner = owner;
        this.attributes = attributes;
        this.files = { '.': this }; // including subdirectories
        this.type = "directory";
    }
    addFile(file) {
        if(file.name in this.files) {
            if(file.type == "file" && file.type == this.files[file.name].type)
                console.warn("Writing over file " + file.name);
            else {
                return false;
            }
        }
        this.files[file.name] = file;
        file.dir = this;
        if(file.type == "directory") {
            file.files['..'] = this;
        }
        return true;
    }
    deleteFile(file) {
        if(file.name in this.files) {
            console.warn("Removing file " + file.name);
            delete this.files[file.name];
            return true;
        }
        return false;
    }
    getDirectory(files) {
        if(files.length == 0)
            return this;
        var f = files[0];
        var next = files.splice(1, files.length - 1);
        if(f in this.files) {
            return this.files[f].getDirectory(next);
        } else {
            console.error("Failed to find directory '" + f + "' inside directory '" + this.name + "'");
            return null;
        }
    }
}

var root = new Directory("/", 0, 666);
root.files['..'] = root;
[
    new Directory("home", 0, 666),
    new Directory("usr", 0, 666),
    new Directory("etc", 0, 666),
    new Directory("var", 0, 666),
    new Directory("root", 0, 600)
].forEach(function(dir) {
    root.addFile(dir);
});

root.files['home'].addFile(new Directory("james", 1000, 644));
root.getDirectory(['home', 'james']).addFile(new File("test.txt", 1000, 644));
root.getDirectory(['home', 'james']).files['test.txt'].contents = "test file\nnew line :)\n\ttab";
