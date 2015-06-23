# Gulp-example

WARNING:
kss-node pseudo selectors work only in servers (apache, nginx etc.)!
It didn't work as local files!

## Prepare

1. `npm install`
2. `bower install`
3. `sudo npm install -g kss-node` if you want to get style guide.
4. `sudo chown -Rc {{yourUser}}:{{yourGroup}} ~/.npm` if you install kss-node

## Build

```bash
gulp
```

## Clean

```bash
gulp clean
```

## Generate jsDoc and KSS Style Guide

```bash
gulp doc
```