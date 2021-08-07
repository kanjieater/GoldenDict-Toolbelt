import time
import os

from PyQt5.QtCore import QMimeData
from PyQt5.Qt import QApplication
import aqt, anki
from aqt.utils import showInfo
from functools import partial
from aqt import mw
# from aqt.qt import *
from .global_hotkeys import *

CONFIG = mw.addonManager.getConfig(__name__)
doCrossProfileSearch = CONFIG['crossProfileName']

AUTO_PASTE_FIELDS = {
    "image": CONFIG['image'],
    "audio": CONFIG["audio"],
    "text": CONFIG["text"],
    "vocab": CONFIG["vocab"],
    "definition":CONFIG["definition"]
}
"""
from importlib import reload
gd = __import__('247820692')
reload(gd.goldendict)
gd.goldendict.start()


# from aqt.utils import showCritical
# import traceback
# # showInfo(str(ankiNote))
# d = aqt.dialogs.open('AddCards', self.window())
# dialog.activateWindow()
# try:
    
#     from autobulk import autobulk
#     autobulk.run_images([d.editor.note.id])
# except Exception as e:
#     showCritical(str( traceback.print_exc()))
"""
from aqt.qt import QObject, pyqtSignal



class AutoThread(QObject):

    release = pyqtSignal(dict)

    def __init__(self, mw):
        super(AutoThread, self).__init__(mw)
        GLOBAL_AUTO_COPY = CONFIG['hotkey']
        bindings = [
        [GLOBAL_AUTO_COPY, None, self.on_release],
        ]
        register_hotkeys(bindings)
        start_checking_hotkeys()


    def on_release(self):
        self.release.emit({})
        return True





def runAutoBulk(ankiNote):
    try:
        autobulk = __import__("autobulk")
        autobulk.autobulk.run_add_card_routine([ankiNote.id])
    except:
        pass

def getDialog(openNew=True):
    # for k, d in aqt.DialogManager._dialogs.items():
    #     currDialog = d[1]
    #     if currDialog:
    #         a = 'act' + str(currDialog.windowState() == aqt.qt.Qt.WindowActive)
    #         b = 'no' + str(currDialog.windowState() == aqt.qt.Qt.WindowNoState)
    #         c = 'ful' + str(currDialog.windowState() == aqt.qt.Qt.WindowFullScreen)
    #         dd = 'min' + str(currDialog.windowState() == aqt.qt.Qt.WindowMinimized)
    #         e = 'max' + str(currDialog.windowState() == aqt.qt.Qt.WindowMaximized)
    #         showInfo(f'{k}\n{a}\n{b}\n{c}\n{dd}\n{e}')
    #     if currDialog and currDialog.windowState() == aqt.qt.Qt.WindowActive:
    #         currDialog.activateWindow()
    #         return currDialog


    dialog = aqt.DialogManager._dialogs["EditCurrent"][1]
    # showInfo(str(aqt.DialogManager._dialogs))
    if dialog is None:
        dialog = aqt.DialogManager._dialogs["AddCards"][1]
    if dialog is None:
        dialog = aqt.DialogManager._dialogs["Browser"][1]
    if dialog is None and openNew:
        mw.activateWindow()
        dialog = aqt.dialogs.open('AddCards', mw.window())
    dialog.activateWindow()
    return dialog

def getEditor():
    return getDialog().editor

def getAutoPasteContent(editor, mime):
    html, internal = editor.web._processMime(mime)
    html = editor._pastePreFilter(html, internal)
    return html

def getAutoPasteField(fields, content, mime, noText=True):
    field = None
    if mime.hasImage():
        field = fields['image']
    elif '[sound:' in content:
        field = fields['audio']
    elif not noText and mime.hasText():
        field = fields['text']
    return field

def doAutoPaste(editor, noText=True, isRerun=False):
    if editor.note.id != 0: # editor in add mode
        editor.note.flush()
    mime = editor.mw.app.clipboard().mimeData()
    autoPasteContent = getAutoPasteContent(editor, mime)
    autoPasteField = getAutoPasteField(AUTO_PASTE_FIELDS, autoPasteContent, mime, noText)
    if autoPasteField in editor.note and (autoPasteContent not in editor.note[autoPasteField]):
        editor.loadNote()
        same = getAutoPasteContent(editor, editor.mw.app.clipboard().mimeData()) == autoPasteContent
        if not same:
            if not isRerun:
                doAutoPaste(editor, noText, True)
            return
        editor.note[autoPasteField] += autoPasteContent
        editor.loadNote()

def runSendToAnki(receivedContent):
    if CONFIG['model'] is not None:
        model = mw.col.models.byName(CONFIG['model'])
        if model is None:
            raise Exception('model was not found: {}'.format(CONFIG['model']))

        mw.col.models.setCurrent(model)
        mw.col.models.update(model)


    addCards = None
    receivedFields = receivedContent['fields']
    ankiNote = anki.notes.Note(mw.col, model)
    # showInfo(str(note) + AUTO_PASTE_FIELDS["vocab"])
    if 'fields' in receivedContent:
        dialog = getDialog()
        editor = dialog.editor
        # doAutoPaste(editor)
        fields = [AUTO_PASTE_FIELDS['vocab'], AUTO_PASTE_FIELDS['definition']]
        for fieldName in fields:
            existingValue = editor.note[fieldName]
            if fieldName in ankiNote:
                if fieldName == AUTO_PASTE_FIELDS["vocab"]:
                    # Don't Copy Vocab Again
                    if not existingValue:
                        editor.note[fieldName] = receivedFields['vocab']
                else:
                    if receivedFields['definition'] not in existingValue:
                        if existingValue:
                            editor.note[fieldName] += '<br/><br/>'+receivedFields['definition']
                        else:
                            editor.note[fieldName] = receivedFields['definition']
        editor.loadNote()
        # doAutoPaste(editor)
        dialog.activateWindow()

