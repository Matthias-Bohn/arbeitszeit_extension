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
    // Startzeit suchen
    const startInput = document.querySelector('[id*="Begtim"][id$="-inner"]');
    const start = startInput?.value;
    if (!start) throw new Error("Startzeit nicht gefunden");

    // Endzeit suchen
    const endInput = document.querySelector('[id*="Endtim"][id$="-inner"]');
    const end = endInput?.value;
    if (!end) throw new Error("Endzeit nicht gefunden");

    // Pausen sammeln
    const pauseStarts = Array.from(document.querySelectorAll('[id*="breakBegin"][id$="-inner"]'))
      .map(el => el.value)
      .filter(val => val); // nur nicht-leere Werte

    const pauseEnds = Array.from(document.querySelectorAll('[id*="breakEnd"][id$="-inner"]'))
      .map(el => el.value)
      .filter(val => val); // nur nicht-leere Werte

    const total = (parseTime(end) - parseTime(start)) / (1000 * 60 * 60);

    const pause = pauseStarts.reduce((sum, start, index) => {
      const end = pauseEnds[index];
      if (start && end) {
        sum += (parseTime(end) - parseTime(start)) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);

    const workingHours = total - pause;
    const hours = Math.floor(workingHours);
    const minutes = Math.round((workingHours - hours) * 60);

    return `${hours}h:${minutes}min`; 
  } catch (e) {
    return null; 
  }
}

