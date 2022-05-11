import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from"supertokens-node/recipe/thirdpartyemailpassword";
import cors from "cors";
import {middleware} from "supertokens-node/framework/express";
import { errorHandler } from "supertokens-node/framework/express";

let { Google } = ThirdPartyEmailPassword;
dotenv.config();

supertokens.init({
    framework: "express",
    supertokens: {
        // These are the connection details of the app you created on supertokens.com
        connectionURI: process.env.CONNECTION_URI || '',
        apiKey: process.env.API_KEY || '',
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
        appName: "SuperTokensTest",
        apiDomain: process.env.API_DOMAIN || '',
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/auth",
        websiteBasePath: "/auth"
    },
    recipeList: [
        ThirdPartyEmailPassword.init({
          providers: [
              // We have provided you with development keys which you can use for testsing.
              // IMPORTANT: Please replace them with your own OAuth keys for production use.
              Google({
                  clientId: process.env.GOOGLE_CLIENT_ID || '',
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
              }),
              // Facebook({
              //     clientSecret: "FACEBOOK_CLIENT_SECRET",
              //     clientId: "FACEBOOK_CLIENT_ID"
              // })
          ]
      }),
        Session.init() // initializes session features
    ]
});


const app: Express = express();
const port = process.env.PORT || 8080;


// ...other middlewares
app.use(cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
}));

app.use(middleware());


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// Add this AFTER all your routes
app.use(errorHandler())

// your own error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Your error handler logic
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});