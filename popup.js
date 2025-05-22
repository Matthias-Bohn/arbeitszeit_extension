const calculateWorkingTime = () => {

  // cleers the console
  console.clear();
  //console.info Informationen zur extension version
  console.info("Version: 1.3");
  console.info("Erstellt von: Matthias Bohn");
  console.info("Datum: 22.05.2025");
  console.info("-------------------------------");
  console.info("Starte Berechnung der Arbeitszeit...");

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes);
  };

  const getCurrentWorkingTime = (workStarts, workEnds, pauseStarts, pauseEnds) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    console.log(`Aktuelle Uhrzeit: ${currentTime}`);
  
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return new Date(0, 0, 0, hours, minutes);
    };
  
    const totalWork = workStarts.reduce((sum, start, index) => {
      const startTime = parseTime(start);
      const current = parseTime(currentTime);
      const endTime = parseTime(workEnds[index]);
  
      if (startTime >= current) {
        console.log(`Ignoriert: Arbeitsbeginn ${start} liegt in der Zukunft`);
        return sum;
      }
  
      let h = 0;
      if (startTime < current && endTime < current) {
        h = (endTime - startTime) / (1000 * 60 * 60);
      } else if (startTime < current && endTime >= current) {
        h = (current - startTime) / (1000 * 60 * 60);
      }
  
      if (h > 0) {
        console.log(`Berechne Teilzeit: ${start} bis ${endTime < current ? workEnds[index] : currentTime} = ${h.toFixed(2)}h`);
      }
  
      return sum + h;
    }, 0);
  
    // Jetzt: Pausenzeit abziehen, aber nur, wenn Pause schon begonnen hat
    let totalPauseDuringWork = pauseStarts.reduce((totalPause, pauseStart, index) => {
      const pauseStartTime = parseTime(pauseStart);
      const pauseEndTime = parseTime(pauseEnds[index]);
      const currentTimeParsed = parseTime(currentTime);
    
      if (currentTimeParsed >= pauseStartTime) {
      let pauseDuration;
      if (currentTimeParsed >= pauseEndTime) {
        pauseDuration = (pauseEndTime - pauseStartTime) / (1000 * 60 * 60);
      } else {
        pauseDuration = (currentTimeParsed - pauseStartTime) / (1000 * 60 * 60);
      }
      console.log(`Abziehe Pause: ${pauseStart} bis ${currentTimeParsed < pauseEndTime ? currentTime : pauseEnds[index]} = ${pauseDuration.toFixed(2)}h`);
      return totalPause + pauseDuration;
      } else {
      console.log(`Pause ${pauseStart} liegt in der Zukunft, wird nicht abgezogen.`);
      return totalPause;
      }
    }, 0);
  
    const final = (totalWork - totalPauseDuringWork).toFixed(2);
    console.log(`Arbeitszeit bis jetzt (inkl. Pausenabzug): ${final}h`);
    return final;
  };

  const matchDate = (date1, date2) => {
    
    const [day, month, year] = date1.split('.').map(Number);
    const d1 = new Date(year, month - 1, day); // Achtung: Monat = 0-basiert

    const d2 = new Date(date2); // ISO/JS-kompatibles Datum, z. B. "Thu May 22 2025 08:45:32 GMT+0200"

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };


  try {
    const workStarts = Array.from(document.querySelectorAll('[id*="Begtim"][id$="-inner"]')).map(el => el.value).filter(Boolean);
    const workEnds = Array.from(document.querySelectorAll('[id*="Endtim"][id$="-inner"]')).map(el => el.value).filter(Boolean);
    const pauseStarts = Array.from(document.querySelectorAll('[id*="breakBegin"][id$="-inner"]')).map(el => el.value).filter(Boolean);
    const pauseEnds = Array.from(document.querySelectorAll('[id*="breakEnd"][id$="-inner"]')).map(el => el.value).filter(Boolean);
    const datum = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'Datum:').parentElement.nextSibling.children[0].children[0].textContent;
    const actualDate = new Date();

    console.log(`Gefundene Arbeitszeiten: Starts=${JSON.stringify(workStarts)}, Ends=${JSON.stringify(workEnds)}`);
    console.log(`Gefundene Pausen: Starts=${JSON.stringify(pauseStarts)}, Ends=${JSON.stringify(pauseEnds)}`);

    const work = workStarts.reduce((sum, start, index) => {
      const end = workEnds[index];
      if (start && end) {
        const duration = (parseTime(end) - parseTime(start)) / (1000 * 60 * 60);
        sum += duration;
      }
      return sum;
    }, 0);

    const pause = pauseStarts.reduce((sum, start, index) => {
      const end = pauseEnds[index];
      if (start && end) {
        const duration = (parseTime(end) - parseTime(start)) / (1000 * 60 * 60);
        sum += duration;
      }
      return sum;
    }, 0);

    console.log(`Gesamte Arbeitszeit (ohne Pause): ${work.toFixed(2)}h`);
    console.log(`Gesamte Pausenzeit: ${pause.toFixed(2)}h`);

    const workingHours = (work - pause).toFixed(2);
    const hours = Math.floor(workingHours);
    const minutes = Math.round((workingHours - hours) * 60);

    const currentWorkingTime = getCurrentWorkingTime(workStarts, workEnds, pauseStarts, pauseEnds);

    const currentHours = Math.floor(currentWorkingTime);
    const currentMinutes = Math.round((currentWorkingTime - currentHours) * 60);

    console.log(`Endgültige Berechnung:`);
    console.log(`- Eingetragene Arbeitszeit: ${hours}h ${minutes}min`);
    console.log(`- Aktuelle Arbeitszeit: ${currentHours}h ${currentMinutes}min`);

    
    console.log(matchDate(datum, actualDate) ? "Datum stimmt überein" : "Datum stimmt nicht überein");
    const returnMessage = matchDate(datum, actualDate)
      ? `Eingetragene Arbeitszeit: ${hours}h:${minutes}min <br> Aktuelle Arbeitszeit: ${currentHours}h:${currentMinutes}min`
      : `Eingetragene Arbeitszeit: ${hours}h:${minutes}min`;

    return returnMessage;
  } catch (e) {
    console.error("Fehler bei der Berechnung:", e);
    return null;
  }
};


// Wird beim Laden der Seite ausgeführt
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
