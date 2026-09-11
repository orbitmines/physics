/* Opening the working behind an equation. One panel at a time, because the backdrop
   covers the viewport and a click meant for a second equation would close the first. */
(function () {
  var open = null;
  function show(id) {
    hide();
    var p = document.getElementById(id), b = document.getElementById('backdrop');
    if (!p) return;
    p.classList.add('open'); b.classList.add('open');
    p.focus(); open = p;
  }
  function hide() {
    if (open) open.classList.remove('open');
    var b = document.getElementById('backdrop');
    if (b) b.classList.remove('open');
    open = null;
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-derive]') : null;
    if (t) { show(t.getAttribute('data-derive')); return; }
    if (e.target.id === 'backdrop' || (e.target.dataset && e.target.dataset.close)) hide();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
})();

/*
 * SWITCHING BETWEEN CONFIGURATIONS, AND BETWEEN RESULTS.
 *
 * A theorem proved on four lattices is usually ONE derivation with four sets of numbers
 * in it - the steps read identically and only the counts differ - so it is set once and
 * the numbers are swapped underneath. Where the lattices genuinely disagree, and the
 * proof takes a different route or stops in a different place, those are DIFFERENT
 * RESULTS and neither is a variant of the other: they get left/right, and the
 * configurations that produced each are listed on it.
 *
 * THE FIRST OF EACH IS SHOWN AS SOON AS THIS RUNS, not on DOMContentLoaded. The stylesheet
 * hides every result until one is picked, so a reveal that waits for an event which may
 * already have fired renders the page empty - which is exactly what it did.
 */
(function () {
  function showResult(root, i) {
    var rs = root.querySelectorAll('[data-result]');
    for (var k = 0; k < rs.length; k++)
      rs[k].classList.toggle('on', String(k) === String(i));
    var at = root.querySelector('[data-at]');
    if (at) at.textContent = (Number(i) + 1) + ' / ' + rs.length;
    root.setAttribute('data-current', i);
  }
  function showConfig(result, name) {
    var cs = result.querySelectorAll('[data-config]');
    for (var k = 0; k < cs.length; k++)
      cs[k].classList.toggle('on', cs[k].getAttribute('data-config') === name);
    var bs = result.querySelectorAll('[data-pick]');
    for (var k = 0; k < bs.length; k++)
      bs[k].classList.toggle('sel', bs[k].getAttribute('data-pick') === name);
  }
  document.addEventListener('click', function (e) {
    var t = e.target;
    var pick = t.closest && t.closest('[data-pick]');
    if (pick) {
      /* a switch can sit inside a clickable equation; picking a lattice must not also
       * open the working */
      e.stopPropagation(); e.preventDefault();
      showConfig(pick.closest('[data-result]'), pick.getAttribute('data-pick'));
      return;
    }
    var nav = t.closest && t.closest('[data-nav]');
    if (nav) {
      e.stopPropagation(); e.preventDefault();
      var root = nav.closest('[data-results]');
      var n = root.querySelectorAll('[data-result]').length;
      var cur = Number(root.getAttribute('data-current') || 0);
      showResult(root, (cur + Number(nav.getAttribute('data-nav')) + n) % n);
    }
  });
  var roots = document.querySelectorAll('[data-results]');
  for (var i = 0; i < roots.length; i++) {
    /* nothing hides until this says so - see the note in notation.css */
    roots[i].classList.add('live');
    showResult(roots[i], 0);
    var rs = roots[i].querySelectorAll('[data-result]');
    for (var k = 0; k < rs.length; k++) {
      var first = rs[k].querySelector('[data-pick]');
      /* a result reached on one lattice has no switch, and its numbers are always shown */
      if (first) showConfig(rs[k], first.getAttribute('data-pick'));
      else {
        var only = rs[k].querySelector('[data-config]');
        if (only) only.classList.add('on');
      }
    }
  }
})();

/*
 * WHICH THEORY THE PAGE IS SHOWING.
 *
 * The theory decides which RULES ran, so switching it swaps the whole page beneath the
 * title - a different answer reached through the same shape of argument, which is the
 * comparison these folders exist to make cheap.
 *
 * DRIVABLE FROM OUTSIDE, because a page that only a person can operate cannot be embedded
 * in one that already knows which theory it is talking about. `?theory=G^XOR` in the
 * address picks one on load; `window.selectTheory("G^XOR")` picks one afterwards and
 * returns whether it found it.
 */
(function () {
  function apply(name) {
    var found = false;
    var groups = document.querySelectorAll('[data-theories]');
    for (var i = 0; i < groups.length; i++) {
      var blocks = groups[i].querySelectorAll(':scope > [data-theory]');
      var hit = null;
      for (var k = 0; k < blocks.length; k++)
        if (blocks[k].getAttribute('data-theory') === name) hit = blocks[k];
      /* a theorem that was not proved under this theory keeps whatever it was showing,
       * rather than going blank - the dropdown is shared across the page */
      if (!hit) continue;
      found = true;
      for (var k = 0; k < blocks.length; k++) blocks[k].classList.toggle('on', blocks[k] === hit);
    }
    var picks = document.querySelectorAll('[data-theory-pick]');
    for (var i = 0; i < picks.length; i++) if (picks[i].value !== name) picks[i].value = name;
    return found;
  }

  window.selectTheory = apply;

  document.addEventListener('change', function (e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-theory-pick'))
      apply(e.target.value);
  });

  var first = document.querySelector('[data-theory-pick]');
  if (first) {
    var asked = null;
    try {
      asked = new URLSearchParams(window.location.search).get('theory');
    } catch (err) { /* an address with no query is not an error */ }
    if (!asked || !apply(asked)) apply(first.value);
  }
})();
