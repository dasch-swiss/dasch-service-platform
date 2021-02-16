import type express from 'express';

const requestLoggerMiddleware = (req: express.Request, resp: express.Response, next: express.NextFunction) => {

    const start = new Date().getTime();
    console.info(`${start}: ${req.method} ${req.originalUrl}`);

    resp.on("finish", () => {
        const end = new Date().getTime()
        const elapsed = end - start;
        console.info(`${start}: ${req.method} ${req.originalUrl} ${resp.statusCode} ${elapsed}ms`);
    })
    next();
};

export {
    requestLoggerMiddleware
};
