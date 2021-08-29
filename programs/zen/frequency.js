const WORD = 2;
const READING = 1;
const ALT = 0;

const hiraganaMap = {
  あ: 'ア', い: 'イ', う: 'ウ', え: 'エ', お: 'オ', か: 'カ', き: 'キ', く: 'ク', け: 'ケ', こ: 'コ', さ: 'サ', し: 'シ', す: 'ス', せ: 'セ', そ: 'ソ', た: 'タ', ち: 'チ', つ: 'ツ', っ: 'ッ', て: 'テ', と: 'ト', な: 'ナ', に: 'ニ', ぬ: 'ヌ', ね: 'ネ', の: 'ノ', は: 'ハ', ひ: 'ヒ', ふ: 'フ', へ: 'ヘ', ほ: 'ホ', ま: 'マ', み: 'ミ', む: 'ム', め: 'メ', も: 'モ', や: 'ヤ', ゆ: 'ユ', よ: 'ヨ', ゃ: 'ャ', ゅ: 'ュ', ょ: 'ョ', ら: 'ラ', り: 'リ', る: 'ル', れ: 'レ', ろ: 'ロ', わ: 'ワ', ゐ: 'ヰ', ゑ: 'ヱ', を: 'ヲ', ん: 'ン', が: 'ガ', ぎ: 'ギ', ぐ: 'グ', げ: 'ゲ', ご: 'ゴ', ざ: 'ザ', じ: 'ジ', ず: 'ズ', ぜ: 'ゼ', ぞ: 'ゾ', だ: 'ダ', ぢ: 'ヂ', づ: 'ヅ', で: 'デ', ど: 'ド', ば: 'バ', び: 'ビ', ぶ: 'ブ', べ: 'ベ', ぼ: 'ボ', ぱ: 'パ', ぴ: 'ピ', ぷ: 'プ', ぺ: 'ペ', ぽ: 'ポ', ぁ: 'ァ', ぃ: 'ィ', ぅ: 'ゥ', ぇ: 'ェ', ぉ: 'ォ', '': 'ー',
};
const katakanaMap = {
  ア: 'あ', イ: 'い', ウ: 'う', エ: 'え', オ: 'お', カ: 'か', キ: 'き', ク: 'く', ケ: 'け', コ: 'こ', サ: 'さ', シ: 'し', ス: 'す', セ: 'せ', ソ: 'そ', タ: 'た', チ: 'ち', ツ: 'つ', ッ: 'っ', テ: 'て', ト: 'と', ナ: 'な', ニ: 'に', ヌ: 'ぬ', ネ: 'ね', ノ: 'の', ハ: 'は', ヒ: 'ひ', フ: 'ふ', ヘ: 'へ', ホ: 'ほ', マ: 'ま', ミ: 'み', ム: 'む', メ: 'め', モ: 'も', ヤ: 'や', ユ: 'ゆ', ヨ: 'よ', ャ: 'ゃ', ュ: 'ゅ', ョ: 'ょ', ラ: 'ら', リ: 'り', ル: 'る', レ: 'れ', ロ: 'ろ', ワ: 'わ', ヰ: 'ゐ', ヱ: 'ゑ', ヲ: 'を', ン: 'ん', ガ: 'が', ギ: 'ぎ', グ: 'ぐ', ゲ: 'げ', ゴ: 'ご', ザ: 'ざ', ジ: 'じ', ズ: 'ず', ゼ: 'ぜ', ゾ: 'ぞ', ダ: 'だ', ヂ: 'ぢ', ヅ: 'づ', デ: 'で', ド: 'ど', バ: 'ば', ビ: 'び', ブ: 'ぶ', ベ: 'べ', ボ: 'ぼ', パ: 'ぱ', ピ: 'ぴ', プ: 'ぷ', ペ: 'ぺ', ポ: 'ぽ', ァ: 'ぁ', ィ: 'ぃ', ゥ: 'ぅ', ェ: 'ぇ', ォ: 'ぉ', ー: '',
};

const frequencyStars = {
  zero: '☆☆☆☆☆',
  one: '★☆☆☆☆',
  two: '★★☆☆☆',
  three: '★★★☆☆',
  four: '★★★★☆',
  five: '★★★★★',
};

function mapToStars(freq) {
  let stars = frequencyStars.zero;
  if (freq < 1501) {
    stars = frequencyStars.five;
  } else if (freq < 5001) {
    stars = frequencyStars.four;
  } else if (freq < 15001) {
    stars = frequencyStars.three;
  } else if (freq < 30001) {
    stars = frequencyStars.two;
  } else if (freq < 60001) {
    stars = frequencyStars.one;
  }
  return stars;
}

