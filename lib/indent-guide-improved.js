/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const {CompositeDisposable, Point} = require('atom');

const {createElementsForGuides, styleGuide} = require('./indent-guide-improved-element');
const {getGuides} = require('./guides');

module.exports = {
  activate(state) {
    this.currentSubscriptions = [];
    this.busy = false;

    // The original indent guides interfere with this package.
    atom.config.set('editor.showIndentGuide', false);

    const createPoint = function(x, y) {
    	x = isNaN(x) ? 0 : x;
    	y = isNaN(y) ? 0 : y;
    	return new Point(x, y);
  };

    const updateGuide = function(editor, editorElement) {
      const visibleScreenRange = editorElement.getVisibleRowRange();
      if ((visibleScreenRange == null) || !editorElement.component.visible) { return; }
      const basePixelPos = editorElement.pixelPositionForScreenPosition(
        createPoint(visibleScreenRange[0], 0)).top;
      const visibleRange = visibleScreenRange.map(row => editor.bufferPositionForScreenPosition(createPoint(row, 0)).row);
      const getIndent = function(row) {
        if (editor.lineTextForBufferRow(row).match(/^\s*$/)) {
          return null;
        } else {
          return editor.indentationForBufferRow(row);
        }
      };
      const scrollTop = editorElement.getScrollTop();
      const scrollLeft = editorElement.getScrollLeft();
      const guides = getGuides(
        visibleRange[0],
        visibleRange[1],
        editor.getLastBufferRow(),
        editor.getCursorBufferPositions().map(point => point.row),
        getIndent);
      const lineHeightPixel = editor.getLineHeightInPixels();
      return createElementsForGuides(editorElement, guides.map(g => el => styleGuide(
        el,
        g.point.translate(createPoint(visibleRange[0], 0)),
        g.length,
        g.stack,
        g.active,
        editor,
        basePixelPos,
        lineHeightPixel,
        visibleScreenRange[0],
        scrollTop,
        scrollLeft)));
    };


    const handleEvents = (editor, editorElement) => {
      const up = () => {
        updateGuide(editor, editorElement);
        return this.busy = false;
      };

      const delayedUpdate = () => {
        if (!this.busy) {
          this.busy = true;
          return requestAnimationFrame(up);
        }
      };

      const subscriptions = new CompositeDisposable;
      subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(function(item) {
        if (item === editor) { return delayedUpdate(); }
      })
      );
      subscriptions.add(atom.config.onDidChange('editor.fontSize', delayedUpdate));
      subscriptions.add(atom.config.onDidChange('editor.fontFamily', delayedUpdate));
      subscriptions.add(atom.config.onDidChange('editor.lineHeight', delayedUpdate));
      subscriptions.add(editor.onDidChangeCursorPosition(delayedUpdate));
      subscriptions.add(editorElement.onDidChangeScrollTop(delayedUpdate));
      subscriptions.add(editorElement.onDidChangeScrollLeft(delayedUpdate));
      subscriptions.add(editor.onDidStopChanging(delayedUpdate));
      subscriptions.add(editor.onDidDestroy(() => {
        this.currentSubscriptions.splice(this.currentSubscriptions.indexOf(subscriptions), 1);
        return subscriptions.dispose();
      })
      );
      return this.currentSubscriptions.push(subscriptions);
    };

    return atom.workspace.observeTextEditors(function(editor) {
      if (editor == null) { return; }
      const editorElement = atom.views.getView(editor);
      if (editorElement == null) { return; }
      handleEvents(editor, editorElement);
      return updateGuide(editor, editorElement);
    });
  },

  deactivate() {
    this.currentSubscriptions.forEach(s => s.dispose());
    return atom.workspace.getTextEditors().forEach(function(te) {
      const v = atom.views.getView(te);
      if (!v) { return; }
      return Array.prototype.forEach.call(v.querySelectorAll('.indent-guide-improved'), e => e.parentNode.removeChild(e));
    });
  }
};
