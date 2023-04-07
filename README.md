
<h1>
  <a href="https://ciphereditor.com">
    <img src="https://cdn.ciphereditor.com/assets/images/logo-ciphereditor-full-horizontal-light-pill.svg" alt="ciphereditor" height="46" />
  </a>
</h1>

[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.txt)
[![Standard Code Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

## Your playground for cryptography, coding & data

ciphereditor is a web app for cryptography, coding, and data encouraging beginners and pros alike to explore new operations and build own workflows – [ciphereditor.com](https://ciphereditor.com)

## Repository structure

As a monorepo this repository contains multiple packages that share common dependencies or depend on each other. All packages listed below share the same version.

### Packages

The following packages contain the logic necessary to build the app itself (excl. operations).

- [**app-web**](packages/app-web/README.md) - Core web app built on [React](https://reactjs.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) (requires processor and library)
- [**app-desktop**](packages/app-desktop/README.md) - Desktop application source built on app-web and [Electron](https://www.electronjs.org/)
- [**website**](packages/website/README.md) - Official [ciphereditor.com](https://ciphereditor.com) website app-web is embedded in (closed source)
- [**processor**](packages/processor/README.md) - JavaScript sandbox and “runtime environment” for extensions
- **library** - Logic, schemas and types shared between the app and extensions

### Extensions

Extensions provide operations, the nodes or methods you can use on the ciphereditor canvas. They run in the environment created by the app packages listed above.

- **codepages** - Operations related to character encodings
- **dictionary** - Operations related to dictionary-based translations
- **essentials** - Essential operations
- **forge** - Operations related to algorithms offered by the [forge](https://github.com/digitalbazaar/forge) package
- **hash** - Operations related to cryptographic hash functions
- **pgp** - Operations related to the OpenPGP protocol

## Development setup

You may either develop with your local Node.js installation or inside a development container as described below.

### Local setup

Make sure you have [Node.js](https://nodejs.org/en/) installed and use the same version as written in `.nvmrc`.

To build the project on your own machine [download a release](https://github.com/wierkstudio/ciphereditor/releases) or clone the entire repository using Git by issuing the following command in your terminal:

```bash
git clone git@github.com:wierkstudio/ciphereditor.git
```

Install the dependencies for all packages within the repository root folder using the following command. You need to repeat this step every time `package-lock.json` changes.

```bash
npm install
```

Environment variables used during development can be set in `.env.local`. Create it from the example file and fill in the blanks as needed:

```bash
cp .env.local.example .env.local
```

(Re-)build the processor package from source like so:

```bash
npm run processor-build
```

As some of the browser features the web app depends on require a secure HTTPS connection to the server, we recommend you to generate a self-signed certificate to be used during development. To do this, run the following OpenSSL command in the repository root folder:

```bash
openssl req -x509 -newkey rsa:4096 -keyout assets/localhost.key -out assets/localhost.crt -sha256 -days 365 -nodes -subj '/CN=localhost'
```

It will create a new certificate and place the necessary files at `assets/localhost.key` and `assets/localhost.crt` that will automatically be used by the web app dev server.

Finally, start the web app dev server using this command:

```bash
npm run app-web-start
```

It will make the app available at https://localhost:3010. As the certificate in use is self-signed you will get a nasty warning by the browser which you can ignore. To stop the server, press `Ctrl+C`.

Find the full list of available project commands in the root `package.json`.

### Develop inside a container

[![Clone in volume in Visual Studio Remote - Containers](https://img.shields.io/static/v1?style=flat-square&label=vscode%20Remote%20-%20Containers&message=Clone%20in%20volume&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/wierkstudio/ciphereditor)

A development container is a running Docker container with a well-defined tool/runtime stack and its prerequisites. It allows you to get up and running within minutes. To learn more, head to the [Visual Studio Code documentation](https://code.visualstudio.com/docs/remote/containers).

To use a development container, make sure that you have [Docker](https://www.docker.com/get-started/), [Visual Studio Code](https://code.visualstudio.com/), and the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed.

Get started by pressing the “Clone in volume” badge above.

Alternatively, clone or download the repository and manually open its root folder in Visual Studio Code. Then, open the command palette by pressing `Ctrl+Shift+P` on Windows/Linux, or `Cmd+Shift+P` on macOS, and issue the task “Remote-Containers: Open Folder in Container”.

## License

The source code in this repository is published under the MIT license. See [LICENSE.txt](LICENSE.txt).

## Contributing

If you consider contributing to this project, [please read this first](CONTRIBUTING.md).

## Acknowledgements

<details><summary>Use of Open Source fonts</summary>

We use fonts licensed under the [SIL Open Font License, 1.1](http://scripts.sil.org/OFL):

- LexendDeca[wght].ttf: Copyright 2019 The Lexend Project Authors ([https://github.com/googlefonts/lexend](https://github.com/googlefonts/lexend))
- IBMPlexMono-Regular.ttf: Copyright 2017 IBM Corp. All rights reserved.

</details>

<details><summary>Use of Iconic Pro icons</summary>

We use [Iconic Pro](https://iconic.app) icons in this project.

Copyright (c) Iconic

Iconic Pro icons are copyrighted. Redistribution is not permitted. Use in source and binary forms, with or without modification, is allowed if you own an Iconic Pro license.

</details>

---

This is a project by [Wierk](https://wierk.lu/) and [contributors](https://github.com/wierkstudio/ciphereditor/graphs/contributors).
