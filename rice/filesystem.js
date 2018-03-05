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
    0: new User('root', ['root'], 0),
    1000: new User('james', ['home','james'], 1000)
}

class File {
    constructor(name, owner, attributes) {
        this.type = "file";
        this.name = name;
        this.owner = owner;
        this.attributes = attributes;
        this.contents = "";
        this.dir = undefined;
    }
    serialize() {
        return this.dir.serialize() + "/" + this.name;
    }
}
File.DEFAULT_ATTRS = 644;

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
    serialize() {
        if(this == root) return "/";
        else if(this.dir == root) return "/" + this.name;
        else return this.dir.serialize() + "/" + this.name;
    }
}

var root = new Directory("/", 0, 644);
root.files['..'] = root;
[
    new Directory("home", users[0], 644),
    new Directory("usr", users[0], 644),
    new Directory("etc", users[0], 644),
    new Directory("var", users[0], 644),
    new Directory("root", users[0], 600)
].forEach(function(dir) {
    root.addFile(dir);
});

root.files['home'].addFile(new Directory("james", users[1000], 644));
root.getDirectory(['home', 'james']).addFile(new File("test.txt", users[1000], 644));
root.getDirectory(['home', 'james']).files['test.txt'].contents = "test file\nnew line :)\n\ttab";
