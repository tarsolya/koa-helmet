import helmet from 'helmet';

const promisifyMiddleware = function(middleware: any) {
  return function(req, res) {
    return new Promise(function(resolve, reject) {
      middleware(req, res, function(err) {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  };
};

export const koaHelmet = (): Function => {
  const helmetPromise = promisifyMiddleware(helmet.apply(null, arguments));

  return (ctx, next) => {
    return helmetPromise(ctx.req, ctx.res).then(next);
  };
};

Object.keys(helmet).forEach(function(helmetMethod) {
  koaHelmet[helmetMethod] = function() {
    const method = helmet[helmetMethod];
    const methodPromise = promisifyMiddleware(method.apply(null, arguments));

    return (ctx, next) => {
      return methodPromise(ctx.req, ctx.res).then(next);
    };
  };
});

export default koaHelmet;
