
# 🦊 Arbeitszeit Rechner – Firefox Extension

Mit dieser Firefox-Erweiterung kannst du automatisch deine tägliche Arbeitszeit aus SAP-Fiori-Weboberflächen berechnen. Start- und Endzeit sowie Pausen werden ausgelesen und im Popup angezeigt.

---

## 🔧 Installation (Firefox – dauerhaft über signierte .xpi Datei)

### 1. Speicherort

Die aktuelle Version liegt im Ordner:  
`S:\Chrome_extensions\arbeitszeit_extension\arbeitszeit_rechner_firefox`

Dateiname z. B.: `arbeitszeit_rechner_firefox.xpi`

### 2. Installation in Firefox

1. Öffne Firefox
2. Drücke `Strg + O` oder ziehe die `.xpi` Datei direkt in ein Firefox-Fenster
3. Bestätige die Installation im Dialogfeld
4. Wähle oben rechts erweiterungen und Pinne die Extension an

### 3. Nutzung

1. Melde dich bei Fiori an
2. Klicke auf „Tagesdaten erfassen“
3. Füge einen neuen Eintrag hinzu
4. Gib deine Arbeitszeit und deine Pause ein
5. Klicke auf das Erweiterungssymbol in Firefox
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
- Erweiterung bleibt auch nach Neustart erhalten (da signiert)

---

## 🐛 Bugs & Feedback

Issues, Verbesserungsvorschläge oder Fragen gerne über [GitHub Issues](https://github.com/Matthias-Bohn/arbeitszeit_extension/issues)
