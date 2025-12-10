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
    });
  }
  return editorCache.get(editorElement);
}

function styleGuide(element, point, length, stack, active, editor) {
  element.classList.add("indent-guide-plus");
  element.classList[stack ? "add" : "remove"]("indent-guide-stack");
  element.classList[active ? "add" : "remove"]("indent-guide-active");
  if (editor.isFoldedAtBufferRow(Math.max(point.row - 1, 0))) {
    element.style.height = "0px";
    return;
  }
  const startRow = editor.screenRowForBufferRow(point.row);
  const endRow = editor.screenRowForBufferRow(point.row + length);
  const indentSize = editor.getTabLength();
  const left = point.column * indentSize * editor.getDefaultCharWidth();
  const top = editor.component.pixelPositionBeforeBlocksForRow(startRow);
  // Calculate height using pixel positions to account for block decorations
  const endTop = editor.component.pixelPositionBeforeBlocksForRow(endRow);
  const height = endTop - top;
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
  element.style.height = `${height}px`;
  element.style.display = "block";
  element.setAttribute("depth", `${point.column}`);
  return (element.style["z-index"] = 1);
}

function createElementsForGuides(editorElement, fns) {
  const cache = getEditorCache(editorElement);
  if (!cache.cursors || !cache.itemParent) {
    return;
  }

  const items = cache.itemParent.querySelectorAll(".indent-guide-plus");
  const existNum = items.length;
  const neededNum = fns.length;
  const createNum = Math.max(neededNum - existNum, 0);
  const recycleNum = Math.min(neededNum, existNum);
  let count = 0;

  // Recycle existing elements
  for (let i = 0; i < recycleNum; i++) {
    fns[count++](items[i]);
  }

  // Remove excess elements
  for (let i = recycleNum; i < existNum; i++) {
    items[i].parentNode.removeChild(items[i]);
  }

  // Create new elements if needed
  for (let i = 0; i < createNum; i++) {
    const newNode = new GuideElement();
    newNode.classList.add("overlayer");
    fns[count++](newNode);
    cache.itemParent.insertBefore(newNode, cache.cursors);
  }

  if (count !== neededNum) {
    throw "System Error";
  }
}

module.exports = { styleGuide, createElementsForGuides };