def autoPasteListener(receivedContent):
    noText = False
    if receivedContent:
        runSendToAnki(receivedContent)
        noText = True
    d = getDialog()
    # showInfo('listener')

    if d:
        doAutoPaste(d.editor, noText)

def focusWindowChangedListener(focuWindow):
    showInfo('here')
    showInfo(str(focuWindow))


def start():
    try:
        ac = __import__('2055492159')
    except:
        raise Exception('Failed to import AnkiConnect module')

    @ac.util.api()
    def copyToClipboard(self, text):
        clipboard = QApplication.clipboard()
        clipboard.clear()
        reportRichTextMime = QMimeData()
        reportRichTextMime.setHtml(text)
        reportRichTextMime.setText(text)
        clipboard.setMimeData(reportRichTextMime)
        if clipboard.text():
            return True
        else:
            return False

    @ac.util.api()
    def sendToAnki(self, note={}):
        mw.gdThread.release.emit(note)
        return 0

    @ac.util.api()
    def _searchCollection(self, query, desiredFields, collection=None):
        cards = collection.findCards(query)
        result = []
        suspended = []
        new = []
        scheduler = self.scheduler()
        for cid in cards:
            # try:
            card = collection.getCard(cid)
            model = card.model()
            note = card.note()
            fields = {}
            for info in model['flds']:
                order = info['ord']
                name = info['name']
                if name in desiredFields:
                    fields[name] = {'value': note.fields[order], 'order': order}

            entry = {
                'cardId': card.id,
                'fields': fields,
                'fieldOrder': card.ord,
                # 'question': util.getQuestion(card),
                # 'answer': util.getAnswer(card),
                'modelName': model['name'],
                'ord': card.ord,
                'deckName': collection.decks.get(card.did)['name'],
                # 'css': model['css'],
                'factor': card.factor,
                # This factor is 10 times the ease percentage,
                # so an ease of 310% would be reported as 3100
                'interval': card.ivl,
                'note': card.nid,
                'type': card.type,
                'queue': card.queue,
                'due': card.due,
                'reps': card.reps,
                'lapses': card.lapses,
                'left': card.left,
            }

            dueDate = "N/A"
            if card.queue <= 0:
                dueDate = card.due
            else:
                dueDate = time.time() + ((card.due - scheduler.today) * 86400)
                try:
                    dueDate = time.strftime("%Y-%m-%d", time.localtime(dueDate))
                except:
                    pass
            if card.queue < 0:
                dueDate = f'({dueDate})'
            entry['dueDate'] = dueDate

            if card.queue < 0:
                suspended.append(entry)
            elif card.queue == 0:
                new.append(entry)
            else:
                result.append(entry)

            # except TypeError as e:
            #     # Anki will give a TypeError if the card ID does not exist.
            #     # Best behavior is probably to add an 'empty card' to the
            #     # returned result, so that the items of the input and return
            #     # lists correspond.
            #     result.append({})
        # return result
        # return sorted(result, key=lambda k: (k['reps'], k['due']), reverse=False)
        result = sorted(result, key=lambda k: (k['reps'], k['due']), reverse=True)
        suspended = sorted(suspended, key=lambda k: (k['queue'], k['due']), reverse=False)
        new = sorted(new, key=lambda k: (k['queue'], k['due']), reverse=False)
        return result + new + suspended


    @ac.util.api()
    def collection(self, pickCrossProfile=False):
        """
        Override the default collection method from AnkiConnect
        This method dynamically returns either the default/current window profile collection
        Or the cross-profile collection if there was any profile specified inside config.json
        """
        if pickCrossProfile:
            crossCollectionFilename = os.path.join(mw.pm.base, CONFIG['crossProfileName'], 'collection.anki2')
            crossCollection = anki.Collection(crossCollectionFilename)
            return crossCollection
        else:
            # copied from foosoft's AnkiConnect code
            collection = self.window().col
            if collection is None:
                raise Exception('collection is not available')

            return collection


    @ac.util.api()
    def goldenCardsInfo(self, query, desiredFields):

        result = _searchCollection(self, query, desiredFields, collection=collection(self, pickCrossProfile=False))

        crossResult = []
        if doCrossProfileSearch:
            crossResult = _searchCollection(self, query, desiredFields, collection=collection(self, pickCrossProfile=True))

        return result + crossResult


    ac.AnkiConnect.copyToClipboard = copyToClipboard
    ac.AnkiConnect.sendToAnki = sendToAnki
    ac.AnkiConnect.goldenCardsInfo = goldenCardsInfo


def initGlobalHotkeys():
    mw.gdThread = AutoThread(mw)
    mw.gdThread.release.connect(autoPasteListener)
