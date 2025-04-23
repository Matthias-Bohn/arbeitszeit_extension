// wird sofort ausgeführt
window.onload = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: calculateWorkingTime
    }, ([result]) => {
      const output = result && result.result
        ? `Arbeitszeit heute: ${result.result}`
        : `Konnte Arbeitszeit nicht berechnen`;
      document.getElementById('result').textContent = output;
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

    let workingHours = (work - pause);
    workingHours = workingHours.toFixed(2); // auf 2 Dezimalstellen runden
    const hours = Math.floor(workingHours);
    const minutes = Math.round((workingHours - hours) * 60);

    return `${hours}h:${minutes}min`; 
  } catch (e) {
    console.error(e);
    return null; 
  }
}

