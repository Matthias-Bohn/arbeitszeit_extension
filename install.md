# 🕒 Arbeitszeit Rechner – Chrome Extension

Mit dieser Chrome-Erweiterung kannst du automatisch deine tägliche Arbeitszeit aus SAP-Fiori-Weboberflächen berechnen. Start- und Endzeit sowie Pausen werden ausgelesen und im Popup angezeigt.

---

## 🔧 Installation

### 1. Projekt herunterladen

Lade den kompletten Code (inkl. `manifest.json`, `popup.html`, `popup.js` und `logo.png`) in einen lokalen Ordner.

### 2. Entwicklermodus in Chrome aktivieren

1. Öffne `chrome://extensions/`
2. Aktiviere oben rechts den **Entwicklermodus**

### 3. Erweiterung laden

1. Klicke auf **Entpackte Erweiterung laden**
2. Wähle den Ordner mit deinen Dateien

### 4. Nutzung

1. Melde dich bei Fiori an
2. Clicke auf Tagesdaten erfassen
3. Füge einen neuen Eintrag hinzu
4. Gebe deine Arbeitszeit und deine Pause ein
5. Klicke auf das Erweiterungssymbol in Chrome
6. Deine Arbeitszeit erscheint im Popup

---

## 🧠 Funktionsweise

- Felder: `Begtim`, `Endtim`, `breakBegin`, `breakEnd`
- Berechnet Netto-Arbeitszeit (ohne Pausen)
- Anzeige im Format `Xh:Ymin`

---

## ⚠️ Hinweise

- Funktioniert nur auf SAP-Fiori-Systemen mit diesen IDs
- Keine Speicherung oder Übertragung von Daten
