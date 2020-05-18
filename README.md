## To start the app

1.  `yarn` to install dev dependencies
2.  `yarn start-server` to run the server.
3.  `yarn start` to run the frontend. Go to **http://lvh.me:8080** in your browser where you can see the web application running.
4.  For production run the `yarn build` command.

## Deployment

You can easily deploy server app with pm2. Check the `ecosystem.config.js` for details.

Install pm2:

```bash
$ yarn global add pm2
```

If you deploy to new environment, then configure server in `ecosystem.config.js` and run:

```bash
$ pm2 deploy ecosystem.config.js SERVER_NAME setup
```

And run

```bash
$ pm2 deploy SERVER_NAME
```
