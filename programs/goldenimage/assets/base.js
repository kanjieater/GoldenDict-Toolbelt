$(document).ready(function () {
  //
  // $.fn.wrapInTag = function (opts) {
  //   function getText(obj) {
  //     return obj.textContent ? obj.textContent : obj.innerText;
  //   }
  //
  //   var tag = opts.tag || 'strong',
  //     words = opts.words || [],
  //     regex = RegExp(words.join('|'), 'gi'),
  //     replacement = '<' + tag + '>$&</' + tag + '>';
  //
  //   // http://stackoverflow.com/a/298758
  //   $(this).contents().each(function () {
  //     if (this.nodeType === 3) //Node.TEXT_NODE
  //     {
  //       // http://stackoverflow.com/a/7698745
  //       var t = getText(this).replace(regex, replacement);
  //       try{
  //         $(this).replaceWith(t);
  //       }catch(e){
  //         console.error(e);
  //       }
  //     } else if (!opts.ignoreChildNodes) {
  //       $(this).wrapInTag(opts);
  //     }
  //   });
  // };
  //
  // $('.gdarticle:contains("golden-assets")').addClass('hidden');
  //
  // var englishEls = $('.epwing_text:contains("→英和")');
  // englishEls.prev().remove();
  // englishEls.remove();
  //
  // // If you don't deselct the hidden, you'll get the script and break stuff
  // $('.gdarticle:contains(' + window.gdword + ')').not('.hidden').wrapInTag({
  //   words: [window.gdword],
  // });
});
