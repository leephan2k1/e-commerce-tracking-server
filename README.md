# The main server serves realcost.shop

| Table contents                                                                                  |
| ----------------------------------------------------------------------------------------------- |
| [Tech stack](https://github.com/leephan2k1/e-commerce-tracking-server#tech-stack)               |
| [Project setup](https://github.com/leephan2k1/e-commerce-tracking-server#project-setup)         |
| [API Documentation](https://github.com/leephan2k1/e-commerce-tracking-server#api-documentation) |

## Tech stack

-   Fastify
-   Mongodb
-   SocketIO

## Project setup

1. Clone this repo:

```
git clone git@github.com:leephan2k1/e-commerce-tracking-server.git
```

2. Environment variables setup

```
# The port you want to start the server, for ex: 5000, 5555, 5050, 8080,... (Default: 5555)
PORT=<your-port>

# Your Google account
# But be careful, the "pass" here is not password of your google account, this is a "App Password" follow Google 5/2022 term of services
# You can follow step by step the instructions to get "App password": https://stackoverflow.com/a/72581650/12212893
# This account google will be serve to send email notifications

NODEMAILER_CONFIG={"service":"gmail","auth":{"user":"<your-email-account>","pass":"<your-pass>"}}

# This key pair will be used to send notifications via the browser
# The "PUBLIC_VAPID_KEY" should be export for the client
# "PUBLIC VAPID KEY" must be export to client. Meanwhile, "SECRET_VAPID_KEY" should be hide on the server.
# Generate it follow this command: npx web-push generate-vapid-keys
PUBLIC_VAPID_KEY=<your-pubic-vapid-key>
SECRET_VAPID_KEY=<your-secret-vapid-key>

# Mongodb: (See: https://www.mongodb.com/atlas/database)
# Note: This database must be the same as NextJS project https://github.com/leephan2k1/real-cost
MONGODB_URI=<your-mongodb-uri-endpoint>

# WEB_URL will be displayed on the email template, and so on
WEB_URL=<your-domain-web-server>

BC_API_ENDPOINT=https://apiv3.beecost.vn
BC_URL=https://beecost.vn

```

3. Install all dependencies:

```
yarn i
```

4. Start the server:

-   Development environment:

```
yarn dev
```

_But I highly recommend using this package of utilities to avoid mistaking node modules package manager [antfu/ni](https://github.com/antfu/ni)_

it will be as simple as this (nr dev, nr start, nr etc script,...)

```
nr dev
```

-   Production environemnt:

```
yarn start
```

## API Documentation

GET this route to expose Restful API endpoints of Real Cost Server

```
/documentation
```

![real-cost-api](https://i.ibb.co/XDy7xNW/screencapture-localhost-5555-documentation-static-index-html-2022-10-20-20-21-43.png)
