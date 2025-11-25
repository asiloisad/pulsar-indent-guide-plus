const { CompositeDisposable, Point } = require('atom')
const { createElementsForGuides, styleGuide } = require('./element')
const { getGuides } = require('./guides')

module.exports = {

  activate() {
    this.disposables = []
    atom.config.set('editor.showIndentGuide', false)
    this.disposables.push(
      atom.workspace.observeTextEditors((editor) => {
        if (!editor) { return }
        const editorElement = atom.views.getView(editor)
        if (!editorElement) { return }
        this.handleEvents(editor, editorElement)
      })
    )
  },

  deactivate() {
    this.disposables.forEach(s => s.dispose())
    atom.workspace.getTextEditors().forEach((editor) => {
      editor.component.updateSyncAfterMeasuringContent = editor.component.updateSyncAfterMeasuringContent_
      delete editor.component.updateSyncAfterMeasuringContent_
      const view = atom.views.getView(editor)
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
    if (!editorElement.component || !editorElement.component.visible) { return }
    const visibleScreenRange = editorElement.getVisibleRowRange()
    if (visibleScreenRange == null) { return }

    const visibleRange = visibleScreenRange.map(row => editor.bufferPositionForScreenPosition(this.createPoint(row, 0)).row)
    const cursorRows = editor.getCursorBufferPositions().map(point => point.row)

    const getIndent = (row) => {
      if (editor.lineTextForBufferRow(row).match(/^\s*$/)) {
        return null
      } else {
        return editor.indentationForBufferRow(row)
      }
    }
    const guides = getGuides(
      visibleRange[0],
      visibleRange[1] + 1,
      editor.getLastBufferRow(),
      cursorRows,
      getIndent,
    )
    return createElementsForGuides(editorElement,
      guides.map(g => el => styleGuide(
        el,
        g.point.translate(this.createPoint(visibleRange[0], 0)),
        g.length,
        g.stack,
        g.active,
        editor,
      ))
    )
  },

  handleEvents(editor, editorElement) {
    editor.component.updateSyncAfterMeasuringContent_ = editor.component.updateSyncAfterMeasuringContent
    editor.component.updateSyncAfterMeasuringContent = () => {
      this.updateGuide(editor, editorElement)
      editor.component.updateSyncAfterMeasuringContent_()
    }
  },
}
