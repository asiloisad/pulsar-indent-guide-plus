# indent-guide-plus

Enhanced indentation guides with active scope highlighting.

![demo](https://github.com/asiloisad/pulsar-indent-guide-plus/blob/master/assets/demo.gif?raw=true)

Fork of [indent-guide-improved](https://github.com/harai/indent-guide-improved).

## Features

- **Active highlighting**: Current guide and stack are visually emphasized.
- **Smart breaks**: Guides break before trailing blank lines.
- **Depth-based CSS**: Style guides by indentation level.
- **Auto-disable**: Built-in indent-guide is automatically switched off.

## Installation

To install `indent-guide-plus` search for [indent-guide-plus](https://web.pulsar-edit.dev/packages/indent-guide-plus) in the Install pane of the Pulsar settings or run `ppm install indent-guide-plus`. Alternatively, you can run `ppm install asiloisad/pulsar-indent-guide-plus` to install a package directly from the GitHub repository.

## Customization

The style can be adjusted according to user preferences in the `styles.less` file:

- e.g. subtle colors:

```less
.indent-guide-plus {
  background: rgba(158, 158, 158, 0.25);
  &.indent-guide-stack {
    background: rgba(158, 158, 158, 0.50);
    &.indent-guide-active {
      background: rgba(1, 162, 226, 0.50);
    }
  }
}
```

- e.g. hard contrast colors:

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

- e.g. colorful lines:

```less
.indent-guide-plus {
  &[depth] {
    &[depth="0"], &[depth="6"], &[depth="12"] {
      background-color: rgb(255, 50, 50);
    }
    &[depth="1"], &[depth="7"], &[depth="13"] {
      background-color: rgb(255, 155, 50);
    }
    &[depth="2"], &[depth="8"], &[depth="14"] {
      background-color: rgb(255, 225, 100);
    }
    &[depth="3"], &[depth="9"], &[depth="15"] {
      background-color: rgb(100, 255, 100);
    }
    &[depth="4"], &[depth="10"], &[depth="16"] {
      background-color: rgb(1, 162, 255);
    }
    &[depth="5"], &[depth="11"], &[depth="17"] {
      background-color: rgb(200, 1, 226);
    }
  }
  opacity: 0.15;
  &.indent-guide-stack {
    opacity: 0.45;
    &.indent-guide-active {
      opacity: 1.0;
    }
  }
}
```

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback's welcome!
