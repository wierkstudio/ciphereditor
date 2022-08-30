
<h1>
  <a href="https://ciphereditor.com">
    <img src="https://cdn.ciphereditor.com/assets/images/logo-ciphereditor-full-horizontal-light-pill.svg" alt="ciphereditor" height="46" />
  </a>
</h1>

[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.txt)
[![Standard Code Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

[![Open in Remote - Containers](https://img.shields.io/static/v1?label=Remote%20-%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/wierkstudio/ciphereditor)
[![Visual Studio Code Git Clone](https://img.shields.io/static/v1?label=VSC%20Git&message=Clone&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://vscode.git/clone?url=https://github.com/wierkstudio/ciphereditor)

## Your playground for cryptography, coding & data

ciphereditor is a web app for cryptography, coding and data encouraging beginners and pros alike to explore new operations and build own workflows – [ciphereditor.com](https://ciphereditor.com)

## Repository packages

As a monorepo this repository contains multiple packages that share common dependencies or depend on each other. All packages listed below share the same version.

- 🚀 [`app-web`](packages/app-web/README.md) - Core web app built on React and Redux Toolkit
- 🚀 [`app-desktop`](packages/app-desktop/README.md) - Desktop application source built on the web app and Electron
- 🚀 [`website`](packages/website/README.md) - Website the web app is embedded in providing content pages (closed source)
- 📦 [`processor`](packages/processor/README.md) - JavaScript sandbox for Browser environments where extensions are executed in
- 📦 `types` - TypeScript types shared between packages and third-party extensions
- 📦 `extension-essentials` - Extension providing essential operations
- 📦 `extension-hash` - Extension providing operations related to cryptographic hash functions

## Development setup

There are multiple ways to setup your development environment. The currently supported methods are: 
- Setting up your development environment manually. 
  - Choose this if you don't want to fiddle around with Docker/Dev Containers/GitHub Codespaces and you find yourself comfortable with setting up your development environment manually.
- Cloning the repository locally and opening it in VSCode Remote Containers. *Allows for host installed tools like GitKraken/GitHub Desktop to work on the repository*.
  - Choose this if you want to make use of the power of dev containers and also want external tools like GitKraken/GitHub Desktop to work like normal.
- Cloning the repository in a Container Volume (GitHub Codespaces/VSCode Remote Containers). *Repository is downloaded automatically in a Volume*.
  - Choose this if you're using GitHub Codespaces or you need to do something quickly without needing external developer tools like GitKraken/GitHub Desktop.

**We kindly request that you read all the instructions for your relevant setup at least once before proceeding**

## Manual Development setup

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

## Cloning locally and opening in a Dev Container

Before proceeding, make sure that you have setup [Docker](https://www.docker.com/get-started/), installed the [Visual Studio Code](https://code.visualstudio.com/) editor and the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.

To build the project on your own machine [download a release](https://github.com/wierkstudio/ciphereditor/releases), clone the entire repository using the [![Visual Studio Code Git Clone](https://img.shields.io/static/v1?label=Git&message=Clone&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://vscode.git/clone?url=https://github.com/wierkstudio/ciphereditor) badge or using Git by issuing the following command in your terminal:

```bash
git clone git@github.com:wierkstudio/ciphereditor.git
```

Once the repository is downloaded, open the repository you downloaded in Visual Studio Code. If you're already in the terminal, you should be able to open it using the following command:

```bash
code ./ciphereditor
```

Otherwise, if the above command fails (generally caused by command not found errors), you can open the folder manually like you would with any application.

Once the folder is open in Visual Studio Code, you can finally open the folder in a Dev Container. The easiest way is by using the Command Palette and running the task:

```
Remote-Containers: Open Folder in Container
```

To open the Command Palette, you can use this shortcut:

```
Ctrl + Shift + P [Windows/Linux]
Command + Shift + P [MacOS]
```

## Cloning into a Development Volume

There are 2 simple ways to clone the repository, either by clicking the Remote Containers open badge, or by doing it directly from the DEVVOLUMES section in the Remote Explorer pane.

[![Open in Remote - Containers](https://img.shields.io/static/v1?label=Remote%20-%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/wierkstudio/ciphereditor)

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
