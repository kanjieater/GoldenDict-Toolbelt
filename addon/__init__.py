import time

from anki.hooks import addHook
from PyQt5.QtCore import QMimeData
from PyQt5.Qt import QApplication


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
    def goldenCardsInfo(self, cards):
        result = []
        scheduler = self.scheduler()
        for cid in cards:
            # try:
            card = self.collection().getCard(cid)
            model = card.model()
            note = card.note()
            fields = {}
            for info in model['flds']:
                order = info['ord']
                name = info['name']
                fields[name] = {'value': note.fields[order], 'order': order}
            
        
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

            result.append({
                'cardId': card.id,
                'fields': fields,
                'fieldOrder': card.ord,
                # 'question': util.getQuestion(card),
                # 'answer': util.getAnswer(card),
                'modelName': model['name'],
                'ord': card.ord,
                'deckName': self.deckNameFromId(card.did),
                # 'css': model['css'],
                'factor': card.factor,
                #This factor is 10 times the ease percentage,
                # so an ease of 310% would be reported as 3100
                'interval': card.ivl,
                'note': card.nid,
                'type': card.type,
                'queue': card.queue,
                'due': card.due,
                'dueDate': dueDate,
                'reps': card.reps,
                'lapses': card.lapses,
                'left': card.left,
            })
            # except TypeError as e:
            #     # Anki will give a TypeError if the card ID does not exist.
            #     # Best behavior is probably to add an 'empty card' to the
            #     # returned result, so that the items of the input and return
            #     # lists correspond.
            #     result.append({})
        # return result
        return sorted(result, key=lambda k: (k['queue'], k['due']), reverse=True) 

    ac.AnkiConnect.copyToClipboard = copyToClipboard
    ac.AnkiConnect.goldenCardsInfo = goldenCardsInfo

# from importlib import reload
# gd = __import__('goldendict')
# reload(gd)

addHook('profileLoaded', start)