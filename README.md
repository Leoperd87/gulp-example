# Gulp-example

WARNING:
kss-node pseudo selectors work only in servers (apache, nginx etc.)!
It didn't work as local files!

## Prepare

1. `npm install`
2. `bower install`
3. `sudo npm install -g kss` if you want to get style guide.
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

## Map data

### Isometric cartesian coordinate system directions
    __1
    _8_2
    7___3
    _6_4
    __5

### Classic cartesian coordinate system directions
    1_2_3
    8___4
    7_6_5