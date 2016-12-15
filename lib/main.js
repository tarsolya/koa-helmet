"use strict";
const helmet_1 = require("helmet");
const promisifyMiddleware = function (middleware) {
    return function (req, res) {
        return new Promise(function (resolve, reject) {
            middleware(req, res, function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    };
};
exports.koaHelmet = () => {
    const helmetPromise = promisifyMiddleware(helmet_1.default.apply(null, arguments));
    return (ctx, next) => {
        return helmetPromise(ctx.req, ctx.res).then(next);
    };
};
Object.keys(helmet_1.default).forEach(function (helmetMethod) {
    exports.koaHelmet[helmetMethod] = function () {
        const method = helmet_1.default[helmetMethod];
        const methodPromise = promisifyMiddleware(method.apply(null, arguments));
        return (ctx, next) => {
            return methodPromise(ctx.req, ctx.res).then(next);
        };
    };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.koaHelmet;
//# sourceMappingURL=main.js.map