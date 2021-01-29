# KanjiEater's GoldenDict Japanese Toolbelt

# Check out the instruction video here: [KanjiEater's Golden Toolbelt Guide](https://www.youtube.com/watch?v=5FAgFC9NYAo)

# Table of Contents

* [Download and Setup](#Download-and-Setup)
* [Installation of Tools](#Installation-of-Tools)
* [Zen](#Zen)
* [Images](#images)
* [Anki](#anki) 
* [Send to Anki](#Send-to-Anki) 
* [Frequency](#frequency) 
* [Golden Assets](#golden-assets) 
* [FAQ](#faq)
* [Support](#support)



# Download and Setup
A compatible version of GoldenDict is required. Currently only Windows (x64) is *officially* supported, but there is a Mac & Linux versions of GoldenDict. 
The most compatible version is currently `1.5.0-RC2-254-g15062f7` - later versions do exists, but have issues for Japanese (unable to change CSS Font).

## Anki
Anki is used to keep the Tools up to date as well as enable additional Tool functionallity.

1. Have a 2.1 version of Anki (KanjiEater uses 2.1.35, and future versions should be supported automatically for most features)
2. Install the [AnkiConnect Addon](https://foosoft.net/projects/anki-connect/) using code `2055492159`
3. Install the  [KanjiEater's GoldenDict Japanese Toolbelt](https://ankiweb.net/shared/info/247820692) using code `247820692` 
4. You can move onto the [GoldenDict setup](##GoldenDict)

## GoldenDict
1. Download `1.5.0-RC2-254-g15062f7` installer from [here](https://sourceforge.net/projects/goldendict/files/early%20access%20builds/GoldenDict-1.5.0-RC2-311-g15062f7-Install.exe/download)
2. Install

## Apply the GoldenDict Theme
These instructions will allow you to install `darkmode` which is the only currently supported theme for the Toolbelt. You can also additionally reference themes in GoldenDict [here](https://github.com/goldendict/goldendict/wiki/GoldenDict-Dark-Theme).

1. Start GoldenDict (this will create app folders on your computer automatically)
2. Go to your GoldenDict Anki add-on folder (`%AppData%\Anki2\addons21\247820692`)
3. Install the font, `HiraKakuProN-W2-AlphaNum-02.otf`, by double clicking on it, then clicking install (This is the font that the GoldenDict theme will refer to - if you know CSS you can replace it in the css file of the next step)
4. Go back to the `%AppData%\Anki2\addons21\247820692` folder
5. Copy the `styles` directory
6. Go to the GoldenDict app folder `%AppData%\GoldenDict`
7. Paste the `styles` directory to this folder
8. Go into `%AppData%\GoldenDict\styles\darkmode`, which will contain your css. You can modifiy the css file here to change the theme's style manually with this file 
9. Got to `%AppData%\Anki2\addons21\247820692\assets\fonts`
10. Install the font HiraKakuProN-W2-AlphaNum-02.otf by double clicking it, then clicking Install. This will be the font used by GoldenDict's theme
11. Open Preferences inside of GoldenDict (`Hotkey: F4`)
12. Select darkmode from the dropdown
13. Restart GoldenDict and you should see your theme applied (this is the only theme compatible with the Toolbelt currently)
14. Now that you've started it once, exit out of GoldenDict
15. You can now move on to installation of Tools!

PRO TIP: Pressing `Alt` and `+` will make your search bar bigger

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

`C:\Users\KanjiEater\AppData\Roaming\Anki2\addons21\247820692\anki-search-win.exe --input %GDWORD% --timeout 4000`


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

`C:\Users\KanjiEater\AppData\Roaming\Anki2\addons21\247820692\goldenimage-win.exe  --input %GDWORD% --lang ja --images 20`


# Anki 
## 暗記 - Anki

![Anki Tool](https://i.imgur.com/iX3VHHO.png)
#### Description
Not Currently Released. Will be released in January 2021

### Command Line
#### Required `input` 
The word or phrase that will be searched on Google Images.
##### Acceptable Value
`%GDWORD%` , which GoldenDict knows to replace with whatever was searched in the search bar.

#### Required `ankimedia` 
The path to your media folder.


At the beginning, put  `file:///` on windows (may differ on other OS waiting on others to confirm)

Then put your full path:
`C:/Users/KanjiEater/AppData/Roaming/Anki2/SomeProfile/collection.media/`

There's a trailing slash at the end `collection.media/` to indicate a folder

Finally surround it by quotes as seen in the Example value.

##### Example Value
`--ankimedia 'file:///C:/Users/KanjiEater/AppData/Roaming/Anki2/SomeProfile/collection.media/'`

#### Required `fields` (Defaults to 'dueDate')

##### Acceptable Value
Each field must be separated by a space.
#### Special Fields

`Image`

Image is the only field that can display images. Please rename your note's Snapshot or other field containing images to `Image`. It can contain multiple images, which will be shown, but no other field currently supports images being displayed.


#### Custom Note Type Fields
Can be anything that doesn't conflict with Card Fields.

Examples: `Expression`, `Vocab`, `Image`

#### Card Fields
   
   Examples:
   `modelName`, `deckName`, `dueDate`

   Here are some examples of the data that AnkiConnect returns:
```
   "fieldOrder": 0,

   "modelName": "Japanese",

   "ord": 0,

   "deckName": "Shingeki no Kyojin S3",

   "factor": 2500,

   "interval": 7,

   "note": 1598391871574,

   "type": 2,

   "queue": 2,

   "due": 1252,

   "dueDate": "2021-01-07",

   "reps": 18,

   "lapses": 2,

   "left": 1001
```
### Example
`--fields dueDate Image Vocab Expression deckName`


#### Required `search` 
The amount of time to wait on Jisho.org before considering the search a failure. If Jisho is down or having performance issues this will allow the dictionaries below Zen to load after the timeout (rather than waiting forever).
##### Acceptable Value
A valid search in the Anki's search. You should try out your search beforehand to make sure the unique syntax of Anki works in Anki itself before trying it through GoldenDict. 
[Anki Manual: Searching](https://docs.ankiweb.net/#/searching)

Make sure to only use single quotes not double quotes inside the query.

Yes: `deck:'someDeckName'`

No: `deck:"someDeckName"`

Make sure to wrap the entire query in double quotes so it can be picked up as a single argument by the Tool as a command line argument.

Yes: `--search "deck:'someDeckName'"`

No: `--search deck:'someDeckName'`

#### `--search` Example
**Important: %GDWORD% gets magically turned into whatever you search inside of GoldenDict's search bar.** 

This example searches only someDeckName for the search phrase inside of a Vocab field or Expression field in Anki.

`--search "deck:'someDeckName' Vocab:*%GDWORD%* OR Expression:*%GDWORD%*"`

#### Optional `timeout` (Default 4s)
The amount of time to wait on Anki's initial search. Full rendering time might still take longer than 4000ms, and not fail.

##### Acceptable Value
An integer that represents milliseconds. (So 4000 would be 4 seconds)

#### Optional `ankiconnect` (Defaults to AnkiConnect's default `http://localhost:8765`)

##### Acceptable Value
A full URI to the AnkiConnect server. This only needs to be changed if your AnkiConnect configuration has been modified.

`http://localhost:8765` or any valid URI.

#### Optional `max` (Default `1000`)

##### Acceptable Value
Any number. If there are more than this number, you won't know. This number cuts off the search early, which is useful if you search something fundamental like `あ` or `a` which might exist in every one of your cards. You can set it to `1000000` if you like, but it'd be slower to render on big searches. Normal searches (with less than 1000 results wouldn't be affected by this input parameter)


#### Example
Take a deep breath on this one. There's a lot that can go wrong here. Test your anki media path first (Can you copy the the C:/ path into Windows file browser and get to your media?). Test your anki search (Does anki return search results if your replace %GDWORD% with an actual word you want to search?)

Requires `input`, `ankimedia`, `search`, `fields`.

`C:\Users\KanjiEater\AppData\Roaming\Anki2\addons21\247820692\anki-search-win.exe --input %GDWORD% --ankimedia 'file:///C:/Users/KanjiEater/AppData/Roaming/Anki2/KanjiEater/collection.media/' --search "deck:'!優先' Vocab:*%GDWORD%* OR Expression:*%GDWORD%*" --fields dueDate Image Vocab Expression deckName`

# Send To Anki
## Contained in Anki Tool of this Toolbelt - A button to copy definitions, vocab, and content from the users clipboard (Images, Audio, and Sentences)

Configuration for this is in the Anki Addon configuration inside of Anki itself.

`vocab` is the field to put the word that was searched for in GoldenDict

`definition` is the name of the field in which to put definition of the vocab

`hotkey` is the hotkey that will automatically copy content from the clipboard to the corresponding field based on what type the content is. Currently text, audio, and images can be automatically recognized and pasted into the matching field. The supported keys and their names are listed [here](https://pypi.org/project/global-hotkeys/). Only windows supports the hotkey feature currently.

`model` the Anki Note Model to default to using when copying the content 

`image` is the field where Images in the clipboard will be copied automatically when the hotkey is pressed.

`audio` is the field where Audio in the clipboard will be copied automatically when the hotkey is pressed.

`text` is the field where text in the clipboard will be copied automatically when the hotkey is pressed. It is typically the sentence or Expression field that contains a full phrase


# Frequency 
## Contained in Anki - Netflix Frequency List

![Frequency Tool](https://i.imgur.com/YLaL8un.png)

### Description
Integrated Frequency Stars:
![Frequency Stars](https://i.imgur.com/V1D55BW.png)

The frequency list is contained withing the anki-search file and cannot be edited currently. It contains the frequency list from [here](https://www.youtube.com/watch?v=DwJWld8hW0M&feature=youtu.be). One thing worth noting is that everything above 89310 only occured once in all of the Netflix content that this list was generated off of, so so there is no difference in frequency above 89310. By setting up the Anki section above, this feature is automatically enabled.


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

`C:\Users\KanjiEater\AppData\Roaming\Anki2\addons21\247820692\goldenassets-win.exe --input %GDWORD%`





# FAQ

## What Order Should I Put my Dictionaries in?
### KanjiEater's Recommended Order

KanjiEater's Actual Setup

<a href="https://imgur.com/rb3iBj7"><img src="https://i.imgur.com/rb3iBj7.png" title="source: imgur.com" /></a>

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
