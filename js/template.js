// template.js
// All template HTML structures use CSS classes from styles.css—no inline styles.

// Helper: Format timeline as "17 December 2025 to 4 February 2026"
export function formatTimeline(timeline) {
  if (!timeline || !timeline.start || !timeline.end) return "";
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const start = new Date(timeline.start).toLocaleDateString(undefined, options);
  const end = new Date(timeline.end).toLocaleDateString(undefined, options);
  return `${start} to ${end}`;
}

// Login instructions for local/foreign applicants
export function loginSection({ qualificationName }) {
  return `
    <hr class="section-divider" />
    <h2 class="info-heading"><span class="heading-icon">🖥️</span> <u><strong>Singapore Citizen/ Singapore Permanent Resident / FIN Holders</strong></u></h2>
    <p>
      Please log in to the <a href="https://myaces.nus.edu.sg/applicantPortal/app/login" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
      with your <a href="https://portal.singpass.gov.sg/home/ui/support" target="_blank" rel="noopener noreferrer">Singpass</a>
      to proceed with your application using the ${qualificationName}.
    </p>
    <hr class="section-divider" />
    <h2 class="info-heading"><span class="heading-icon">🌏</span> <u><strong>Foreigners (without <a href="https://ask.gov.sg/ica/questions/clqety23p003l3k36w2t96n86" target="_blank" rel="noopener noreferrer">FIN</a>)</strong></u></h2>
    <p>
      Please log in to the <a href="https://myaces.nus.edu.sg/applicantPortal/app/login" target="_blank" rel="noopener noreferrer">Applicant Portal</a>
      with your email account to proceed with your application using the ${qualificationName}.
    </p>
  `;
}

// Application resources (links) block
export function applicationResourcesSection({ qualificationName, resources }) {
  return `
    <hr class="section-divider" />
    <h2 class="info-heading"><span class="heading-icon">🎓</span> <strong>Application Resources for the ${qualificationName}</strong></h2>
    <ul class="resource-list">
      ${resources
        .map(
          (r) =>
            `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.label}</a>${r.note ? " " + r.note : ""}</li>`
        )
        .join("\n")}
    </ul>
  `;
}

// Application period cards for "open" and "closed" states
export function openPeriodCard({ qualificationName, timeline, openPeriodText }) {
  return `
    <div class="period-card notice-open">
      <h2>📅 AY2026/2027 Application Period for</h2>
      <p>
        the ${qualificationName} is<br />
        <strong>${openPeriodText || formatTimeline(timeline)}</strong>
      </p>
    </div>
  `;
}
export function closedPeriodCard({ qualificationName, closedPeriodText }) {
  return `
    <div class="period-card period-card closed notice-closed">
      <h2>📅 AY2026/2027 Application Period for</h2>
      <p>
        the ${qualificationName} has <strong>${closedPeriodText || "closed"}</strong>.
      </p>
    </div>
  `;
}

// Main info card for a local qualification (Polytechnic, IB, etc.)
export function localQualificationTemplate({
  qualificationName,
  timeline,
  openPeriodText,
  closedPeriodText,
  resources
}) {
  return `
    <div class="info-card">
      <p>Hello!</p>
      <p>Thank you for your interest in applying to the National University of Singapore (NUS).</p>
      ${openPeriodCard({ qualificationName, timeline, openPeriodText })}
      ${closedPeriodCard({ qualificationName, closedPeriodText })}
      ${loginSection({ qualificationName })}
      ${applicationResourcesSection({ qualificationName, resources })}
    </div>
  `;
}

// Simpler info card for IB (if you don't want open/closed cards)
export function ibDiplomaTemplate({ qualificationName, resources }) {
  return `
    <div class="info-card">
      <p>Hello!</p>
      <p>Thank you for your interest in applying to the National University of Singapore (NUS).</p>
      ${loginSection({ qualificationName })}
      ${applicationResourcesSection({ qualificationName, resources })}
    </div>
  `;
}

// International qualification shared message
export function internationalQualificationTemplate(q) {
  return `
    <div class="info-card">
      <h2>${q.name}</h2>
      <div>
        <strong>Application period:</strong> ${formatTimeline(q.timeline)}
      </div>
      <div>
        ${q.internationalMsg || "Instructions for International Applicants not available."}
      </div>
      <div id="noticeOpenInternational" class="notice-box notice-open" role="status" aria-live="polite"></div>
      <div id="noticeClosedInternational" class="notice-box notice-closed" role="status" aria-live="polite"></div>
    </div>
  `;
}

// Local qualification (default fallback, if no custom message)
export function localQualificationDefault(q) {
  return `
    <div class="info-card">
      <h2>${q.name}</h2>
      <div>
        <strong>Application period:</strong> ${formatTimeline(q.timeline)}
      </div>
      <div>
        ${q.localMsg || "Instructions for Local Applicants not available."}
      </div>
    </div>
  `;
}

// Transfer qualification template
export function transferTemplate(q) {
  return `
    <div class="info-card">
      <h2>${q.name}</h2>
      <div>
        ${q.customMessage || "Instructions for Transfer Applicants not available."}
      </div>
    </div>
  `;
}

// Export all templates as an object for easy import
export const templates = {
  localQualificationTemplate,
  ibDiplomaTemplate,
  internationalQualificationTemplate,
  localQualificationDefault,
  transferTemplate,
  // utility sub-templates for customMessage generation:
  loginSection,
  applicationResourcesSection,
  openPeriodCard,
  closedPeriodCard,
  formatTimeline,
};
