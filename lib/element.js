class GuideElement extends HTMLElement {}
customElements.define("indent-guide-plus", GuideElement);

// Cache for DOM references per editor
const editorCache = new WeakMap();

function getEditorCache(editorElement) {
  if (!editorCache.has(editorElement)) {
    const cursors = editorElement.querySelector(".scroll-view .cursors");
    editorCache.set(editorElement, {
      cursors,
      itemParent: cursors ? cursors.parentNode : null,
      guideElements: [],  // Cache guide elements to avoid querySelectorAll
    });
  }
  return editorCache.get(editorElement);
}

function styleGuide(element, point, length, stack, active, editor) {
  // Batch classList operations
  element.classList.toggle("indent-guide-stack", stack);
  element.classList.toggle("indent-guide-active", active);

  if (editor.isFoldedAtBufferRow(Math.max(point.row - 1, 0))) {
    element.style.height = "0px";
    return;
  }

  const startRow = editor.screenRowForBufferRow(point.row);
  const endRow = editor.screenRowForBufferRow(point.row + length);
  const indentSize = editor.getTabLength();
  const charWidth = editor.getDefaultCharWidth();
  const left = point.column * indentSize * charWidth;
  const top = editor.component.pixelPositionBeforeBlocksForRow(startRow);
  const endTop = editor.component.pixelPositionBeforeBlocksForRow(endRow);
  const height = endTop - top;

  // Batch style assignments for single reflow
  element.style.cssText = `left:${left}px;top:${top}px;height:${height}px;display:block;z-index:0`;
  element.setAttribute("depth", point.column);
}

function createElementsForGuides(editorElement, fns) {
  const cache = getEditorCache(editorElement);
  if (!cache.cursors || !cache.itemParent) {
    return;
  }

  const elements = cache.guideElements;
  const existNum = elements.length;
  const neededNum = fns.length;
  let count = 0;

  // Recycle existing elements
  const recycleNum = Math.min(neededNum, existNum);
  for (let i = 0; i < recycleNum; i++) {
    fns[count++](elements[i]);
  }

  // Remove excess elements
  for (let i = existNum - 1; i >= recycleNum; i--) {
    elements[i].remove();
    elements.pop();
  }

  // Create new elements if needed
  for (let i = existNum; i < neededNum; i++) {
    const newNode = new GuideElement();
    newNode.classList.add("overlayer", "indent-guide-plus");
    fns[count++](newNode);
    cache.itemParent.insertBefore(newNode, cache.cursors);
    elements.push(newNode);
  }
}

module.exports = { styleGuide, createElementsForGuides };
