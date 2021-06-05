# boj-userspace-login

Simple browser application using Playwright to get token of BOJ.
(This requires user interaction)

## Table of Content

- [Installation](#installation)
- [API](#api)

----

# Installation

To install this package, use following command:

```sh
yarn add git+https://github.com/seia-soto/boj-userspace-login
```

# API

This package exposes one function that returns Promise of BOJ token.
This function will open new browser and let user to login, and if user login successfully, returns token, otherwise `null`.

```js
const login = require('boj-userspace-login')

login()
  .then(token => console.log(token))
```
