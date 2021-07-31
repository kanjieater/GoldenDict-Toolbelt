from aqt import mw
from aqt.qt import qconnect, QAction
from aqt.utils import showInfo
from anki.hooks import addHook
from importlib import reload


# 


# def mainListener():
#     from . import goldendict
#     reload(goldendict)
#     goldendict.autoPasteListener()

def main():
    from . import goldendict
    reload(goldendict)
    goldendict.initGlobalHotkeys()
    goldendict.start()


 

# listener = GlobalHotKeys({ROUTE_1_KEY: autoPasteListener})
# listener.start()

# addHook("setupEditorShortcuts", setupHotkey)
addHook('profileLoaded', main)

action = QAction('Debug GoldenDict...', mw)
action.setShortcut("Ctrl+I")
action.triggered.connect(main)