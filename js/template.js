// template.js

// Utility: format date into "D MMM YYYY (Day)" e.g. "3 Feb 2026 (Tue)"
function formatDate(dateStr) {
  const options = { day: "numeric", month: "short", year: "numeric", weekday: "short" };
  return new Date(dateStr).toLocaleDateString("en-SG", options);
}

// Utility: get correct notice card depending on current date
function getNoticeCard(start, end, displayPeriod) {
  const today = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (today < startDate) {
    return `
      <div class="notice-card upcoming">
        <p>Applications have not opened yet.</p>
        <p>The application period will be from <strong>${displayPeriod}</strong>.</p>
      </div>
    `;
  }

  if (today >= startDate && today <= endDate) {
    return `
      <div class="notice-card open">
        <p>Applications are currently open!</p>
        <p>Application Period: <strong>${displayPeriod}</strong></p>
      </div>
    `;
  }

  return `
    <div class="notice-card closed">
      <p>The application period is over.</p>
    </div>
  `;
}

// Local qualifications template
function localQualificationTemplate(qualification) {
  return `
    <div class="qualification-card">
      <h2>${qualification.name}</h2>
      ${getNoticeCard(
        qualification.timeline.start,
        qualification.timeline.end,
        qualification.displayPeriod
      )}
    </div>
  `;
}

// International qualifications template
function internationalQualificationTemplate(qualification) {
  return `
    <div class="qualification-card">
      <h2>${qualification.name}</h2>
      ${getNoticeCard(
        qualification.timeline.start,
        qualification.timeline.end,
        qualification.displayPeriod
      )}
    </div>
  `;
}

// Transfer qualifications template (handles multiple semesters)
function transferQualificationTemplate(qualification) {
  const today = new Date();
  let notice = "";

  for (const sem of qualification.timeline.semesters) {
    const startDate = new Date(sem.start);
    const endDate = new Date(sem.end);

    if (today >= startDate && today <= endDate) {
      notice = getNoticeCard(sem.start, sem.end, sem.displayPeriod);
      break;
    }
  }

  if (!notice) {
    // No current open period, check if future or already closed
    const firstSem = qualification.timeline.semesters[0];
    const lastSem = qualification.timeline.semesters[qualification.timeline.semesters.length - 1];

    if (today < new Date(firstSem.start)) {
      notice = `
        <div class="notice-card upcoming">
          <p>Applications for transfer have not opened yet.</p>
        </div>
      `;
    } else if (today > new Date(lastSem.end)) {
      notice = `
        <div class="notice-card closed">
          <p>The application period for transfer is over.</p>
        </div>
      `;
    }
  }

  return `
    <div class="qualification-card">
      <h2>${qualification.name}</h2>
      ${notice}
    </div>
  `;
}
