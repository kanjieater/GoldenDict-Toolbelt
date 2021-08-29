const times = {program: new Date()};
const Promise = require('bluebird');
// const fs = Promise.promisifyAll(require("fs"));
const fs = require('fs');
const {argv} = require('yargs');
const rp = require('request-promise');
const path = require('path');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const TIMEOUT = argv.timeout || 2000;
const MAX_IMAGE_COUNT = Number(argv.images) || 20;
const SUGGESTED_CLASS = argv.suggestedClass || 'a.dloBPe.M3vVJe';
const ALTERNATIVE_CLASS = argv.alternativeClass || '.X6ZCif';
const URI = 'https://www.google.co.jp/search?tbm=isch';
const GD_URI = 'gdlookup://localhost/';

const ORIGINAL_HREF = 'https://www.google.co.jp';
const FULL_URI = `https://www.google.com/search?tbm=isch&q=${argv.input}&hl=${argv.lang}`;
const QUERY_URI = `https://www.google.com/search?tbm=isch&hl=${argv.lang}&q=`;
const HEADER_URI = `${URI}&q=${argv.input}&hl=${argv.lang}`;

const primarySelector = 'td';
// const baseCss = fs.readFileSync(path.resolve(__dirname, 'assets/base.css'), 'utf8');
// const html = fs.readFileSync(path.resolve(__dirname, 'base.css'), 'utf8');
// const baseJs = fs.readFileSync(path.resolve(__dirname, 'assets/base.js'), 'utf8');

function renderMarkup(input) {
  // let base = `<style>${baseCss}</style>`;
  let base = ``;
  let markup = [];
  // console.log(input)
  // if (input.exactBlock) {
    markup.push(`
     <div class="epwing_article">
      <h3>
        <section class="primary japanese_gothic focus" lang="ja">
          <a href="${FULL_URI}">${argv.input}</a>
        </section>
        <div class="timing">
          <div>準備: ${times.setupSeconds}秒</div>
          <div>検査: ${times.querySeconds}秒</div>
          <div>合計: ${markTime('program')}秒</div>
        </div>
      </h3>
     </div>
    `);
  // }
  if (input.hasSuggested) {
    markup.push(`
      <section id="suggestions" class="japanese_gothic focus" lang="ja">${input.suggested}</section>
    `);
  }
  if (input.hasAlternative) {
    markup.push(`
      <section id="alternative" class="japanese_gothic focus" lang="ja">${input.alternative}</section>
    `);
  }
  if (input.imageGrid) {
    markup.push(`
      <section id="image-grid" class="japanese_gothic focus" lang="ja">${input.imageGrid}</section>
    `);
  }

  console.log(`<!--<div id="golden-images">${base + markup.join('')}</div>-->`)
  return `<div id="golden-images">${base + markup.join('')}</div>`;
}

function round(input) {
  return parseFloat(Math.round(input * 1000) / 1000).toFixed(3);
}

function markTime(key, done) {
  return times[done] = round((new Date().getTime() - times[key].getTime()) / 1000);
}

function sanitize(input) {
  // Need to figure out what Jisho.org uri breaks on
  return input;
}

function getMainComponent($) {
  const content = $(primarySelector);
  if (!content.length) {
    return {};
  }
  let newContent = '';
  let misses = 0; //bad selector, so skip first 3 non results
  // eslint-disable-next-line func-names
  let imageCount = 0;
  content.find('a img').slice(misses).each(function () {
    // let miss = ($(this).parent().find('font').length===0)
    if(imageCount >= MAX_IMAGE_COUNT){

      return;
    }
    const $link = $(`<a></a>`)
    const $img = $(this);
    const oldSrc = $img.closest('a').attr('href');
    // console.log(oldSrc)
    const newSrc = ORIGINAL_HREF + oldSrc;
    // const $this = $(this);
    // const $img = $this.find('img');
    
    // console.log($img.hasClass('t0fcAb'))
    // if (!$img.hasClass(IMAGE_CLASS)) {
      
    //   return;
    // }
    

    $link.attr('href', newSrc);
    $link.addClass('image-container');
    $newImg = $('<img />');
    $newImg.attr('src', $img.attr('src'));
    $newImg.attr('title', $img.attr('alt'));
    // const c = $link.append($img)
    const c = $link.append($newImg);
    newContent += `${$.html(c)}`;
    imageCount++;
  });
  return {imageGrid: `<div class="image-list">${newContent}</div>`, hasImageGrid:!!newContent};
}

function getExactBlock($) {
  const content = $(primarySelector);
  if (!content.length) {
    return {};
  }
  let newContent;
  // eslint-disable-next-line func-names
  // content.find('a').each(function () {
  //   newContent += $(this).html()
  // });
  return {exactBlock: `<div>${newContent}</div>`};
}

function getSuggested ($) {
  const oldSrc = $(SUGGESTED_CLASS);
  const newSrc = GD_URI + oldSrc.text();
  let newContent = oldSrc.attr('href', newSrc);
  
  return {
    suggested: `<div><h3>${newContent}</h3></div>`,
    hasSuggested: !!oldSrc[0]
  }
}

function getAlternatives ($) {
  const src = $(ALTERNATIVE_CLASS);
  let hasAlternative = false;
  src.find('a').each(function() {
    hasAlternative = true;
    const alternative = $(this).text();
    const newHref = GD_URI + encodeURIComponent(`${argv.input} ${alternative}`);
    const $this = $(this);
    $this.attr('href', newHref);
  })
  return {
    alternative: `<div><h3>${src}</h3></div>`,
    hasAlternative
  }
}

function sanitizeRespose($) {
  // const noMatch = $('.images_table');
  //   //   if (noMatch.length) {
  //   //     return {};
  //   //   }
  // $('noscript').remove();
  //   console.log($.html())
  return Object.assign({}, getExactBlock($), getMainComponent($), getSuggested($), getAlternatives($));
  // return $.html()
}

function output(input) {
  // console.log(input)
  markTime('program', 'outputSeconds');
  if (!Object.keys(input).length) {
    return null;
  }
  const content = renderMarkup(input);
  // throw new Error(input)
  // const content = input;
  // fs.writeFile(path.resolve(__dirname, 'output.html'), content, (err) => {
  //   if (err) {
  //     return console.log(err);
  //   }
  // });

  console.log(content);
}

function getContent(args) {
  // console.log(`${URI}&q=${args.input}&hl=${args.lang}`);
  const options = {
    uri: encodeURI(FULL_URI),
    encoding: null,

    transform(body) {
      body = iconv.decode(new Buffer(body), 'Shift_JIS')
      markTime('query', 'querySeconds');
      // console.log(body);
      return cheerio.load(body);
    },
  };
  times.query = new Date();
  markTime('program', 'setupSeconds');
  return rp(options)
    .then($ => sanitizeRespose($))
    // .timeout(TIMEOUT)
    .catch(err => err);
}

getContent(sanitize(argv)).then(output);
