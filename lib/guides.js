'use babel'

import { Point } from 'atom'

const toG = function(indents, begin, depth, cursorRows) {
  let ptr = begin
  let isActive = false
  let isStack = false

  const gs = []
  while ((ptr < indents.length) && (depth <= indents[ptr])) {
    if (depth < indents[ptr]) {
      const r = toG(indents, ptr, depth + 1, cursorRows)
      if (r.guides[0] != null ? r.guides[0].stack : undefined) { isStack = true }
      Array.prototype.push.apply(gs, r.guides);
      ({ ptr } = r)
    } else {
      if (Array.from(cursorRows).includes(ptr)) {
        isActive = true ; isStack = true
      }
      ptr++
    }
  }
  if (depth !== 0) {
    gs.unshift({
      length: ptr - begin,
      point: new Point(begin, depth - 1),
      active: isActive,
      stack: isStack
    })
  }
  return { guides: gs, ptr }
}

const fillInNulls = function(indents) {
  const res = indents.reduceRight(
    function(acc, cur) {
      if (cur === null) {
        acc.r.unshift(acc.i)
        return { r: acc.r, i: acc.i }
      } else {
        acc.r.unshift(cur)
        return { r: acc.r, i: cur }
      }
    },{ r: [], i: 0 })
  return res.r
}

export const toGuides = function(indents, cursorRows) {
  const ind = fillInNulls(indents.map(function(i) { if (i === null) { return null } else { return Math.floor(i) } }))
  return toG(ind, 0, 0, cursorRows).guides
}

const getVirtualIndent = function(getIndentFn, row, lastRow) {
  for (let i = row, end = lastRow, asc = row <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    const ind = getIndentFn(i)
    if (ind != null) { return ind }
  }
  return 0
}

export const uniq = function(values) {
  const newVals = []
  let last = null
  for (let v of Array.from(values)) {
    if ((newVals.length === 0) || (last !== v)) {
      newVals.push(v)
    }
    last = v
  }
  return newVals
}

const mergeCropped = function(guides, above, below, height) {
  guides.forEach(function(g) {
    if (g.point.row === 0) {
      if (Array.from(above.active).includes(g.point.column)) {
        g.active = true
      }
      if (Array.from(above.stack).includes(g.point.column)) {
        g.stack = true
      }
    }
    if (height < (g.point.row + g.length)) {
      if (Array.from(below.active).includes(g.point.column)) {
        g.active = true
      }
      if (Array.from(below.stack).includes(g.point.column)) {
        return g.stack = true
      }
    }
  })
  return guides
}

const supportingIndents = function(visibleLast, lastRow, getIndentFn) {
  if (getIndentFn(visibleLast) != null) { return [] }
  const indents = []
  let count = visibleLast + 1
  while (count <= lastRow) {
    const indent = getIndentFn(count)
    indents.push(indent)
    if (indent != null) { break }
    count++
  }
  return indents
}

export const getGuides = function(visibleFrom, visibleTo, lastRow, cursorRows, getIndentFn) {
  const visibleLast = Math.min(visibleTo, lastRow)
  const visibleIndents = range(visibleFrom, visibleLast, true).map(getIndentFn)
  const support = supportingIndents(visibleLast, lastRow, getIndentFn)
  const guides = toGuides(
    visibleIndents.concat(support), cursorRows.map(c => c - visibleFrom))
  const above = statesAboveVisible(cursorRows, visibleFrom - 1, getIndentFn, lastRow)
  const below = statesBelowVisible(cursorRows, visibleLast + 1, getIndentFn, lastRow)
  return mergeCropped(guides, above, below, visibleLast - visibleFrom)
}

const statesInvisible = function(cursorRows, start, getIndentFn, lastRow, isAbove) {
  if (isAbove ? start < 0 : lastRow < start) {
    return { stack: [], active: [] }
  }
  const cursors = isAbove ?
    uniq(cursorRows.filter(r => r <= start).sort(), true).reverse()
  :
    uniq(cursorRows.filter(r => start <= r).sort(), true)
  const active = []
  let stack = []
  let minIndent = Number.MAX_VALUE
  for (let i of Array.from((isAbove ? range(start, 0, true) : range(start, lastRow, true)))) {
    const ind = getIndentFn(i)
    if (ind != null) { minIndent = Math.min(minIndent, ind) }
    if ((cursors.length === 0) || (minIndent === 0)) { break }
    if (cursors[0] === i) {
      cursors.shift()
      const vind = getVirtualIndent(getIndentFn, i, lastRow)
      minIndent = Math.min(minIndent, vind)
      if (vind === minIndent) { active.push(vind - 1) }
      if (stack.length === 0) { stack = range(0, minIndent - 1, true) }
    }
  }
  return { stack: uniq(stack.sort()), active: uniq(active.sort()) }
}

export const statesAboveVisible = (cursorRows, start, getIndentFn, lastRow) => statesInvisible(cursorRows, start, getIndentFn, lastRow, true)

export const statesBelowVisible = (cursorRows, start, getIndentFn, lastRow) => statesInvisible(cursorRows, start, getIndentFn, lastRow, false)

function range(left, right, inclusive) {
  let range = []
  let ascending = left < right
  let end = !inclusive ? right : ascending ? right + 1 : right - 1
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i)
  }
  return range
}
