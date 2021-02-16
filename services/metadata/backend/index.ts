import { ExpressServer } from './express_server';

interface IServerProps {
    httpPort: number;
}

export class RepositoryServer {
    private readonly props: IServerProps;

    private expressServer: ExpressServer;

    constructor(props: IServerProps) {
        this.props = {
            httpPort: 5000,
            ...props
        };
    }

    public start() {
        this.expressServer = new ExpressServer({ ...this.props });
        this.expressServer.start();
    }

    public async shutdown() {
        this.expressServer.shutdown();
    }
}

if (require.main === module) {
    // this module was run directly from the command line as in node xxx.js

    let PORT: number
    if (process.env.SERVER_PORT != null) {
        PORT = parseInt(process.env.SERVER_PORT);
    } else {
        PORT = 5000;
    }

    const server = new RepositoryServer({
        httpPort: PORT
    });

    server.start();
} else {
    // this module was not run directly from the command line and probably loaded by something else
}
