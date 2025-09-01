// Common message for all local qualifications (can be overridden per qualification)
const localCommon = {
  localMsg: "Please log in to the <a href='https://myaces.nus.edu.sg/applicantPortal/app/login' target='_blank'>Applicant Portal</a> with your <a href='https://www.singpass.gov.sg/main/individuals/' target='_blank'>Singpass</a>."
};

// List of local qualifications with their unique fields
const localQualifications = [
  {
    id: "singapore-cambridge-gce-a-level",
    name: "Singapore-Cambridge GCE A-Level",
    icon: "🇸🇬",
    type: "local",
    timeline: { start: "2026-02-25", end: "2026-03-19" },
    displayPeriod: "25 February 2026 to 19 March 2026",
    admissionUrl: "https://nus.edu.sg/oam/admissions/singapore-cambridge-gce-a-level",
    standardisedTestRequired: false,
    englishRequirementRequired: false
  },
  {
    id: "polytechnic-diploma-singapore",
    name: "Polytechnic Diploma from Singapore",
    icon: "🇸🇬",
    type: "local",
    timeline: { start: "2025-12-17", end: "2026-02-04" },
    displayPeriod: "17 December 2025 to 4 February 2025",
    admissionUrl: "https://nus.edu.sg/oam/admissions/polytechnic-diploma-from-singapore",
    standardisedTestRequired: false,
    englishRequirementRequired: false
  },
  {
    id: "nus-high-school-diploma",
    name: "NUS High School Diploma",
    icon: "🇸🇬",
    type: "local",
    timeline: { start: "2025-12-17", end: "2026-02-02" },
    displayPeriod: "17 December 2025 to 2 January 2026",
    admissionUrl: "https://nus.edu.sg/oam/admissions/nus-high-school-diploma",
    standardisedTestRequired: false,
    englishRequirementRequired: false
  },
  {
    id: "international-baccalaureate-ib-diploma",
    name: "International Baccalaureate (IB) Diploma",
    icon: "🇸🇬",
    type: "local",
    timeline: { start: "2025-12-17", end: "2026-03-23" },
    displayPeriod: "17 December 2025 to 23 March 2026",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-baccalaureate-(ib)-diploma",
    standardisedTestRequired: false,
    englishRequirementRequired: false
  }
];

// Merge localCommon into each local qualification
const localQualificationsData = localQualifications.map(q => ({
  ...localCommon,
  ...q
}));

// --- Transfer Qualification (custom HTML message as "customMessage") ---
const transferQualification = {
  id: "transfer",
  name: "Transfer",
  type: "transfer",
  icon: "🔄",
  timeline: null,
  displayPeriod: "",
  localMsg: "",
  foreignMsg: "",
  admissionUrl: "",
  standardisedTestRequired: false,
  englishRequirementRequired: false,
  customMessage: `
<div style="font-family: Arial, sans-serif; text-align: left; padding: 20px; background-color: #f9f9f9; color: #333; max-width: 800px; width: 100%; box-sizing: border-box; line-height: 1.6;">
  <p style="font-size: 15px; margin-bottom: 20px;">Hello!</p>
  <p style="font-size: 15px; margin-bottom: 24px;">Thank you for your interest in applying to the National University of Singapore (NUS).</p>
  <div style="display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;">
    <div style="flex: 1 1 300px; padding: 16px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
      <h2 style="margin: 0; font-size: 18px;">📅 AY2024/2025 Semester 2</h2>
      <p style="font-size: 15px; margin: 8px 0 0;">Application Period for Transfer Applicants is<br /><strong>29 October 2024 to 12 November 2024</strong></p>
    </div>
    <div style="flex: 1 1 300px; padding: 16px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
      <h2 style="margin: 0; font-size: 18px;">📅 AY2025/2026 Semester 1</h2>
      <p style="font-size: 15px; margin: 8px 0 0;">Application Period for Transfer Applicants is<br /><strong>4 February 2025 to 18 February 2025</strong></p>
    </div>
  </div>
  <div style="margin: 16px 0; padding: 16px; border-radius: 12px; background-color: #fff3f3; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
    <h2 style="margin: 0; font-size: 18px;">📅 AY2025/2026 Application Period for</h2>
    <p style="font-size: 15px; margin: 8px 0 0;">Transfer Applicants has <strong>closed</strong>.</p>
  </div>
  <hr style="margin: 24px 0;" />
  <h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🖥️ <u><strong>Prospective Transfer Applicants</strong></u></h2>
  <p style="font-size: 15px; margin-bottom: 24px;">As you have indicated that you are currently studying / have enrolled in / have graduated from a tertiary institution, please log in to the <a href="https://myaces.nus.edu.sg/applicantPortal/app/login" target="_blank">Applicant Portal</a> with your <a href="https://www.singpass.gov.sg/main/individuals/" target="_blank">Singpass</a> to proceed with your application as a Transfer candidate.</p>
  <hr style="margin: 24px 0;" />
  <h2 style="font-size: 18px; font-weight: normal; margin: 0 0 10px;">🎓 <strong>Application Resources for Transfers</strong></h2>
  <ul style="padding-left: 20px; font-size: 15px; margin-bottom: 0;">
    <li style="margin-bottom: 6px;"><a href="https://nus.edu.sg/oam/admissions/important-dates" target="_blank">Important Dates</a> (application opening and closing dates)</li>
    <li style="margin-bottom: 6px;"><a href="https://nus.edu.sg/oam/admissions/application-guides-sample-forms" target="_blank">Application Guides &amp; Sample Forms</a></li>
    <li style="margin-bottom: 6px;"><a href="https://nus.edu.sg/oam/admissions/before-you-apply" target="_blank">Programme Prerequisites</a> (before you apply)</li>
    <li style="margin-bottom: 6px;"><a href="https://nus.edu.sg/oam/admissions/after-you-apply" target="_blank">Update of Applicant Information</a> (after you apply)</li>
    <li style="margin-bottom: 6px;"><a href="https://nus.edu.sg/oam/docs/default-source/transfer-applicants/nus-oam-transfer-eligibility-chart.pdf" target="_blank">NUS Transfer Eligibility Chart</a></li>
  </ul>
</div>
`
};

