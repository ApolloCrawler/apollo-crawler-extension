/**
 * Created by tomaskorcak on 8/24/14.
 */

(function() {
    var clickNo = 0;
    var maxPathsCount = 2;
    var paths = [];

    var initialize = function() {
        console.log("initialize()");

        /**
         * Prints selector of clicked element to console, very useful.
         */
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
                if(rnid) {
                    name += '#' + rnid;
                } else {
                    var rnclass = realNode.attributes['class'];
                    if(rnclass) {
                        name += "." + rnclass.value.split(' ').sort().join('.');
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

        var diff = function(paths) {
            var path1 = paths[0];
            var path2 = paths[1];

            var tokens1 = path1.split(' > ');
            var tokens2 = path2.split(' > ');

            var result = tokens1.map(function(value, index) {
                if(value == tokens2[index]) {
                    return value;
                }

                return value.split('.')[0].split('#')[0];
            });

            return result.join(' > ');
        };

        jQuery("*").click(function(e) {
            var doc = $(this);
            var path = doc.getPath();

            paths[clickNo % maxPathsCount] = path;

            // Highlight clicked element
            // doc.css("border", "3px solid #0f0");

            // Print path
            // console.log(path);

            e.preventDefault();
            e.stopPropagation();

            clickNo++;

            if(clickNo % maxPathsCount == 0) {
                var unipath = diff(paths);

                var elements = jQuery(unipath);
                if(elements) {
                    var randomColor = Math.floor(Math.random()*16777215).toString(16);
                    elements.css('border', '2px solid #' + randomColor);
                }

                var data = elements.map(function(_elem) {
                    return this.text
                });

                console.log(JSON.stringify(data.toArray(), null, 4));
            }
        });
    };

    if (window.jQuery) {
        initialize();
    } else {
        console.log("Injecting jQuery");
        
        var jq = document.createElement('script');
        jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
        document.getElementsByTagName('head')[0].appendChild(jq);
        setTimeout(function() {
            jQuery.noConflict();
            initialize();
        }, 3000);
    }

}());
