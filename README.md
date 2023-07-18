# indent-guide-plus

<p align="center">
  <a href="https://github.com/bacadra/atom-indent-guide-plus/tags">
  <img src="https://img.shields.io/github/v/tag/bacadra/atom-indent-guide-plus?style=for-the-badge&label=Latest&color=blue" alt="Latest">
  </a>
  <a href="https://github.com/bacadra/atom-indent-guide-plus/issues">
  <img src="https://img.shields.io/github/issues-raw/bacadra/atom-indent-guide-plus?style=for-the-badge&color=blue" alt="OpenIssues">
  </a>
  <a href="https://github.com/bacadra/atom-indent-guide-plus/blob/master/package.json">
  <img src="https://img.shields.io/github/languages/top/bacadra/atom-indent-guide-plus?style=for-the-badge&color=blue" alt="Language">
  </a>
  <a href="https://github.com/bacadra/atom-indent-guide-plus/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/bacadra/atom-indent-guide-plus?style=for-the-badge&color=blue" alt="Licence">
  </a>
</p>

The indent guide, but more correctly and understandably.

## Installation

### Atom Text Editor

The official Atom packages store has been [disabled](https://github.blog/2022-06-08-sunsetting-atom/). To obtain the latest version, please run the following shell command:

```shell
apm install bacadra/atom-indent-guide-plus
```

This will allow you to directly download the package from the GitHub repository.

### Pulsar Text Editor

The package is compatible with [Pulsar](https://pulsar-edit.dev/) and can be installed using the following command:

```shell
ppm install bacadra/atom-indent-guide-plus
```

Alternatively, you can directly install [indent-guide-plus](https://web.pulsar-edit.dev/packages/indent-guide-plus) from the Pulsar package store.

## Features

* Active guide and stack guides are emphasized.
* Guides break just before the trailing blank lines.
* Original "Show Indent Guide" feature is automatically switched off when this package

## Customization

You can customize the indent guides by using custom CSS. Here are some examples:

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
