# Personal Idol (work in progress)

Project is divided into smaller subprojects that are managed by Lerna. Each
of those subprojects (packages) has its own README file.

## Docs

https://distantmagic.github.io/personalidol/docs/

## Building

You need to use `yarn` package manager as this project relies on yarn
workspaces. Although it may work, you shouldn't try build this project with
`npm` because it will result in much bigger build size (`npm` does not support
dependencies hoisting without additional tools like
[Lerna](https://github.com/lerna/lerna), which is not used here).

Invoke `make release` to build the project. It will install all the
dependencies, etc. You do not have to run `yarn install` or anything else
upfront.

If you do not have `make`, you can read the `Makefile` and call the required
commands manually. There are not so many of them, but it might be more
comfortable to just install `make`.

## Development

First, you need to install project dependencies. The simplest way to do that
is to call `make release` first as it sets everything up. Then you need to
go to the `packages/website` directory and invoke `make public.watch` in the
command line. It will start the compiler in "watch" mode.

This package does not contain the web server and really I think it shouldn't.
Locally I am using nginx for development. Since the project requires service
worker it needs to run under SSL (even if you are developing locally).

I prepared a code snippet to generate self-signed SSL certificate for use under
local development to make things a bit easier:
https://gist.github.com/mcharytoniuk/a3770d71bc05acfe8d2aa8664f38e17b

This is a sample Nginx config that works with the project (assuming you are
using the above gist to generate local cert). You also need to adjust the
Nginx config to match your project paths:

```nginx
server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    server_name localhost 127.0.0.1;

    ssl_certificate /etc/ssl/certs/localhost.crt;
    ssl_certificate_key /etc/ssl/private/localhost.key;

    add_header Cross-Origin-Opener-Policy same-origin;
    add_header Cross-Origin-Embedder-Policy require-corp;

    index index.html;

    location = /favicon.ico {
        alias /put-absolute-assets-path-here/favicon.ico;
    }

    location /favicon.ico {
        alias /put-absolute-project-path-here/packages/website/public/;
    }

    location /g/personalidol/ {
        alias /put-absolute-project-path-here/packages/website/public/;
    }

    location /g/personalidol/assets/ {
        alias /put-absolute-assets-path-here/g/personalidol/assets/;
    }

    location /g/personalidol/locales/ {
        alias /put-absolute-project-path-here/packages/website/public/locales/;
    }
}
```

Assets are not included in this repo as some of them have non-free licenses.

## Support

If you need support, feel free to open issue on GitHub.

If you need 1:1 support via call, you can find me on Codementor.

[![Contact me on Codementor](https://www.codementor.io/m-badges/matcha/im-a-cm-b.svg)](https://www.codementor.io/@matcha?refer=badge)
