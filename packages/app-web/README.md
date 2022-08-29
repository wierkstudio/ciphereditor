
# ciphereditor web app

Core web app built on React and Redux Toolkit

## Environments

The web app is automatically deployed to the following environments:

- [app.ciphereditor.com](https://app.ciphereditor.com) (`main` branch, production)
- [dev.app.ciphereditor.com](https://dev.app.ciphereditor.com) (`dev` branch, preview)

## Development setup

Follow [the instructions](../../README.md#development-setup) in the 'Development setup' section in the project root.

## Integrations

### Website

The `app-web` and `website` packages communicate with each other using a well defined interface through the [Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API/Using_channel_messaging). You may find the interface schemas in `src/lib/embed/types.ts`.
