// template.js
// General templates for transfer, local, and international qualifications.
// All visual styles are handled by styles.css. Resource lists are injected as HTML.

export function formatTimeline(timeline) {
  if (!timeline || !timeline.start || !timeline.end) return "";
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const start = new Date(timeline.start).toLocaleDateString(undefined, options);
  const end = new Date(timeline.end).toLocaleDateString(undefined, options);
  return `${start} to ${end}`;
}

// Renders a generic resource list (array of {label, url, note?})
export function renderResourceList(resources) {
  if (!resources || !resources.length) return "";
  return `
    <ul class="resource-list">
      ${resources
        .map(
          (r) =>
            `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.label}</a>${r.note ? ` ${r.note}` : ""}</li>`
        )
        .join("\n")}
    </ul>
  `;
}

// Local/Transfer login section (with optional MTL line)
export function loginSection({ qualificationName, mtlUrl }) {
  return `
    <hr class="section-divider" />
    <h2 class="info-heading"><span class="heading-icon">🖥️</span> <u><strong>Singapore Citizen / Singapore Permanent Resident / FIN Holders</strong></u></h2>
    <p>
      Please log in to the <a href="https://myaces.nus.edu.sg/applicantPortal/app/login" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
      with your <a href="https://portal.singpass.gov.sg/home/ui/support" target="_blank" rel="noopener noreferrer">Singpass</a>
      to proceed with your application using the ${qualificationName}.
    </p>
    ${mtlUrl ? `<p>📌 Please check if you fulfil the <a href="${mtlUrl}" target="_blank" rel="noopener noreferrer">Mother Tongue Language (MTL) requirements</a>.</p>` : ""}
    <hr class="section-divider" />
    <h2 class="info-heading"><span class="heading-icon">🌏</span> <u><strong>Foreigners (without <a href="https://ask.gov.sg/ica/questions/clqety23p003l3w2t96n86" target="_blank" rel="noopener noreferrer">FIN</a>)</strong></u></h2>
    <p>
      Please log in to the <a href="https://myaces.nus.edu.sg/applicantPortal/app/login" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
      with your email account to proceed with your application using the ${qualificationName}.
    </p>
  `;
}

export function internationalLoginSection({ qualificationName }) {
  return `
    <hr class="section-divider" />
    <h2 class="info-heading"><span class="heading-icon">🔎</span> <u><strong>Singapore Citizen / Singapore Permanent Resident / FIN Holders</strong></u></h2>
    <p>
      Please log in to the <a href="https://myaces.nus.edu.sg/applicantPortal/app/login" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
      with your <a href="https://portal.singpass.gov.sg/home/ui/support" target="_blank" rel="noopener noreferrer">Singpass</a> and apply under the
      <strong>Singapore Citizens / Singapore Permanent Residents with International Qualifications</strong> category to proceed with your application using the ${qualificationName}.<br /><br />
      📌 Please check if you fulfil the <a href="https://www.nus.edu.sg/oam/admissions/singapore-citizens-sprs-with-international-qualifications" target="_blank" rel="noopener noreferrer">Mother Tongue Language (MTL) requirements</a>.
    </p>
    <hr class="section-divider" />
    <h2 class="info-heading"><span class="heading-icon">🌏</span> <u><strong>Foreigners (without <a href="https://ask.gov.sg/ica/questions/clqety23p003l3k36w2t96n86" target="_blank" rel="noopener noreferrer">FIN</a>)</strong></u></h2>
    <p>
      Please log in to the <a href="https://myaces.nus.edu.sg/applicantPortal/app/login" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
      with your email account and apply under the <strong>International Student with International Qualification</strong> category to proceed with your application using the ${qualificationName}.
    </p>
  `;
}

// Application period "open" card
export function openPeriodCard({ qualificationName, timeline, openPeriodText }) {
  return `
    <div class="period-card notice-open">
      <h2>📅 AY${timeline && timeline.start ? new Date(timeline.start).getFullYear() + 1 : "____/____"} Application Period for</h2>
      <p>the ${qualificationName} is<br /><strong>${openPeriodText || formatTimeline(timeline)}</strong></p>
    </div>
  `;
}

// Application period "closed" card
export function closedPeriodCard({ qualificationName, closedPeriodText, timeline }) {
  return `
    <div class="period-card period-card closed notice-closed">
      <h2>📅 AY${timeline && timeline.start ? new Date(timeline.start).getFullYear() + 1 : "____/____"} Application Period for</h2>
      <p>the ${qualificationName} has <strong>${closedPeriodText || "closed"}</strong>.</p>
    </div>
  `;
}

// ---------- TRANSFER QUALIFICATION TEMPLATE ----------
export function transferTemplate({ periods, resources }) {
  return `
    <div class="info-card">
      <p>Hello! Thank you for your interest in applying to the National University of Singapore (NUS).</p>
      ${periods && periods.length
        ? periods.map(p => `
          <div class="period-card notice-open">
            <h2>${p.label}</h2>
            <p>${p.rangeText}</p>
          </div>`).join("")
        : ""}
      <hr class="section-divider" />
      <h2 class="info-heading"><span class="heading-icon">🖥️</span> <u><strong>Prospective Transfer Applicants</strong></u></h2>
      <p>
        Please log in to the <a href="https://myaces.nus.edu.sg/applicantPortal/app/login" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
        with your <a href="https://www.singpass.gov.sg/main/individuals/" target="_blank" rel="noopener noreferrer">Singpass</a>
        to proceed with your application as a Transfer candidate.
      </p>
      <hr class="section-divider" />
      <h2 class="info-heading"><span class="heading-icon">🎓</span> <strong>Application Resources for Transfers</strong></h2>
      ${renderResourceList(resources)}
    </div>
  `;
}

// ---------- LOCAL QUALIFICATION TEMPLATE ----------
export function localQualificationTemplate({ qualificationName, timeline, openPeriodText, closedPeriodText, resources, mtlUrl }) {
  return `
    <div class="info-card">
      <p>Hello!</p>
      <p>Thank you for your interest in applying to the National University of Singapore (NUS).</p>
      ${openPeriodCard({ qualificationName, timeline, openPeriodText })}
      ${closedPeriodCard({ qualificationName, closedPeriodText, timeline })}
      ${loginSection({ qualificationName, mtlUrl })}
      <div class="page-break">&nbsp;</div>
      <hr class="section-divider" />
      <h2 class="info-heading"><span class="heading-icon">🎓</span> <strong>Application Resources for the ${qualificationName}</strong></h2>
      ${renderResourceList(resources)}
    </div>
  `;
}

// ---------- INTERNATIONAL QUALIFICATION TEMPLATE ----------
export function internationalQualificationTemplate({ name, timeline, openPeriodText, closedPeriodText, resources }) {
  return `
    <div class="info-card">
      <p>Hello!</p>
      <p>Thank you for your interest in applying to the National University of Singapore (NUS).</p>
      ${openPeriodCard({ qualificationName: name, timeline, openPeriodText })}
      ${closedPeriodCard({ qualificationName: name, closedPeriodText, timeline })}
      ${internationalLoginSection({ qualificationName: name })}
      <div class="page-break">&nbsp;</div>
      <hr class="section-divider" />
      <h2 class="info-heading"><span class="heading-icon">🎓</span> <strong>Application Resources for the ${name}</strong></h2>
      ${renderResourceList(resources)}
    </div>
  `;
}

export const templates = {
  transferTemplate,
  localQualificationTemplate,
  internationalQualificationTemplate,
  renderResourceList,
  formatTimeline
};

