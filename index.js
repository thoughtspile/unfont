const { icon, toHtml } = require('@fortawesome/fontawesome-svg-core');
const { fas } = require('@fortawesome/free-solid-svg-icons');
const { far } = require('@fortawesome/free-regular-svg-icons');
const { fab } = require('@fortawesome/free-brands-svg-icons');
const { parseFaCss, joinStyles, matchStyles, parseStyles } = require('./lib/styles');

const packs = { fas, far, fab };
const faCss = parseFaCss();

/**
 * @typedef {Object} UnfontFaParams
 *
 * @property {boolean} [inlineCss]
 * @property {Object} [transform]
 * @property {Object} [attributes]
 * @property {Object} [styles]
 */

/**
 * Render font-awesome icon to inline SVG
 *
 * @param {string} className
 * @param {UnfontFaParams} [params]
 * @returns {string} SVG with className and extra attributes / styles from params
 *
 *
 * @example
 * fa('fab fa-twitter')
 * @example <caption>With extra styles, classes and attributes</caption>
 * fa('fas fa-user-astronaut fa-2x', {
 *     styles: { color: 'red' },
 *     attributes: { id: 'icon' }
 * })
 * @example <caption>With inline fa CSS</caption>
 * fa('fas fa-user-astronaut fa-2x', { inlineCss: true })
 */
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
  if (!params.inlineCss) {
    return iconApi.html[0];
  }

  const iconNode = iconApi.abstract[0];
  const inlineStyles = joinStyles({
    ...matchStyles(iconNode.attributes.class, faCss.rules),
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

module.exports.fa = fa;
module.exports.faSpinCss = faCss.animationCss;
