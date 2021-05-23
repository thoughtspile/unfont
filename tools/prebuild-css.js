const fs = require('fs');
const path = require('path');
const { faSpinCss } = require('../index.js');
const { dom } = require('@fortawesome/fontawesome-svg-core');

const target = path.join(__dirname, '..', 'css');
if (!fs.existsSync(target)) {
  fs.mkdirSync(target);
}
fs.writeFileSync(path.join(target, 'fa.css'), dom.css());
fs.writeFileSync(path.join(target, 'faSpin.css'), faSpinCss);