// Common fields for all international qualifications
const internationalCommon = {
  type: "international",
  icon: "🌏",
  timeline: { start: "2025-12-03", end: "2026-02-23" },
  displayPeriod: "3 December 2025 to 23 February 2026",
  localMsg: "",
  foreignMsg: ""
};

// List of international qualifications with unique fields
const internationalQualifications = [
  {
    id: "a-level-cambridge-edexcel-ocr",
    name: "A-Level (AQA, Cambridge, Edexcel, London, OCR, Oxford International AQA, WJEC)",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/international-'a'-level",
    standardisedTestRequired: true,
    englishRequirementRequired: false
  },
  {
    id: "american-high-school-diploma",
    name: "American High School Diploma",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/american-high-school-diploma",
    standardisedTestRequired: true,
    englishRequirementRequired: false
  },
  {
    id: "australian-high-school",
    name: "Australian High School",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/australian-high-school",
    standardisedTestRequired: false,
    englishRequirementRequired: true
  },
  {
    id: "brunei-a-level",
    name: "Brunei A-Level",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/brunei-a-level",
    standardisedTestRequired: true,
    englishRequirementRequired: false
  },
  {
    id: "canadian-high-school-diploma",
    name: "Canadian High School Diploma",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/canadian-high-school-diploma",
    standardisedTestRequired: true,
    englishRequirementRequired: true
  },
  {
    id: "caribbean-cape",
    name: "Caribbean Advanced Proficiency Examination (CAPE)",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/caribbean-advanced-proficiency-examination-(cape)",
    standardisedTestRequired: true,
    englishRequirementRequired: false
  },
  {
    id: "danish-studentereksamen",
    name: "Danish Studentereksamen (Upper Secondary Leaving Examination)",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/danish-studentereksamen-(upper-secondary-leaving-examination)",
    standardisedTestRequired: true,
    englishRequirementRequired: true
  },
  {
    id: "european-baccalaureate-diploma",
    name: "European Baccalaureate Diploma",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/european-baccalaureate-diploma",
    standardisedTestRequired: true,
    englishRequirementRequired: true
  },
  {
    id: "french-baccalaureate-diploma",
    name: "French Baccalaureate Diploma",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/french-baccalaureate-diploma",
    standardisedTestRequired: true,
    englishRequirementRequired: true
  },
  {
    id: "gao-kao-prc",
    name: "Gao Kao or PRC National College Entrance Examination",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/gao-kao-or-prc-national-college-entrance-examination/",
    standardisedTestRequired: false,
    englishRequirementRequired: true
  },
  {
    id: "german-abitur",
    name: "German Abitur",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/german-abitur",
    standardisedTestRequired: true,
    englishRequirementRequired: true
  },
  {
    id: "hong-kong-hkdse-alevel",
    name: "Hong Kong Diploma of Secondary Education (HKDSE)/ Hong Kong A-Level",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/hong-kong-diploma-of-secondary-education-(hkdse)-hong-kong-a-level",
    standardisedTestRequired: false,
    englishRequirementRequired: false
  },
  {
    id: "independent-examinations-board",
    name: "Independent Examinations Board",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/independent-examinations-board",
    standardisedTestRequired: false,
    englishRequirementRequired: false
  },
  {
    id: "indian-standard-12-cbse-isc",
    name: "Indian Standard 12 (Central and ISC Boards)",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indian-standard-12-(central-and-isc-boards)",
    standardisedTestRequired: false,
    englishRequirementRequired: false
  },
  {
    id: "indian-standard-12-state",
    name: "Indian Standard 12 (State and other Boards)",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/indian-standard-12-state",
    standardisedTestRequired: true,
    englishRequirementRequired: false
  },
  {
    id: "indonesian-ujian-nasional-raport",
    name: "Indonesian Ujian Nasional (UN) / Raport",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indian-standard-12-(state-and-other-boards)",
    standardisedTestRequired: false,
    englishRequirementRequired: true
  },
  {
    id: "italian-diploma-di-esame-di-stato",
    name: "Italian Diploma di Esame di Stato",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/italian-diploma-di-esame-di-stato",
    standardisedTestRequired: true,
    englishRequirementRequired: true
  },
  {
    id: "mauritius-high-school-certificate",
    name: "Mauritius High School Certificate",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/mauritius-high-school-certificate",
    standardisedTestRequired: false,
    englishRequirementRequired: false
  },
  {
    id: "new-zealand-ncea-level-3",
    name: "New Zealand National Certificate of Education Achievement (NCEA) Level 3",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/ncea",
    standardisedTestRequired: false,
    englishRequirementRequired: false
  },
  {
    id: "oman-thanawiya-amma",
    name: "Oman Thanawiya Amma (Secondary School Leaving Certificate)",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/oman-thanawiya-amma",
    standardisedTestRequired: false,
    englishRequirementRequired: true
  },
  {
    id: "sijil-tinggi-persekolahan-malaysia-stpm",
    name: "Sijil Tinggi Persekolahan Malaysia (STPM)",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/stpm",
    standardisedTestRequired: false,
    englishRequirementRequired: true
  },
  {
    id: "sri-lanka-a-level",
    name: "Sri Lanka A-Level",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/sri-lanka-a-level",
    standardisedTestRequired: false,
    englishRequirementRequired: true
  },
  {
    id: "swiss-matura",
    name: "Swiss Matura/ Swiss Federal Maturity Certificate",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/swiss-matura",
    standardisedTestRequired: true,
    englishRequirementRequired: true
  },
  {
    id: "taiwan-senior-high-school",
    name: "Taiwan Senior High School",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/taiwan-senior-high-school",
    standardisedTestRequired: true,
    englishRequirementRequired: false
  },
  {
    id: "thailand-mathayom-6",
    name: "Thailand Certificate of Secondary Education (Mathayom 6)",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/thailand-cert-secondary-education",
    standardisedTestRequired: false,
    englishRequirementRequired: true
  },
  {
    id: "turkish-high-school",
    name: "Turkish High School",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/turkish-high-school",
    standardisedTestRequired: true,
    englishRequirementRequired: true
  },
  {
    id: "uec",
    name: "Unified Examination Certificate (UEC)",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/uec",
    standardisedTestRequired: false,
    englishRequirementRequired: true
  },
  {
    id: "vietnam-national-high-school",
    name: "Vietnam National High School Graduation Examination",
    admissionUrl: "https://www.nus.edu.sg/oam/admissions/international-qualifications/vietnam-national-high-school-graduation-examination",
    localMsg: "Please log in to the Applicant Portal with your Singpass and apply under the Singapore Citizens / PRs category.",
    foreignMsg: "Please log in to the Applicant Portal with your email account and apply under the International Student category.",
    standardisedTestRequired: false,
    englishRequirementRequired: true
  },
  {
    id: "other-high-school-qualifications",
    name: "Other High School Qualifications",
    admissionUrl: "https://nus.edu.sg/oam/admissions/international-qualifications/other-high-school-qualifications",
    standardisedTestRequired: true,
    englishRequirementRequired: false
  }
];

// Merge internationalCommon into each international qualification
const internationalQualificationsData = internationalQualifications.map(q => ({
  ...internationalCommon,
  ...q
}));

// Final qualifications array in required order
export const qualificationsData = [
  transferQualification,
  ...localQualificationsData,
  ...internationalQualificationsData
];
