const autoBind = require('auto-bind');
const path = require('path');
module.exports = class Helper {
    constructor(req, res) {
        autoBind(this);
        this.req = req;
        this.res = res;
    }

    object() {
        return {
            viewPath: this.viewPath,
            req: this.req,
        }
    }
    viewPath(dir) {
        return path.join(path.resolve('./resource/views'), dir)
    }
}