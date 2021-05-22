// as per https://fontawesome.com/how-to-use/on-the-web/advanced/svg-javascript-core
const specificitySorter = require('specificity').compare;
const { icon, dom, toHtml } = require('@fortawesome/fontawesome-svg-core');
const { fas } = require('@fortawesome/free-solid-svg-icons');
const { far } = require('@fortawesome/free-regular-svg-icons');
const { fab } = require('@fortawesome/free-brands-svg-icons');
const { parse, stringify } = require('css');

const packs = { fas, far, fab };
const faCss = parseCss();

// const {
//   transform = meaninglessTransform,
//   symbol = false,
//   mask = null,
//   maskId = null,
//   title = null,
//   titleId = null,
//   classes = [],
//   attributes = {},
//   styles = {}
// }

function fa(className, params = {}) {
  const classList = className.split(/ +/g);
  const classSet = new Set(classList);

  const packName = classList.find(cn => cn in packs);
  if (!packName) {
    throw new Error(`Icon pack (${Object.keys(packs).join(', ')}) not found in "${classList}"`);
  }
  const pack = packs[packName];

  const icons = Object.values(pack).filter(icon => {
    return classSet.has(icon.iconName) || classSet.has(`fa-${icon.iconName}`)
  });
  if (icons.length === 0) {
    throw new Error(`No icon found for "${className}" in pack ${packName}`);
  }
  if (icons.length > 1) {
    throw new Error(`Expected one icon name in "${className}", got: ${icons.map(i => i.iconName).join(', ')}`);
  }
  const iconApi = icon(icons[0], { ...params, classes: classList });
  const iconNode = iconApi.abstract[0];
  const inlineStyles = joinStyles({
    ...matchStyles(iconNode.attributes.class),
    ...parseStyles(iconNode.attributes.style),
  });
  return toHtml({
    ...iconNode,
    attributes: {
      ...iconNode.attributes,
      style: inlineStyles,
    }
  });
}

function parseCss() {
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

function matchStyles(className, rules = faCss.rules) {
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

// console.log(fa('fab fa-twitter', { styles: { color: 'red' } }));

module.exports.fa = fa;
