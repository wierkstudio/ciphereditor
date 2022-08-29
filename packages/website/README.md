
# ciphereditor website

This package deals with the website around the ciphereditor web app. It is built with TypeScript, Next.js and React. It provides content pages like the user manual and documentation for operations. Content pages are fetched from a headless content management system (CMS) and are being served as prerendered static HTML pages to the user and search engines. It is a very important part of the project as it contributes to the discoverability (SEO) and thus to people finding it.

The web app itself is run within an `iframe` element on the website pages. Some features (e.g. toggle docs, help buttons) require both sides to communicate with each other. This is described in more detail in the [web app's README](../app-web/README.md).

## Environments

The website is automatically deployed to the following environments:

- [ciphereditor.com](https://ciphereditor.com) (`main` branch, production)
- [dev.ciphereditor.com](https://dev.ciphereditor.com) (`dev` branch, preview)

## Closed source

The source code of this package is proprietary software of [Wierk S.à r.l.](https://wierk.lu) and as such not part of the public ciphereditor repository. As other packages in this repository integrate with it, we mention it here for the sake of completeness.
