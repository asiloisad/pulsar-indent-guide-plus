# indent-guide-plus

An improved indentation guide of text-editor.

![demo](https://github.com/asiloisad/pulsar-indent-guide-plus/blob/master/assets/demo.gif?raw=true)

## Installation

To install `indent-guide-plus` search for [indent-guide-plus](https://web.pulsar-edit.dev/packages/indent-guide-plus) in the Install pane of the Pulsar settings or run `ppm install indent-guide-plus`. Alternatively, you can run `ppm install asiloisad/pulsar-indent-guide-plus` to install a package directly from the Github repository.

## Features

- Active guide and stack guides are emphasized.
- Guides break just before the trailing blank lines.
- Built-in indend-guide feature is switched off.

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

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback’s welcome!

## Notes

The package is fork of [indent-guide-improved](https://github.com/harai/indent-guide-improved), but decaffeinated and fixed.
