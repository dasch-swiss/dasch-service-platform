import express from "express";
import type http from "http";
import compression from "compression";
import cors from 'cors';
import * as bodyparser from 'body-parser';

import axios from 'axios';

import { resolve } from "path";
import {requestLoggerMiddleware} from "./request.logger.middleware";

export interface IProps {
    httpPort: number;
}

export class ExpressServer {
    private httpServer: http.Server;

    constructor(private props: IProps) {}

    public start() {
        const expressServer = express();
        expressServer.use(compression());
        expressServer.use(cors());
        expressServer.use(bodyparser.json());
        expressServer.use(requestLoggerMiddleware);
        expressServer.use("/app/", express.static(resolve(__dirname, "..", "public")));
        expressServer.get("/app/*", (req: express.Request, res: express.Response) => {
            res.sendFile(resolve(__dirname, "..", "public", "index.html"));
        });

        expressServer.get("/projects", (req: express.Request, resp: express.Response, next: express.NextFunction) => {
            axios.get('https://api.staging.dasch.swiss/admin/projects')
                .then(response => {
                    resp.json(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        });

        expressServer.post("/projects", (req: express.Request, resp: express.Response, next: express.NextFunction) => {

        });

        this.httpServer = expressServer.listen(this.props.httpPort, () => {
            const start = new Date().getTime();
            console.info(`${start}: Listening on port ${this.props.httpPort}`);
        });
    }

    public shutdown() {
        this.httpServer.close();
    }
}
