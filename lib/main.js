const { CompositeDisposable, Point } = require('atom')
const { createElementsForGuides, styleGuide } = require('./element')
const { getGuides } = require('./guides')

module.exports = {

  activate() {
    this.disposables = []
    atom.config.set('editor.showIndentGuide', false)
    this.disposables.push(
      atom.workspace.observeTextEditors((editor) => {
        setTimeout(() => {
          if (!editor) { return }
          const editorElement = atom.views.getView(editor)
          if (!editorElement) { return }
          this.handleEvents(editor, editorElement)
          this.updateGuide(editor, editorElement)
        })
      })
    )
  },

  deactivate() {
    this.disposables.forEach(s => s.dispose())
    atom.workspace.getTextEditors().forEach((te) => {
      const view = atom.views.getView(te)
      if (!view) { return }
      for (let e of view.querySelectorAll('.indent-guide-plus')) {
        e.parentNode.removeChild(e)
      }
    })
  },

  createPoint(x, y) {
    x = isNaN(x) ? 0 : x
    y = isNaN(y) ? 0 : y
    return new Point(x, y)
  },

  updateGuide(editor, editorElement) {
    const visibleScreenRange = editorElement.getVisibleRowRange()
    if ((visibleScreenRange == null) || !editorElement.component.visible) { return }
    const basePixelPos = editorElement.component.pixelPositionAfterBlocksForRow(visibleScreenRange[0])
    const visibleRange = visibleScreenRange.map(row => editor.bufferPositionForScreenPosition(this.createPoint(row, 0)).row)
    const getIndent = function(row) {
      if (editor.lineTextForBufferRow(row).match(/^\s*$/)) {
        return null
      } else {
        return editor.indentationForBufferRow(row)
      }
    }
    const guides = getGuides(
      visibleRange[0],
      visibleRange[1]+1,
      editor.getLastBufferRow(),
      editor.getCursorBufferPositions().map(point => point.row),
      getIndent)
    const lineHeightPixel = editor.getLineHeightInPixels()
    return createElementsForGuides(editorElement, guides.map(g => el => styleGuide(
      el,
      g.point.translate(this.createPoint(visibleRange[0], 0)),
      g.length,
      g.stack,
      g.active,
      editor,
      basePixelPos,
      lineHeightPixel,
      visibleScreenRange[0])))
  },

  handleEvents(editor, editorElement) {
    let busy = false
    const up = () => {
      this.updateGuide(editor, editorElement)
      busy = false
    }
    const delayedUpdate = () => {
      if (!busy) {
        busy = true
        up()
      }
    }
    const subscriptions = new CompositeDisposable()
    subscriptions.add(
      atom.workspace.onDidStopChangingActivePaneItem(function(item) {
        if (item===editor) { delayedUpdate() }
      }),
      atom.config.onDidChange('editor.fontSize', delayedUpdate),
      atom.config.onDidChange('editor.fontFamily', delayedUpdate),
      atom.config.onDidChange('editor.lineHeight', delayedUpdate),
      editor.onDidChangeCursorPosition(delayedUpdate),
      editorElement.onDidChangeScrollTop(delayedUpdate),
      editorElement.onDidChangeScrollLeft(delayedUpdate),
      editor.onDidStopChanging(delayedUpdate),
      editor.onDidDestroy(() => { subscriptions.dispose() }),
    )
  },

}
