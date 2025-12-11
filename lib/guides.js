const { Point } = require("atom");

const toG = function (indents, begin, depth, cursorSet) {
  let ptr = begin;
  let isActive = false;
  let isStack = false;

  const gs = [];
  const indentsLength = indents.length;
  while (ptr < indentsLength && depth <= indents[ptr]) {
    if (depth < indents[ptr]) {
      const r = toG(indents, ptr, depth + 1, cursorSet);
      if (r.guides[0] !== null ? r.guides[0].stack : undefined) {
        isStack = true;
      }
      Array.prototype.push.apply(gs, r.guides);
      ({ ptr } = r);
    } else {
      if (cursorSet.has(ptr)) {  // O(1) lookup instead of O(n)
        isActive = true;
        isStack = true;
      }
      ptr++;
    }
  }
  if (depth !== 0) {
    gs.unshift({
      length: ptr - begin,
      point: new Point(begin, depth - 1),
      active: isActive,
      stack: isStack,
    });
  }
  return { guides: gs, ptr };
};

const fillInNulls = function (indents) {
  const res = indents.reduceRight(
    function (acc, cur) {
      if (cur === null) {
        acc.r.unshift(acc.i);
        return { r: acc.r, i: acc.i };
      } else {
        acc.r.unshift(cur);
        return { r: acc.r, i: cur };
      }
    },
    { r: [], i: 0 }
  );
  return res.r;
};

const toGuides = function (indents, cursorRows) {
  const ind = fillInNulls(
    indents.map(function (i) {
      if (i === null) {
        return null;
      } else {
        return Math.floor(i);
      }
    })
  );
  const cursorSet = new Set(cursorRows);  // O(1) lookup in toG
  return toG(ind, 0, 0, cursorSet).guides;
};

const getVirtualIndent = function (getIndentFn, row, lastRow) {
  for (
    let i = row, end = lastRow, asc = row <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    const ind = getIndentFn(i);
    if (ind !== null) {
      return ind;
    }
  }
  return 0;
};

const uniq = function (values) {
  if (values.length === 0) return [];
  const newVals = [values[0]];
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i - 1]) {
      newVals.push(values[i]);
    }
  }
  return newVals;
};

const mergeCropped = function (guides, above, below, height) {
  const aboveActive = above.active;
  const aboveStack = above.stack;
  const belowActive = below.active;
  const belowStack = below.stack;

  guides.forEach(function (g) {
    const gCol = g.point.column;
    if (g.point.row === 0) {
      if (aboveActive.includes(gCol)) {
        g.active = true;
      }
      if (aboveStack.includes(gCol)) {
        g.stack = true;
      }
    }
    if (height < g.point.row + g.length) {
      if (belowActive.includes(gCol)) {
        g.active = true;
      }
      if (belowStack.includes(gCol)) {
        g.stack = true;
      }
    }
  });
  return guides;
};

const supportingIndents = function (visibleLast, lastRow, getIndentFn) {
  if (getIndentFn(visibleLast) !== null) {
    return [];
  }
  const indents = [];
  let count = visibleLast + 1;
  while (count <= lastRow) {
    const indent = getIndentFn(count);
    indents.push(indent);
    if (indent !== null) {
      break;
    }
    count++;
  }
  return indents;
};

const getGuides = function (
  visibleFrom,
  visibleTo,
  lastRow,
  cursorRows,
  getIndentFn
) {
  const visibleLast = Math.min(visibleTo, lastRow);
  const visibleIndents = range(visibleFrom, visibleLast, true).map(getIndentFn);
  const support = supportingIndents(visibleLast, lastRow, getIndentFn);
  const guides = toGuides(
    visibleIndents.concat(support),
    cursorRows.map((c) => c - visibleFrom)
  );
  const above = statesAboveVisible(
    cursorRows,
    visibleFrom - 1,
    getIndentFn,
    lastRow
  );
  const below = statesBelowVisible(
    cursorRows,
    visibleLast + 1,
    getIndentFn,
    lastRow
  );
  return mergeCropped(guides, above, below, visibleLast - visibleFrom);
};

const statesInvisible = function (
  cursorRows,
  start,
  getIndentFn,
  lastRow,
  isAbove
) {
  if (isAbove ? start < 0 : lastRow < start) {
    return { stack: [], active: [] };
  }
  const cursors = isAbove
    ? uniq(cursorRows.filter((r) => r <= start).sort()).reverse()
    : uniq(cursorRows.filter((r) => start <= r).sort());
  const active = [];
  let stack = [];
  let minIndent = Number.MAX_VALUE;
  const loopRange = isAbove
    ? range(start, 0, true)
    : range(start, lastRow, true);
  for (let i of loopRange) {
    const ind = getIndentFn(i);
    if (ind !== null) {
      minIndent = Math.min(minIndent, ind);
    }
    if (cursors.length === 0 || minIndent === 0) {
      break;
    }
    if (cursors[0] === i) {
      cursors.shift();
      const vind = getVirtualIndent(getIndentFn, i, lastRow);
      minIndent = Math.min(minIndent, vind);
      if (vind === minIndent) {
        active.push(vind - 1);
      }
      if (stack.length === 0) {
        stack = range(0, minIndent - 1, true);
      }
    }
  }
  return { stack: uniq(stack.sort()), active: uniq(active.sort()) };
};

const statesAboveVisible = (cursorRows, start, getIndentFn, lastRow) =>
  statesInvisible(cursorRows, start, getIndentFn, lastRow, true);

const statesBelowVisible = (cursorRows, start, getIndentFn, lastRow) =>
  statesInvisible(cursorRows, start, getIndentFn, lastRow, false);

function range(left, right, inclusive) {
  const result = [];
  const ascending = left < right;
  const end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    result.push(i);
  }
  return result;
}

module.exports = {
  toGuides,
  uniq,
  getGuides,
  statesAboveVisible,
  statesBelowVisible,
};
