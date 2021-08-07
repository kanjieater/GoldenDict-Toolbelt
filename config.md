Detailed explanation of setup can be found [here](https://github.com/kanjieater/GoldenDict-Toolbelt)


`vocab` is the field to put the word that was searched for in GoldenDict

`definition` is the name of the field in which to put definition of the vocab

`hotkey` is the hotkey that will automatically copy content from the clipboard to the corresponding field based on what type the content is. Currently text, audio, and images can be automatically recognized and pasted into the matching field. The supported keys and their names are listed [here](https://pypi.org/project/global-hotkeys/). Only windows supports the hotkey feature currently.



`model` the Anki Note Model to default to using when copying the content 

`image` is the field where Images in the clipboard will be copied automatically when the hotkey is pressed.

`audio` is the field where Audio in the clipboard will be copied automatically when the hotkey is pressed.

`text` is the field where text in the clipboard will be copied automatically when the hotkey is pressed. It is typically the sentence or Expression field that contains a full phrase

`crossProfileName` is the field where you can type in the name of your cross-profile sentence bank (Default value: "") | Sentence banks are basically huge databases of Anki Decks (usually subs2srs decks) that are separated from your main profile to save space
