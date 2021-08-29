const times = { program: new Date() };
const Promise = require('bluebird');
// const fs = Promise.promisifyAll(require("fs"));
const fs = require('fs');
const { argv } = require('yargs').array('fields').array('addTags');
const rp = require('request-promise');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');
const frequency = require('./frequency');
const TIMEOUT = argv.timeout || 4000;
const URI = 'https://jisho.org/search/';
const GD_URI = 'gdlookup://localhost/';
const ANKI_CONNECT_URI = argv.ankiconnect || 'http://localhost:8765';
const ANKI_MEDIA_PATH = (argv.ankimedia || '""').slice(1, -1);
const ADD_ON_ID = '247820692';
const ANKI_ADDON_ASSETS = `file:///${ path.resolve(path.join(ANKI_MEDIA_PATH.replace('file:///', ''), '../../addons21/', ADD_ON_ID, 'assets'))}`.replace(/\\/g, '/');
const ORIGINAL_HREF = '/search/';
const DESIRED_FIELDS = argv.fields || ['dueDate'];

const MAX_CARDS = argv.max || 1000;

// const ADD_DECK = (argv.addDeck || '""');
// const ADD_MODEL = argv.addModel;
// const ADD_VOCAB = argv.addVocab;
// const ADD_DEF = argv.addDef;
// const ADD_TAGS = JSON.stringify(argv.addTags || []);
let SEARCH = argv.search;
if (argv.search) {
  // Windows CLI doesn't like ' and Anki doesn't like ' being in the contents of search!
  SEARCH = argv.search.replace(/'/g, '"');
}

// const baseCss = fs.readFileSync(path.resolve(__dirname, 'assets/base.css'), 'utf8');
// const html = fs.readFileSync(path.resolve(__dirname, 'base.css'), 'utf8');
// const baseJs = fs.readFileSync(path.resolve(__dirname, 'assets/base.js'), 'utf8');

const queueMap = {
  suspended: 'suspended',
  new: 'new',
  learning: 'learning',
  review: 'review',
  buried: 'buried',
};

const buckets = {
  suspended: 0,
  new: 0,
  learning: 0,
  review: 0,
  buried: 0,
};

function round(input) {
  return parseFloat(Math.round(input * 1000) / 1000).toFixed(3);
}
function markTime(key, done) {
  return times[done] = round((new Date().getTime() - times[key].getTime()) / 1000);
}

function mapQueue(queue) {
  // queue           integer not null,
  // -- -3=user buried(In scheduler 2),
  // -- -2=sched buried (In scheduler 2),
  // -- -2=buried(In scheduler 1),
  // -- -1=suspended,
  // -- 0=new, 1=learning, 2=review (as for type)
  // -- 3=in learning, next rev in at least a day after the previous review
  // -- 4=preview

  const queueEnum = {
    '-3': queueMap.buried,
    '-2': queueMap.buried,
    '-1': queueMap.suspended,
    0: queueMap.new,
    1: queueMap.learning,
    2: queueMap.review,
    3: queueMap.learning,
    4: queueMap.learning,
  };
  const queueClass = queueEnum[`${queue}`];
  return queueClass;
}

function setAudioLocation(media) {
  const pattern = /(\[)(.*?)(\])/g;
  const matches = media.match(pattern);
  const response = [''];
  if (matches !== null && matches.length !== 0) {
    return ANKI_MEDIA_PATH + response[0];
  }
  return response;
}

function setMediaLocation(media) {
  const pattern = /(")(.*?)(")/g;
  const matches = media.match(pattern);
  let response = [''];
  if (matches !== null && matches.length !== 0) {
    response = matches.map(m => ANKI_MEDIA_PATH + m.replace(/"/g, ''));
  }
  return response;
}

function displayCards(cards) {
  // console.log(cards);
  // console.log(cards.length)
  // return JSON.stringify(cards[0]);
  return cards.reduce((accumulator, card) => {
    let row = '';
    // console.log(card);
    
    DESIRED_FIELDS.forEach((key) => {
      if (key === 'Audio') {
        row += `<td class="table-entry"><audio autoplay controls="controls">
        <source src="${setAudioLocation(card[key])}"/></audio></td>`;
      } else if (key === 'Image') {
        const imgs = setMediaLocation(card[key]).reduce((acc, curr) => {
          if (curr) {
            const newAcc = `${acc}<img src="${curr}" class="table-img">`;
            return newAcc;
          }
          return acc;
        }, '');
        row += `<td class="table-entry">${imgs}</td>`;
      } else if (key === 'dueDate') {
        row += `<td class="table-entry">
        <a onclick="openAnkiCard('${card.cardId}')" >${card[key]}<a>
        </td>`;
      } else {
        row += `<td class="table-entry">${card[key]}</td>`;
      }
    });
    // console.log(`${accumulator} here`);
    return `${accumulator}<tr class="${card.queue}-row">${row}</tr>`;
  }, '');
}


function renderMarkup(input) {
  // const base = `<style>${baseCss}</style>`;
  const base = '';
  const markup = [];
  if (input.exactBlock) {
    markup.push(`
     <div class="epwing_article">
      <h3>
        <section id="primary" class="japanese_gothic focus" lang="ja">${input.exactBlock}
        </section>
        <div id="timing"> 
          <div>準備: ${times.setupSeconds}秒</div> 
          <div>検査: ${times.querySeconds}秒</div> 
          <div>合計: ${markTime('program')}秒</div>
        </div>
      </h3>
      
     </div>
    `);
  }

  if (input.zenBar) {
    markup.push(`
      <section id="zen_bar" class="japanese_gothic focus" lang="ja">${input.zenBar}
    </section>
    `);
  }
  if (input.cards) {
    const resultsString = `${input.cards.length} result${(input.cards.length !== 1 && 's') || ''}`;

    const bucketsTable = `
    <span class="buckets-table">
    <span class="${queueMap.review}-row" title="Review">${buckets.review}</span>
    <span class="${queueMap.new}-row" title="New & Learning"> ${buckets.new + buckets.learning}</span>
    <span class="${queueMap.suspended}-row" title="Suspended">  ${buckets.suspended}</span> 
    ${input.freq.components.shortcut}
    </span>
    `;
    markup.push(`
    <div id="anki-search" class="epwing_article">
     <h3>
       <section id="primary" class="japanese_gothic focus" lang="ja">
       <script> 
        window.addEventListener('load', function() {
          //activeListener();
          // loadCopy();
         $('.anki-results').html('${markTime('program')}秒: ${resultsString}').append($('.buckets-table'));
         // so the shortcut doesn't cut things off
         document.body.appendChild(document.createElement('br'));
        });
       function searchAnkiGui() {
        $.ajax({
          url:"${ANKI_CONNECT_URI}", 
          type: "POST",
          dataType: "json",
          data: JSON.stringify({
            action: "guiBrowse",
            version: 6,
            params: {
                query: '${SEARCH.split(argv.input).join("'+ gdword +'")}'
            }
          })
        });
       }
       function openAnkiCard(cid) {
        $.ajax({
          url:"${ANKI_CONNECT_URI}", 
          type: "POST",
          dataType: "json",
          data: JSON.stringify({
            action: "guiBrowse",
            version: 6,
            params: {
                query: 'cid:'+cid
            }
          })
        });
       }
       </script>
       <a onclick="window.searchAnkiGui()">${resultsString}</a>
       </section>
       <div id="timing"> 
         <div>準備: ${times.setupSeconds}秒</div> 
         <div>検査: ${times.querySeconds}秒</div> 
         <div>合計: ${markTime('program')}秒</div>
       </div>
     </h3>

     <script>
    window.addEventListener('load', function() {
      loadCopy();
      setStars();
    });

    // var copyBtn = document.querySelector('#copy-btn');
    function formatHtml(text){
      return text
    }
    function getDef(element){
      
      console.log(element);
      var text = element.parent('h3').next('.epwing_text, .sdct_h').first().html();
      return formatHtml(text);
    }
    function flash(element, message, fadetime) {
      fadetime = fadetime || 1000;
      element.removeClass('disabled');
      $('body').append('<span class="flash-notice">'+message+'</span>');
      $('.flash-notice').last().fadeOut(fadetime, function() {
        $('.flash-notice').remove();
      });
    }
    function copyToAnki(el) {
      var element = $(el);
      var text = getDef(element);
      element.addClass('disabled')
      try {  
        
        $.ajax({
          url:"${ANKI_CONNECT_URI}", 
          type: "POST",
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify({
            action: "sendToAnki",
            version: 6,
            params: {
                "note": {
                  "fields": {
                      "vocab": window.gdword,
                      "definition": text
                  },
              }
            }
          }),
          success: function( resp ) {
            if (resp.error){
              var message = resp.error;
              flash(element, message, 5000);
            } else {
              var message = 'Sent to Anki!';
              flash(element, message);
            }  
          },
          error: function( req, status, err ) {
            console.log( 'something went wrong', status, err );
            var message = 'Failed!';
            flash(element, message);
          }
        })
      } catch(err) {  
        console.log(err);
      }  
    }
    function copyStuff(el) {  
      var element = $(el);
      var text = getDef(element)
      element.addClass('disabled')
      try {  
        
        $.ajax({
          url:"${ANKI_CONNECT_URI}", 
          type: "POST",
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify({
            action: "copyToClipboard",
            version: 6,
            params: {
                text: text
            }
          }),
          success: function( resp ) {
            var message = 'Copied!';
            flash(element, message);
          },
          error: function( req, status, err ) {
            console.log( 'something went wrong', status, err );
            var message = 'Failed!';
            flash(element, message);
          }
        })
      } catch(err) {  
        console.log(err);
      }  
  
      // Remove the selections - NOTE: Should use
      // removeRange(range) when it is supported  
      // window.getSelection().removeAllRanges();  
    }
    // copyBtn.addEventListener('click', copyStuff);
    // document.addEventListener('keyup', copyStuff);
  
    function loadCopy() {
      var copyImg = '<a class="img-holder" onclick="window.copyStuff(this)">' + \
      '<img src="${ANKI_ADDON_ASSETS}/images/_copy-img.png" class="copy-img"></a>';
      $("h3").prepend(copyImg);

      var ankiImg = '<a class="img-holder" onclick="window.copyToAnki(this)">' + \
      '<img src="${ANKI_ADDON_ASSETS}/images/_anki-img.png" class="copy-img"></a>';
      $("h3").prepend(ankiImg);

    }
    // function activeListener(){
  
      // $(".epwing_text").on('hover', function() {
      //   console.log('here')
      //   $(this).addClass('active')
      // })
  
  
      // $(document).keyup(function(event){
      //   throw new Error(event);
      //   event.stopImmediatePropagation();
      //   event.preventDefault();
      //   console.log(event)
      //     if(event.which == 107) {
  
            
      //       var el = $('.gdactivearticle .epwing_text');
      //       window.copyStuff(el);
      //     }
      // });
    // }


    //freq
    var fl = JSON.parse('${JSON.stringify(input.freq.components.freq)}');
    function isMatch(cm, f){
      var matched = false;
      cm.words.forEach(function(word) {
  
        // console.log(cm.reading, f.reading, word, f.word)
        // console.log(cm, f, cm.reading == f.reading && word == f.word, word == f.katakanaReading)
        if(cm.reading == f.reading && (word == f.word || word == f.alt)){
          matched = true;
        } else if (word == cm.reading && (cm.reading == f.katakana || cm.reading == f.reading)) {
          // ころころ
          matched = true;
        }
      })
      return matched;
    }

    function matchToFreq(cm){
      var matches = []
      fl.forEach(function(f) {

        if (isMatch(cm, f)){
          matches.push(f);
        }
      });
      
      return matches;
    }

    function setMatch(clientMatch, el) {
      var matches = matchToFreq(clientMatch);
      if (matches.length) {
        var cmp = [];
        matches.forEach(function(match){          
          cmp.push(  match.word + '|' + match.stars) ;          
        });
        var $el = $(el);
        $el.find('br').first().replaceWith('<span class="frequency-placeholder"> '+matches[0].stars+'</span><br>');
        // if(cmp.length > 1) {
        //   $el.append('<span class="frequency-placeholder">'+cmp.join(' ')+'</span>')
        // }

      }
    }

    function setStars() {
      $('.epwing_text').each(function(i, el){
        var firstLine = $( this ).html().split("<br>")[0];
        var text = $('<span>' + firstLine + '</span>').text();
        // var readingBlacklist = ['‐', '・', '△', '×']
        var readingBlacklist = /-|‐|・/g;
        var wordBlacklist = /×|△|）|（/g;
        var wordDelimiter = '・';
        var smkWordDelimiter = '【'
        // REs
        // TODO multiple sets of 【 
        var readingWord = /^(.*)【(.+)】(.*)$/; 
        var readingJunkWord = /(.*)( .*) 【(.*)】/;
        var readingSpace = /^[^ ]+/;

        var clientMatch = {
          reading: '',
          words: []
        }
        var match = readingWord.exec(text);
        if(!match) {
          match = readingSpace.exec(text);
        } 
        if(!match) {
          match = readingJunkWord.exec(text);
        }
        if (!match) {
          return;
        }
        console.log(match)
        if(match[2] || match[1]) {
          clientMatch.reading = match[1].replace(readingBlacklist,'').split(" ")[0];
          console.log(clientMatch.reading)
          var maxRuns = (clientMatch.reading.match(new RegExp(smkWordDelimiter, 'g')) || []).length;
          var count = 0;
          var multiMatch = match;
          while(clientMatch.reading.indexOf(smkWordDelimiter) > -1 && count < maxRuns){
            multiMatch = readingWord.exec(multiMatch[1])
            console.log(multiMatch)
            if(!multiMatch){
              break;
            }
            clientMatch.reading = multiMatch[1];
            clientMatch.words.push(multiMatch[2]);
            console.log(clientMatch)
            count++;
          }
          
          if(match[2].indexOf(wordDelimiter) > -1){
            clientMatch.words = clientMatch.words.concat(match[2].split(wordDelimiter));
          }else {
            clientMatch.words.push(match[2]);
          }
          
          var cleanedWords = []
          clientMatch.words.forEach(function(word) {
            cleanedWords.push(word.replace(wordBlacklist,''));
          });
          clientMatch.words = cleanedWords;
        } else if (match[0]) {
          clientMatch.reading = match[0].replace(readingBlacklist,'');
          clientMatch.words = [clientMatch.reading]
        }
        return setMatch(clientMatch, el)

      });
    }
    </script>
    </div>
   `);
    markup.push(input.freq.components.dictEntry);
    markup.push(`
      <section id="anki_cards" class="japanese_gothic focus" lang="ja">
      ${bucketsTable}
      <table>
      <tr><th>${DESIRED_FIELDS.join('</th><th>')}</th></tr>
      ${displayCards(input.cards)}
      </table>
      <a class="anki-results" href="#anki-search"> </a>
      
      </section>

    `);
  } else if (input.cardError) {
    markup.push(`
    <section id="anki_cards" class="japanese_gothic focus" lang="ja">⚠ ${input.cardError}</section>
  `);
  }

  return `<div id="zen">${base + markup.join('')}</div>`;
}


function sanitize(input) {
  // Need to figure out what Jisho.org uri breaks on
  return input;
}

function getZenBar($) {
  const content = $('#zen_bar');
  if (!content.length) {
    return {};
  }
  // eslint-disable-next-line func-names
  content.find('a').each(function () {
    const oldSrc = $(this).attr('href');
    const newSrc = oldSrc.replace(ORIGINAL_HREF, GD_URI);
    $(this).attr('href', newSrc);
  });
  return { zenBar: content.html() };
}

function getExactBlock($) {
  const content = $('#primary .exact_block .concept_light-readings');
  if (!content.length) {
    return {};
  }
  // eslint-disable-next-line func-names
  content.find('.text').each(function () {
    const text = $(this).text().trim();
    $(this).html(`<a href="${GD_URI}${text}">${text}</a>`);
  });

  return { exactBlock: content.html() };
}

function sanitizeRespose($) {
  const noMatch = $('#no-matches');
  if (noMatch.length) {
    return {};
  }
  return Object.assign({}, getExactBlock($), getZenBar($));
}

function output(input) {
  markTime('program', 'outputSeconds');
  if (!Object.keys(input).length) {
    return null;
  }

  const content = renderMarkup(input);

  // fs.writeFile(path.resolve(__dirname, 'output.html'), content, (err) => {
  //   if (err) {
  //     return console.log(err);
  //   }
  // });


  console.log(content);
}

function errorHandler(error) {
  // console.log(error);
  return { cardError: error };
}


function getSingleCardInfo(card) {
  const newValue = {};
  const requiredFields = ['queue', 'cardId'];
  DESIRED_FIELDS.concat(requiredFields).forEach((field) => {
    if (card.fields[field]) {
      newValue[field] = (card.fields[field] && card.fields[field].value) || '';
    } else if (field === 'queue') {
      const queueType = mapQueue(card.queue);
      newValue[field] = queueType;
      buckets[queueType] += 1;
    } else if (field === 'deckName') {
      newValue[field] = card[field].substr(card[field].lastIndexOf(':') + 1);
    } else {
      newValue[field] = card[field] || '';
    }
  });

  return newValue;
}

function getMatchingCards() {
  const uri = ANKI_CONNECT_URI;
  const searchQuery = `${SEARCH}`;
  const query = {
    version: 6,
    action: 'goldenCardsInfo',
    params: {
      query: searchQuery,
      desiredFields: DESIRED_FIELDS,
    },
  };

  return axios
    .post(uri, query, { timeout: TIMEOUT })
    // .then(console.log)
    .then((response) => {
      const accumulator = [];
      response.data.result.every((currentValue, currentIndex) => {
        if (currentIndex >= MAX_CARDS) {
          return false;
        }
        accumulator.push(getSingleCardInfo(currentValue));
        return accumulator;
      });
      return accumulator;
    })
    .then((cards) => {
      // console.log(cards);
      markTime('query', 'querySeconds');
      return { cards };
    })
    .catch(errorHandler);
}

function getZenContent(input) {
  const options = {
    uri: encodeURI(`${URI}${input}`),
    transform(body) {
      markTime('query', 'querySeconds');
      return cheerio.load(body);
    },
  };

  return rp(options)
    .then($ => sanitizeRespose($)).timeout(TIMEOUT);
}

// Promise.all([getZenContent(sanitize(argv.input)), getMatchingCards()])
//   .catch(err => err)
//   .then(output);
// console.log(argv);
times.query = new Date();
markTime('program', 'setupSeconds');

const workers = [];
if (SEARCH) {
  const freqPromise = frequency.getFrequency(argv.input)
    .then(freq => ({ freq }));
  workers.push(freqPromise);
  workers.push(getMatchingCards());
} else {
  workers.push(getZenContent(sanitize(argv.input)));
}

if (workers.length) {
  Promise.all(workers)
    .catch(err => err)
    .then((input) => {
      let componentDict = {};
      input.forEach((entry) => {
        componentDict = Object.assign(componentDict, entry);
      });
      output(componentDict);
    });
}
