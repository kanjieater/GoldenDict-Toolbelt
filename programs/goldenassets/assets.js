const times = {program: new Date()};
const Promise = require('bluebird');
const fs = require('fs');
const {argv} = require('yargs');
const path = require('path');


const ORIGINAL_HREF = '/search/';

const baseCss = fs.readFileSync(path.resolve(__dirname, 'assets/base.css'), 'utf8');
// const html = fs.readFileSync(path.resolve(__dirname, 'base.css'), 'utf8');
const baseJs = fs.readFileSync(path.resolve(__dirname, 'assets/base.js'), 'utf8');
const vendorJs = fs.readFileSync(path.resolve(__dirname, 'assets/vendor.js'), 'utf8');

function renderMarkup() {

  const markup = `
    <style>${baseCss}</style>
    <script>
    window.gdword = '${argv.input}';
    ${vendorJs}
    ${baseJs}
    </script>
`;
  return markup;
}

function markTime(key, done) {
  times[done] = (new Date().getTime() - times[key].getTime()) / 1000;
  return times[done];
}

function sanitize(input) {
  // Need to figure out what Jisho.org uri breaks on
  return input;
}

function sanitizeRespose($) {
  const content = $('#zen_bar');
  if (!content) {
    return null;
  }

  // eslint-disable-next-line func-names
  content.find('a').each(function () {
    const oldSrc = $(this).attr('href');
    const newSrc = oldSrc.replace(ORIGINAL_HREF, GD_URI);
    $(this).attr('href', newSrc);
  });
  return content.html();
}

function output(input) {
  markTime('program', 'outputSeconds');
  if (!input) {
    return null;
  }
  const content = renderMarkup(input);
  fs.writeFile(path.resolve(__dirname, 'assets/output.html'), content, (err) => {
    if (err) {
      return console.log(err);
    }

    // console.log(input);
    // console.log('The file was saved!');
    return null;
  });

  console.log(`${content}`);
}

function getContent() {
  return renderMarkup();
}

output(getContent());
