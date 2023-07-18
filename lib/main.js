'use babel'

import { CompositeDisposable, Point } from 'atom'
import { createElementsForGuides, styleGuide } from './element'
import { getGuides } from './guides'

export default {

  activate() {
    this.disposables = []
    this.busy = false
    atom.config.set('editor.showIndentGuide', false)
    this.disposables.push(
      atom.workspace.observeTextEditors((editor) => {
        if (!editor) { return }
        const editorElement = atom.views.getView(editor)
        if (!editorElement) { return }
        this.handleEvents(editor, editorElement)
        this.updateGuide(editor, editorElement)
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
    const basePixelPos = editorElement.pixelPositionForScreenPosition(
      this.createPoint(visibleScreenRange[0], 0)).top
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
      visibleRange[1],
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
    const up = () => {
      this.updateGuide(editor, editorElement)
      return this.busy = false
    }
    const delayedUpdate = () => {
      if (!this.busy) {
        this.busy = true
        return requestAnimationFrame(up)
      }
    }
    const subscriptions = new CompositeDisposable
    subscriptions.add(
      atom.workspace.onDidStopChangingActivePaneItem(function(item) {
        if (item === editor) { return delayedUpdate() }
      }),
      atom.config.onDidChange('editor.fontSize', delayedUpdate),
      atom.config.onDidChange('editor.fontFamily', delayedUpdate),
      atom.config.onDidChange('editor.lineHeight', delayedUpdate),
      editor.onDidChangeCursorPosition(delayedUpdate),
      editorElement.onDidChangeScrollTop(delayedUpdate),
      editorElement.onDidChangeScrollLeft(delayedUpdate),
      editor.onDidStopChanging(delayedUpdate),
      editor.onDidDestroy(() => {
        this.disposables.splice(this.disposables.indexOf(subscriptions), 1)
        return subscriptions.dispose()
      }),
    )
    return this.disposables.push(subscriptions)
  },

};
