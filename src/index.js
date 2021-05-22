// as per https://fontawesome.com/how-to-use/on-the-web/advanced/svg-javascript-core
const { icon, dom, toHtml } = require('@fortawesome/fontawesome-svg-core');
const { fas } = require('@fortawesome/free-solid-svg-icons');
const { far } = require('@fortawesome/free-regular-svg-icons');
const { fab } = require('@fortawesome/free-brands-svg-icons');

const packs = { fas, far, fab };

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
  return [iconApi.abstract[0], toHtml(iconApi.abstract[0])];
}

console.log(fa('fab fa-twitter', { styles: { color: 'red' } }));

console.log(dom.css());

// function joinStyles(styles) {
//   return Object.keys(styles || {}).reduce(function (acc, styleName) {
//     return acc + "".concat(styleName, ": ").concat(styles[styleName], ";");
//   }, '');
// }
// function parseStyles(css) {
//   return style.split(';').reduce(function (acc, style) {
//     var styles = style.split(':');
//     var prop = styles[0];
//     var value = styles.slice(1);

//     if (prop && value.length > 0) {
//       acc[prop] = value.join(':').trim();
//     }

//     return acc;
//   }, {});
// }