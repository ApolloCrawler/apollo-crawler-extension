/**
 * Created by tomaskorcak on 8/24/14.
 */

(function () {
    var clickNo = null;
    var minPathsCount = null;
    var paths = null;

    var initializeVariables = function() {
        clickNo = 0;
        minPathsCount = 2;
        paths = [];
    };

    /**
     * Prints selector of clicked element to console, very useful.
     */
    var diff = function (paths) {
        var path1 = paths[0];
        var path2 = paths[1];

        var tokens1 = path1.split(' > ');
        var tokens2 = path2.split(' > ');

        var result = tokens1.map(function (value, index) {
            if (value == tokens2[index]) {
                return value;
            }

            return value.split('.')[0].split('#')[0];
        });

        // paths.slice(0, 2);

        var selector = result.join(' > ');

        return selector;
    };

    var getLink = function (element) {
        while (element) {
            if (element.nodeName == 'A') {
                return element['href'];
            }
            element = element.parentNode;
        }
    };

    var getImg = function (element) {
        while (element) {
            if (element.nodeName == 'IMG') {
                return element['src'];
            }
            element = element.parentNode;
        }
    };

    var initializeSave = function () {
        console.log('Apollo: Initializing console.save()');

        console.save = function (data, filename) {

            if (!data) {
                console.error('Console.save: No data')
                return;
            }

            if (!filename) filename = 'console.json'

            if (typeof data === "object") {
                data = JSON.stringify(data, undefined, 4)
            }

            var blob = new Blob([data], {type: 'text/json'}),
                e = document.createEvent('MouseEvents'),
                a = document.createElement('a')

            a.download = filename
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(e)
        }
    };

    var initializeGetPath = function() {
        console.log('Apollo: Initializing jquery.getPath()');

        jQuery.fn.getPath = function () {
            if (this.length != 1) {
                throw 'Requires one element.';
            }

            var path = null, node = this;
            while (node.length) {
                var realNode = node[0], name = realNode.localName;
                if (!name) break;
                name = name.toLowerCase();

                var parent = node.parent();

                var rnid = realNode['id'];
                if (rnid) {
                    name += '#' + rnid;
                } else {
                    var rnclass = realNode.attributes['class'];
                    if (rnclass) {
                        var class_val = rnclass.value || '';
                        if(class_val != '') {
                            class_val = class_val.trim();
                            class_val = class_val.replace(/ +(?= )/g,'');
                            name += "." + class_val.split(' ').sort().join('.');
                        }
                    }
                }

                /*
                 var siblings = parent.children(name);
                 if (siblings.length > 1) {
                 name += ':eq(' + siblings.index(realNode) + ')';
                 }
                 */

                path = name + (path ? ' > ' + path : '');
                node = parent;
            }

            return path;
        };
    };

    var clickHandler = function (e) {
        var doc = jQuery(this);
        var path = doc.getPath();

        paths[clickNo] = path;

        // Print path
        console.log('Apollo: Clicked path - ' + path);

        e.preventDefault();
        e.stopPropagation();

        clickNo++;

        if (clickNo >= minPathsCount) {
            var unipath = diff(paths);

            console.log('Apollo: Unified path - ' + unipath);

            var elements = jQuery(unipath);
            if (elements) {
                var randomColor = Math.floor(Math.random() * 16777215).toString(16);
                var oldBorder = elements.css('border');
                elements.css('border', '2px solid #' + randomColor);

                setTimeout(function() {
                    elements.css('border', oldBorder);
                }, 10000);
            }

            var data = elements.map(function (_elem) {
                var res = {};

                // Try to extract link
                var link = getLink(this);
                if (link) {
                    res['link'] = link;
                }

                // Try to extract inner text
                var text = this.innerText;
                if(text) {
                    text = text.trim();
                    if(text != '') {
                        res['text'] = text;
                    }
                }

                // Try to extract image
                var img = getImg(this);
                if(img) {
                    res['img'] = img;
                }

                return res;
            });

            var raw = {
                clicked: paths,
                selector: unipath,
                data: data.toArray()
            };

            var rawJson = JSON.stringify(raw, null, 4);
            console.save(rawJson, 'data.json');
            console.log(rawJson);

            // Uninstall click handler
            // removeHook();
        }
    };

    var initializeHook = function () {
        console.log('Apollo: Initializing click hook');

        jQuery("*").bind('click', clickHandler);
    };

    var removeHook = function () {
        jQuery("*").unbind('click', clickHandler);
    }

    var initialize = function () {
        console.log('Apollo: Initializing');

        // Reset variables
        initializeVariables();

        // Remove previous hook
        removeHook();

        initializeSave();

        initializeGetPath();

        initializeHook();

        initialized = true;

        console.log('Apollo: Initialized');
    };

    var main() {
        if (window.jQuery && window.jQuery.fn.jquery === '3.1.0') {
            console.log('Apollo: Using jQuery version ' + window.jQuery.fn.jquery);
            initialize();
        } else {
            console.log('Apollo: Injecting jQuery');

            var jq = document.createElement('script');
            jq.src = "//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js";
            document.getElementsByTagName('head')[0].appendChild(jq);
            jQuery.noConflict();
            initialize();
        }
    }

    // Run entry-point
    main();
}());
