class GuideElement extends HTMLElement {}
customElements.define('indent-guide-plus', GuideElement)

function styleGuide(element, point, length, stack, active, editor, basePixelPos, lineHeightPixel, baseScreenRow) {
  element.classList.add('indent-guide-plus')
  element.classList[stack ? 'add' : 'remove']('indent-guide-stack')
  element.classList[active ? 'add' : 'remove']('indent-guide-active')

  if (editor.isFoldedAtBufferRow(Math.max(point.row - 1, 0))) {
    element.style.height = '0px'
    return
  }

  const row = editor.screenRowForBufferRow(point.row)
  const indentSize = editor.getTabLength()
  const left = point.column * indentSize * editor.getDefaultCharWidth()
  const top = basePixelPos + (lineHeightPixel * (row - baseScreenRow))

  element.style.left = `${left}px`
  element.style.top = `${top}px`
  element.style.height = `${editor.getLineHeightInPixels() * realLength(point.row, length, editor)}px`
  element.style.display = 'block'
  element.setAttribute("depth", `${point.column}`)
  return element.style['z-index'] = 1
}

function realLength(row, length, editor) {
  const row1 = editor.screenRowForBufferRow(row)
  const row2 = editor.screenRowForBufferRow(row + length)
  return row2 - row1
}

function createElementsForGuides(editorElement, fns) {
  const cursors = editorElement.querySelector('.scroll-view .cursors')
  const itemParent = cursors.parentNode
  const items = itemParent.querySelectorAll('.indent-guide-plus')
  const existNum = items.length
  const neededNum = fns.length
  const createNum = Math.max(neededNum - existNum, 0)
  const recycleNum = Math.min(neededNum, existNum)
  let count = 0
  range(0, existNum, false).forEach(function(i) {
    const node = items.item(i)
    if (i < recycleNum) {
      return fns[count++](node)
    } else {
      return node.parentNode.removeChild(node)
    }
  })
  range(0, createNum, false).forEach(function() {
    const newNode = new GuideElement()
    newNode.classList.add('overlayer')
    fns[count++](newNode)
    return itemParent.insertBefore(newNode, cursors)
  })
  if (count !== neededNum) { throw 'System Error' }
}

function range(left, right, inclusive) {
  let range = []
  let ascending = left < right
  let end = !inclusive ? right : ascending ? right + 1 : right - 1
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i)
  }
  return range
}

module.exports = { styleGuide, createElementsForGuides }
