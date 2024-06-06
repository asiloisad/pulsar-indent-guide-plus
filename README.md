# indent-guide-plus

![demo](https://github.com/bacadra/pulsar-indent-guide-plus/blob/master/assets/demo.gif?raw=true)

The indent guide, but more correctly and understandably.

## Installation

To install `indent-guide-plus` search for [indent-guide-plus](https://web.pulsar-edit.dev/packages/indent-guide-plus) in the Install pane of the Pulsar settings or run `ppm install indent-guide-plus`. Alternatively, you can run `ppm install bacadra/pulsar-indent-guide-plus` to install a package directly from the Github repository.

## Features

- Active guide and stack guides are emphasized.
- Guides break just before the trailing blank lines.
- Original `Show Indent Guide` feature is automatically switched off when this package.

## Customization

You can customize the indent guides by using custom CSS. Here are some examples:

- a subtle colors:

```less
.indent-guide-plus {
  background: rgba(158, 158, 158, 0.15);
  &.indent-guide-stack {
    background: rgba(158, 158, 158, 0.15);
    &.indent-guide-active {
      background: rgba(1, 162, 226, 0.15);
    }
  }
}
```

- a hard contrast colors:

```less
.indent-guide-plus {
  background-color: gray;
  &.indent-guide-stack {
    background-color: cyan;
    &.indent-guide-active {
      background-color: blue;
    }
  }
}
```

# Contributing

If you have any ideas on how to improve the package, spot any bugs, or would like to support the development of new features, please feel free to share them via GitHub.

## Notes

The package is fork of [indent-guide-improved](https://github.com/harai/indent-guide-improved), but decaffeinated and fixed depractation.
