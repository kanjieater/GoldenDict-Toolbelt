# KanjiEater's GoldenDict Japanese Toolbelt

# Table of Contents

* [Download and Setup](#Download-and-Setup)
* [Installation of Tools](#Installation-of-Tools)
* [Zen](#Zen)
* [Images](#images)
* [Anki](#anki) 
* [Frequency](#frequency) 
* [Golden Assets](#golden-assets) 
* [FAQ](#faq)
* [Support](#support)

# Download and Setup
A compatible version of GoldenDict is required. Currently only Windows is *officially* supported, but there is a Mac & Linux versions of GoldenDict. 
The most compatible version is currently `1.5.0-RC2-254-g15062f7` - later versions do exists, but have issues for Japanese (unable to change CSS Font).
## GoldenDict
1. Download `1.5.0-RC2-254-g15062f7` installer from [here](https://sourceforge.net/projects/goldendict/files/early%20access%20builds/GoldenDict-1.5.0-RC2-311-g15062f7-Install.exe/download)
2. Install
3. Start GoldenDict

## Anki
1. Have a 2.1 version of Anki (KanjiEater uses 2.1.22 but any recent version should do)
2. Install the [AnkiConnect Addon](https://foosoft.net/projects/anki-connect/) using code `2055492159`
3. Install the  [KanjiEater's GoldenDict Japanese Toolbelt](https://ankiweb.net/shared/info/247820692) using code `247820692` 
4. You can now move on to installation of Tools!

# Installation of Tools

1. Open `GoldenDict`
2. Go to `Dictionaries` (Hotkey: F3)
3. `Sources` will be open by default with `Files` opened
4. Go to `Programs`
5. Click `Add...` on the right
6. In the column labeled `Enabled` click the checkbox so that it is checked
7. In the column labeled `Type` change the `Type` from `Audio` or whatever the default was to `Html`
8. In the column labeled `Name`, give it the name of the Tool
   * **Important** `golden-assets` must be named `golden-assets`
9. Paste the command line options from one of the sections below and modify as necessary 
10. Click `Groups` in the top row of tabs
11. Add the Tool you just added to `Programs` by finding it, clicking it in the `Dictionaries available`, then while it's selected, click the `>` button in the center
12. Arrange the Tool order as necessary (See [KanjiEater's Recommended Order](#kanjieaters-recommended-order))



# Zen 
## ゼン - Jisho.org

![Zen Tool](https://i.imgur.com/omfDoCH.gif)
#### Description
Jisho's deconjugation & sentence parsing are top notch. It also has wikipedia entries loaded into it. This tool allows you to use the Jisho Zen Bar monolingually - no need to see English definitions if you don't want to (and you can still use JMDict inside GoldenDict if you do)! 

### Command Line
#### Required `input` 
The word or phrase that will be searched on Jisho.org.
##### Acceptable Value
`%GDWORD%` , which GoldenDict knows to replace with whatever was searched in the search bar.

#### Optional `timeout` (Default 4s)
The amount of time to wait on Jisho.org before considering the search a failure. If Jisho is down or having performance issues this will allow the dictionaries below Zen to load after the timeout (rather than waiting forever).
##### Acceptable Value
An integer that represents milliseconds. (So 4000 would be 4 seconds)

#### Example
Requires `input`.

`C:\Users\KanjiEater\AppData\Roaming\Anki2\addons21\goldendict\anki-search-win.exe --input %GDWORD% --timeout 4000`


# Images 
## 画像 - Google Images

![Images Tool](https://i.imgur.com/vHZUuoc.png)
#### Description


### Command Line
#### Required `input` 
The word or phrase that will be searched on Google Images.
##### Acceptable Value
`%GDWORD%` , which GoldenDict knows to replace with whatever was searched in the search bar.

#### Required `lang` 
The amount of time to wait on Jisho.org before considering the search a failure. If Jisho is down or having performance issues this will allow the dictionaries below Zen to load after the timeout (rather than waiting forever).
##### Acceptable Value
A [language code](https://developers.google.com/admin-sdk/directory/v1/languages) as specified by Google Images, like `ja` for Japanese images.

#### Optional `images` (Default 20 images)
The word or phrase that will be searched on Google Images.
##### Acceptable Value
The number of images to show. Maximum of 20.

#### Example
Requires `input` and `lang`.

`C:\Users\KanjiEater\AppData\Roaming\Anki2\addons21\goldendict\goldenimage-win.exe  --input %GDWORD% --lang ja --images 20`


# Anki 
## 暗記 - Anki

![Anki Tool](https://i.imgur.com/iX3VHHO.png)
Coming January 2021

# Frequency 
## Contained in Anki - Netflix Frequency List

![Frequency Tool](https://i.imgur.com/YLaL8un.png)

### Description
Integrated Frequency Stars:
![Frequency Stars](https://i.imgur.com/V1D55BW.png)

Coming January 2021

Everything > 89310 is 1 occurrence


# Golden Assets 
## golden-assets - Word Highlighting & More

### Description

Golden Assets is requirement to ensure all other Tools in the Toolbelt function properly. Behind the scenes it loads standard libraries (JQuery, etc.) to enable more functionality in the Tools.

For the user, it can do the following:

* Highlight the searched word in the search results

* Remove some English entries from dictionaries like Shin Meikai. 

The thought behind removing English entries is that if you want English entries use a J-E dictionary like JMDict, this way you can keep your J-J separate from your J-E dictionaries.

### Command Line
#### `input` 
The word that will be highlighted.
##### Acceptable Value
`%GDWORD%` , which GoldenDict knows to replace with whatever was searched in the search bar.

#### Example
Requires `input`.

`C:\Users\KanjiEater\AppData\Roaming\Anki2\addons21\goldendict\goldenassets-win.exe --input %GDWORD%`





# FAQ

## What Order Should I Put my Dictionaries in?
### KanjiEater's Recommended Order
Numbered entries are hard preferences and bulleted items are optional

1. Zen (ゼン)
2. Images (画像)
3. Shinmeikai (新明解国語辞典　第五版)
4. Daijirin (三省堂　スーパー大辞林)
5. NHK Accent Dict or Anything that will play audio (ＮＨＫ　日本語発音アクセント辞典)
* Daijisen (大辞泉)
* Kanji Etymology (漢字源)
* RTK Style Keywords (漢英字典)
7. JMdict (JMdict)
8. Anki w/ Frequency (暗記)
9. Golden Assets (golden-assets)


### Reasoning for the Order
There are a few things to take into consideration:

* Performance
* Usefulness
* Simplicity

#### Performance
In GoldenDict, the dictionaries load from top to bottom. If a dictionary is slow to loading (but not giving an error), it will block the lower dictionaries from showing potentially. Therefore always put faster Tools at the top and slower tools only on top of content that is worth waiting for.

For example, if your Anki collection is large (like KanjiEaters), you'll want the Anki Tool to be the last `Dictionary` in the `Group`. 

Or alternatively if you are making the monolingual transition, and want to force yourself to wait slightly longer to view English definitions you could put your English Dictionaries below your Anki Tool (though I find that unnecessary).

#### Usefulness

Not all dictionaries are created equal. 

Images are by far the most useful. [Your brain is faster at processing images than text](https://twitter.com/kanjieater/status/1334580183232356352). 

Shinmeikai tends to have very concise definitions with less jargon than others, which is why I recommend people use that as their first J-J dictionary.

Daijirin tends to have more precise definitions but at the cost of being more confusing comparitively. Therefore, I use it as a backup to Shinmeikai.

Anki Tool will be extermely useful to you if you have a sentence bank (like one from subs2srs or premade), as it shows the word in contexts that you have encountered from immersion. 



#### Simplicity

I used to have more than 10 different actual J-J dictionaries in GoldenDict. I think this slowed down my monolingual transition due to the overwhelming amount of content that will load.

Instead, I recommend always referring to Images first for the reasons stated in [Usefulness](####Usefulness). 

If Anki found a result you've learned, then check that, as it should jog your memory. 

Otherwise, read Shinmeikai. 

If you still don't understand you can explore your other dictionaries or do recursive look ups on words you didn't understand in Shinmeikai. 

You can always refer to JMdict for translations of words with one-to-one correlations.

# Support

If you find my tools useful please consider supporting via Patreon. I have spent countless hours to make these useful for not only myself but other's as well and am now offering them completely 100% free.

<a href="https://www.patreon.com/kanjieater" rel="nofollow"><img src="https://i.imgur.com/VCTLqLj.png"></a>

If you can't contribute monetarily please consider following on:

<a href="https://www.youtube.com/channel/UCU1cAd9sJ4HeiBDsjnmifAQ"><img src="https://i.imgur.com/t4wo4SHs.png" title="YouTube" /></a>
<a href="https://twitter.com/kanjieater"><img src="https://i.imgur.com/QvGDFVQs.png" title="twitter" /></a>
<a href="https://www.twitch.tv/kanjieater"><img src="https://i.imgur.com/UKeRp24s.png" title="twitch" /></a>
