var path = require('path');
var _root = path.resolve(__dirname, '..');

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}

exports.root = root;

function isVendor(module, count) {
    if (typeof module.context !== 'string') {
        return false;
    }
    return module.context.indexOf('/node_modules/') >= 0
}

exports.isVendor = isVendor;