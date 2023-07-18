'use babel'

const styleGuide = function(element, point, length, stack, active, editor, basePixelPos, lineHeightPixel, baseScreenRow) {
  element.classList.add('indent-guide-improved');
  element.classList[stack ? 'add' : 'remove']('indent-guide-stack');
  element.classList[active ? 'add' : 'remove']('indent-guide-active');

  if (editor.isFoldedAtBufferRow(Math.max(point.row - 1, 0))) {
    element.style.height = '0px';
    return;
  }

  const row = editor.screenRowForBufferRow(point.row);
  const indentSize = editor.getTabLength();
  const left = ((point.column+0) * indentSize * editor.getDefaultCharWidth());
  const top = (basePixelPos + (lineHeightPixel * (row - baseScreenRow)));

  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
  element.style.height =
    `${editor.getLineHeightInPixels() * realLength(point.row, length, editor)}px`;
  element.style.display = 'block';
  return element.style['z-index'] = 1;
};

var realLength = function(row, length, editor) {
  const row1 = editor.screenRowForBufferRow(row);
  const row2 = editor.screenRowForBufferRow(row + length);
  return row2 - row1;
};

class IndentGuideImprovedElement extends HTMLElement {}
customElements.define('indent-guide-improved', IndentGuideImprovedElement);

const createElementsForGuides = function(editorElement, fns) {
  const cursors = editorElement.querySelector('.scroll-view .cursors')
  const itemParent = cursors.parentNode
  const items = itemParent.querySelectorAll('.indent-guide-improved');
  const existNum = items.length;
  const neededNum = fns.length;
  const createNum = Math.max(neededNum - existNum, 0);
  const recycleNum = Math.min(neededNum, existNum);
  let count = 0;
  __range__(0, existNum, false).forEach(function(i) {
    const node = items.item(i);
    if (i < recycleNum) {
      return fns[count++](node);
    } else {
      return node.parentNode.removeChild(node);
    }
  });
  __range__(0, createNum, false).forEach(function() {
    const newNode = new IndentGuideImprovedElement();
    newNode.classList.add('overlayer');
    fns[count++](newNode);
    return itemParent.insertBefore(newNode, cursors)
  });
  if (count !== neededNum) { throw 'System Error'; }
};

module.exports = {
  createElementsForGuides,
  styleGuide
};

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
