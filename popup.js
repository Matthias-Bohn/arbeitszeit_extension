// wird sofort ausgeführt
window.onload = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: calculateWorkingTime
    }, ([result]) => {
      const output = result && result.result
        ? `${result.result}`
        : `Konnte Arbeitszeit nicht berechnen`;
      document.getElementById('result').innerHTML = output;
    });
  });
};

function calculateWorkingTime() {
  function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes);
  }

  try {
    // Arbeitszeit sammeln
    const workStarts = Array.from(document.querySelectorAll('[id*="Begtim"][id$="-inner"]'))
      .map(el => el.value)
      .filter(val => val); // nur nicht-leere Werte

    const workEnds = Array.from(document.querySelectorAll('[id*="Endtim"][id$="-inner"]'))
      .map(el => el.value)
      .filter(val => val); // nur nicht-leere Werte

    // Pausen sammeln
    const pauseStarts = Array.from(document.querySelectorAll('[id*="breakBegin"][id$="-inner"]'))
      .map(el => el.value)
      .filter(val => val); // nur nicht-leere Werte

    const pauseEnds = Array.from(document.querySelectorAll('[id*="breakEnd"][id$="-inner"]'))
      .map(el => el.value)
      .filter(val => val); // nur nicht-leere Werte

    const work = workStarts.reduce((sum, start, index) => {
      const end = workEnds[index];
      if (start && end) {
        sum += (parseTime(end) - parseTime(start)) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);

    const pause = pauseStarts.reduce((sum, start, index) => {
      const end = pauseEnds[index];
      if (start && end) {
        sum += (parseTime(end) - parseTime(start)) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);

    // aktuelle Uhrzeit hh:mm
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // berrechne Arbeitszeit bis zur aktuellen Uhrzeit
    const currentWork = workStarts.reduce((sum, start, index) => {
      const startTime = parseTime(start);
      const current = parseTime(currentTime);
      const end = workEnds[index];
      const endTime = parseTime(end);
    
      if (startTime >= current) {
        // Start liegt in der Zukunft – nichts zählen
        return sum;
      }
    
      if (startTime < current && endTime < current && index < workEnds.length-1) {
        console.log(`Berechnung: Vollständige Arbeitszeit von ${start} bis ${end}`);
        sum += (endTime - startTime) / (1000 * 60 * 60);
      } else if (startTime < current && endTime < current) {
        console.log(`Berechnung: Arbeitszeit von ${start} bis ${currentTime} (Endzeit liegt vor aktueller Zeit)`);
        sum += (current - startTime) / (1000 * 60 * 60);
      } else if (startTime < current && endTime >= current) {
        console.log(`Berechnung: Arbeitszeit von ${start} bis ${currentTime} (Endzeit liegt in der Zukunft)`);
        sum += (current - startTime) / (1000 * 60 * 60);
      }

      return sum;
    }, 0);

    console.log(`current work: ${currentWork}`);

    let workingHours = (work - pause);
    workingHours = workingHours.toFixed(2); // auf 2 Dezimalstellen runden
    const hours = Math.floor(workingHours);
    const minutes = Math.round((workingHours - hours) * 60);

    let currentWorkingHours = currentWork - pause;
    currentWorkingHours = currentWorkingHours.toFixed(2); // auf 2 Dezimalstellen runden
    const currentHours = Math.floor(currentWorkingHours);
    const currentMinutes = Math.round((currentWorkingHours - currentHours) * 60);

    return `Eingetragene Arbeitzeit: ${hours}h:${minutes}min <br> Aktuelle Arbeitszeit: ${currentHours}h:${currentMinutes}min`;
  } catch (e) {
    console.error(e);
    return null;
  }
}

