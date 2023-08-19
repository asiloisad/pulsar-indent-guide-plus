# indent-guide-plus

<p align="center">
  <a href="https://github.com/bacadra/pulsar-indent-guide-plus/tags">
  <img src="https://img.shields.io/github/v/tag/bacadra/pulsar-indent-guide-plus?style=for-the-badge&label=Latest&color=blue" alt="Latest">
  </a>
  <a href="https://github.com/bacadra/pulsar-indent-guide-plus/issues">
  <img src="https://img.shields.io/github/issues-raw/bacadra/pulsar-indent-guide-plus?style=for-the-badge&color=blue" alt="OpenIssues">
  </a>
  <a href="https://github.com/bacadra/pulsar-indent-guide-plus/blob/master/package.json">
  <img src="https://img.shields.io/github/languages/top/bacadra/pulsar-indent-guide-plus?style=for-the-badge&color=blue" alt="Language">
  </a>
  <a href="https://github.com/bacadra/pulsar-indent-guide-plus/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/bacadra/pulsar-indent-guide-plus?style=for-the-badge&color=blue" alt="Licence">
  </a>
</p>

The indent guide, but more correctly and understandably.

## Installation

To install `indent-guide-plus` search for [indent-guide-plus](https://web.pulsar-edit.dev/packages/indent-guide-plus) in the Install pane of the Pulsar settings or run `ppm install indent-guide-plus`.

Alternatively, run `ppm install bacadra/pulsar-indent-guide-plus` to install a package directly from Github repository.

## Features

* Active guide and stack guides are emphasized.
* Guides break just before the trailing blank lines.
* Original "Show Indent Guide" feature is automatically switched off when this package

## Customization

You can customize the indent guides by using custom CSS. Here are some examples:

* A subtle colors:

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

* A hard contrast colors:

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

# Contributing [🍺](https://www.buymeacoffee.com/asiloisad)

If you have any ideas on how to improve the package, spot any bugs, or would like to support the development of new features, please feel free to share them via GitHub.

## Notes

The package is fork of [indent-guide-improved](https://github.com/harai/indent-guide-improved), but decaffeinated and fixed depractation.
