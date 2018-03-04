"use strict";

var ui = {
    screen: undefined,
    onload: function() {
        ui.screen = document.getElementById("screen");

        ui.options.defaults = {
            name: "Window",
            position: ui.options.position.default,
            background: ui.options.background.color(255, 255, 255, 255),
            titlebar: true,
            height: 360,
            type: "text",
            width: 480
        };

        Array.from(document.getElementById("templates").children).forEach(function(el) {
            console.log("Adding UI template for " + el.getAttribute("data-type"));
            ui.templates[el.getAttribute("data-type")] = el.innerHTML;
        });

        console.log("UI onload triggered");
        ui.addElement(
            {
                name: "Untitled",
                type: "terminal",
                position: ui.options.position.default,
                background: ui.options.background.color(255, 255, 255, 255)
            }
        );
        /*
        ui.addElement(
            {
                name: "Browser",
                type: "browser",
                position: ui.options.position.default
            }
        );
        */
        ui.addElement(
            {
                position: ui.options.position.center,
                titlebar: false,
                type: "text",
                width: 200,
                height: 100,
                background: ui.options.background.color(255, 0, 0)
            }
        );
    },
    addElement: function(options) {
        var ops = Object.assign({}, ui.options.defaults);
        Object.entries(options).forEach(function([key, value]) {
            if(typeof(ops[key]) === "undefined")
                console.warn("Using defined element var '" + key + "'");
            ops[key] = value;
        });

        var win = document.createElement("div");
        win.classList.add("window");
        win.setAttribute("data-name", ops.name);

        // titlebar
        if(ops.titlebar) {
            var titlebar = document.createElement("div");
            titlebar.classList.add("titlebar");
            var ihtml = ui.templates.titlebar;
            ihtml = ihtml.replace("{title}", ops.name);
            titlebar.innerHTML = ihtml;

            ui.generateDraggableEvents(titlebar, win);
            win.appendChild(titlebar);
        }

        // position
        var pos = ops.position(ops.width, ops.height);
        win.style.left = pos.left;
        win.style.top = pos.top;

        // background
        win.style[ops.background.property] = ops.background.data;

        // body
        var body = document.createElement("div");
        body.classList.add("window-" + ops.type);
        body.setAttribute("type", ops.type);
        body.style.width = ops.width + "px";
        body.style.height = ops.height + "px";
        switch(ops.type) {
            default:
                console.error("Tried to initialize a window of unknown type '" + ops.type + "'");
                break;
            case "browser":
                browser.createInstance(body);
                break;
            case "terminal":
                var t = new Terminal(body);
                break;
            case "text":
                body.innerHTML = "testtext";
                break;
        }
        win.appendChild(body);

        // append to screen
        ui.screen.appendChild(win);
        return win;
    },
    options: {
        position: {
            default: function() { return { left: 40, top: 20}; },
            centerOnLoad: function(w, h) { return { left: (window.w + w) / 2 + "px", top: (window.h + h) / 2 + "px" }; },
            center: function(w, h) { return { left: "calc(50% - " + w/2 + "px)", top: "calc(50% - " + h/2 + "px)" }; }
        },
        defaults: {}, // to be created
        background: {
            color: function(r, g, b, a = 255) {
                return { property: "backgroundColor", data: "rgba(" + r + "," + g + "," + b + "," + a + ")"};
            },
            image: function(url) {
                // TODO: Check URL
                return { property: "backgroundImage", data: "url("+url+")"};
            }
        }
    },
    generateDraggableEvents(titlebar, win) {
        var mdown = false;
        var initxoffset = undefined;
        var inityoffset = undefined;
        var initx = undefined;
        var inity = undefined;
        titlebar.addEventListener("mousedown", function(event) {
            mdown = true;
            initxoffset = event.screenX;
			inityoffset = event.screenY;
			var box = titlebar.getBoundingClientRect();
			initx = box.x;
			inity = box.y;
			disableSelect(document.body);
		});
        document.body.addEventListener("mousemove", function(event) {
            if(!mdown) return;
            event.stopPropagation();
            var l = initx + (event.screenX - initxoffset);
            var t = inity + (event.screenY - inityoffset);
            if(l < 0)
                win.style.left = "0";
            else
                win.style.left = l + "px";

            if(t < 0)
                win.style.top = "0";
            else
                win.style.top = t + "px";

        });
        document.body.addEventListener("mouseup", function(event) {
            mdown = false;
			enableSelect(document.body);
        });
    },
    templates: {} // to be created
};

window.addEventListener('load', ui.onload, false);

function disableSelect(el) {
	el.addEventListener("mousedown",disabler,"false");
}

function enableSelect(el){
	el.removeEventListener("mousedown",disabler,"false");
}

function disabler(e){
	if(e.preventDefault){ e.preventDefault(); }
	return false;
}
