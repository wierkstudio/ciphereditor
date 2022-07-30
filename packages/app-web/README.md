
# ciphereditor web app

Core web app built on React and Redux Toolkit

## Getting started

Follow the instructions in the 'Getting started' section in the project root.

Start the dev server and make the app available at http://localhost:3010 with the following command:

```bash
npm run start
```

### Use an HTTPS dev server

Some of the browser features ciphereditor depends on require a secure HTTPS connection to the server. You may e.g. encounter a warning like “Violation to the Content Security Policy (CSP) directive”. To use an HTTPS dev server you may generate a self-signed certificate by running the following command in the repository root folder:

```bash
openssl req -x509 -newkey rsa:4096 -keyout assets/localhost.key -out assets/localhost.crt -sha256 -days 365 -nodes -subj '/CN=localhost'
```

This creates the necessary certificate files at `assets/localhost.key` and `assets/localhost.crt`. Next time you start the dev server the config will find them and tell Vite to use HTTPS instead of HTTP. The app will be reachable through https://localhost:3010. However, as the certificates are self-signed you will get a nasty warning in the browser.
