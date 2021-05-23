const { dom } = require('@fortawesome/fontawesome-svg-core');
const specificitySorter = require('specificity').compare;
const { parse, stringify } = require('css');

function parseFaCss() {
  const blocks = parse(dom.css()).stylesheet.rules;
  const rules = blocks.filter(r => r.type === 'rule');

  const animationCss = stringify({
    type: 'stylesheet',
    stylesheet: {
      rules: blocks.filter(r => r.type === 'keyframes'),
    },
  });

  return { animationCss, rules };
}

function matchStyles(className, rules) {
  const classSet = new Set(className.split(/ +/g));
  const applyRules = [];
  rules.forEach(rule => {
    const matches = rule.selectors.filter(s => {
      const noRoot = s.replace(/:root +/, '');
      // no descendant selectors
      if (noRoot.includes(' ')) return false;
      return noRoot.split('.').filter(Boolean).every(cls => classSet.has(cls));
    });

    matches.forEach((selector) => {
      applyRules.push({ selector, declarations: rule.declarations });
    });
  });
  const styles = {};
  applyRules.sort((r1, r2) => specificitySorter(r1.selector, r2.selector)).forEach((rule) => {
    rule.declarations.forEach(decl => {
      styles[decl.property] = decl.value;
    });
  });
  return styles;
}

function joinStyles(styles) {
  return Object.keys(styles || {}).reduce(function (acc, styleName) {
    return acc + "".concat(styleName, ": ").concat(styles[styleName], ";");
  }, '');
}

function parseStyles(style) {
  if (!style) return {};
  return style.split(';').reduce(function (acc, style) {
    var styles = style.split(':');
    var prop = styles[0];
    var value = styles.slice(1);

    if (prop && value.length > 0) {
      acc[prop] = value.join(':').trim();
    }

    return acc;
  }, {});
}

Object.assign(module.exports, {
  parseFaCss,
  joinStyles,
  matchStyles,
  parseStyles,
});