function mapStarsToWord() {
  const x = 'かしげる【傾げる】[3]:[3]（他下一）「△首（頭）を―〔＝変だと思って、ちょっと考える〕」';
  // かたぶ・ける [4] 【傾ける】 （動カ下一）[文]カ下二 かたぶ・く〔「かたむける」の古い言い方〕「かたむける」に同じ。「謹んで耳を―・けてゐたが/坑夫（漱石）」
  // "かた・げる【△傾げる】［動ガ下一］かた・ぐ［ガ下二］かたむける。かしげる。「端然と坐って、…小首を―・げていた」〈犀星・性に眼覚める頃〉"
}


function getComponents(freq, input) {
  // TODO move this somewhere shared
  const GD_URI = 'gdlookup://localhost/';

  let shortcut = '';
  let dictEntry = '';
  if (freq.length) {
    shortcut = `| 
      <span class="frequency">${freq.length} 読み方: 
      ${freq[0].stars}: ${freq[0].index}
      </span>`;
    const entriesMarkup = [];
    freq.forEach((entry) => {
      const altString = entry.alt ? ', ' : '';
      const altEl = entry.alt ? `<a href="${GD_URI}${entry.alt}">${entry.alt}</a>` : '';
      const readingEl = entry.reading ? `<a href="${GD_URI}${entry.reading}">${entry.reading}</a>` : '';
      entriesMarkup.push(`<td><ul class="clearfix">
      <li class="clearfix japanese_word">
      <span class="japanese_word__furigana_wrapper">
        <span class="japanese_word__furigana">
        ${readingEl}
        ${altString}
        ${altEl}
        </span>
      </span>
      <span class="japanese_word__text_wrapper">
      <a href="${GD_URI}${entry.word}">${entry.word}</a>
      </span>
      </li></ul></td><td><ul class="clearfix">
      <li class="clearfix japanese_word">
      <span class="japanese_word__furigana_wrapper">
      <span class="japanese_word__furigana">${entry.index}</span>
      </span>
      <span class="japanese_word__text_wrapper">${entry.stars}</span>
      </li>  
      </ul></td>`);
    });
    dictEntry = `
      <table id="freq" class="japanese_gothic focus" lang="ja">
      <tr>${entriesMarkup.join('</tr><tr>')}</tr>
      </table>
      `;
  } else {
    shortcut = '| Not found';

    dictEntry = `
      <div id="freq" class="japanese_gothic focus" lang="ja">
      <div>${input} not found in frequency list</div>
      </div>
      `;
  }
  // console.log(freq)
  return {
    shortcut,
    dictEntry,
    freq,
  };
}

function mapToHiragana(input) {
  return Array.from(input, (char) => {
    if (katakanaMap[char]) {
      return katakanaMap[char];
    }
    return char;
  }).join('');
}


function mapToKatakana(input) {
  return Array.from(input, (char) => {
    if (hiraganaMap[char]) {
      return hiraganaMap[char];
    }
    return char;
  }).join('');
}


// function getFrequency(input) {
//   // do the import in a promise fn so that other work can be done; add 100ms in standard global import scope. Relying on anki being the slow one
//   const freqList = require('./assets/frequencyList.json'); // eslint-disable-line    

//   const katakanaInput = mapToKatakana(input);
//   const list = freqList.reduce((acc, entry, index) => {
//     if (entry[WORD] === input || entry[READING] === katakanaInput) {
//       acc.push({
//         index,
//         stars: mapToStars(index),
//         word: entry[WORD],
//         reading: mapToHiragana(entry[READING]),
//       });
//     }
//     return acc;
//   }, []);

//   return Promise.resolve({
//     list,
//     components: getComponents(list, input),
//   });
// }

function getFrequency(input) {
  // do the import in a promise fn so that other work can be done; add 100ms in standard global import scope. Relying on anki being the slow one
  const freqList = require('./assets/frequencyList.json'); // eslint-disable-line    

  const katakanaInput = mapToKatakana(input);
  const list = freqList.reduce((acc, entry, index) => {
    if (entry[WORD] === input || entry[READING] === katakanaInput || entry[ALT] === input) {
      let alt = '';
      if (entry[ALT] !== entry[WORD]) {
        if (mapToKatakana(entry[ALT]) !== entry[READING]) {
          alt = entry[ALT]; // Alt must be something non-trivial
        }
      }
      const hiraganaInput = mapToHiragana(entry[READING]);
      acc.push({
        index,
        stars: mapToStars(index),
        word: entry[WORD],
        alt,
        katakana: katakanaInput,
        reading: hiraganaInput,
      });
    }
    return acc;
  }, []);

  return Promise.resolve({
    list,
    components: getComponents(list, input),
  });
}

module.exports = {
  getFrequency,
};
