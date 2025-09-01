//surveyFlow.js

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[()\/,.]+/g, '')      // Remove special characters
    .replace(/-+/g, '-')            // Collapse dashes
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

const surveyFlow = [
  // ---------- Transfer Check ----------
  {
    id: "transfer",
    question: "Are you currently studying in a tertiary institution / have enrolled in / graduated from a tertiary institution?",
    options: [
      "Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS, UAS)",
      "Overseas tertiary institutions",
      "I am not a current or former undergraduate"
    ],
    next: (answer) => {
      if(answer === "Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS, UAS)") return "endTransfer";
      if(answer === "Overseas tertiary institutions") return "nationality";
      if(answer === "I am not a current or former undergraduate") return "nationalityNotCurrent";
    }
  },

  // ---------- Nationality for Overseas Students ----------
  {
    id: "nationality",
    question: "What is your nationality?",
    options: ["Singapore Citizen/ Singapore Permanent Resident", "Foreigner"],
    next: (answer) => {
      if(answer === "Singapore Citizen/ Singapore Permanent Resident") return "endTransfer";
      if(answer === "Foreigner") return "qualification";
    }
  },

  // ---------- Nationality for Not Current / Undergraduate ----------
  {
    id: "nationalityNotCurrent",
    question: "What is your nationality?",
    options: ["Singapore Citizen/ Singapore Permanent Resident", "Foreigner"],
    next: (answer) => {
      if(answer === "Singapore Citizen/ Singapore Permanent Resident") return "qualification";
      if(answer === "Foreigner") return "qualification";
    }
  },

  // ---------- Qualification Dropdown ----------
  {
    id: "qualification",
    question: "What qualification will you be using to apply to the National University of Singapore (NUS)?",
    options: [
      "Singapore-Cambridge GCE A-Level",
      "Polytechnic Diploma from Singapore",
      "NUS High School Diploma",
      "International Baccalaureate (IB) Diploma",
      "A-Level (AQA, Cambridge, Edexcel, London, OCR, Oxford International AQA, WJEC)",
      "American High School Diploma",
      "Australian High School",
      "Brunei A-Level",
      "Canadian High School Diploma",
      "Caribbean Advanced Proficiency Examination (CAPE)",
      "Danish Studentereksamen (Upper Secondary Leaving Examination)",
      "European Baccalaureate Diploma",
      "French Baccalaureate Diploma",
      "Gao Kao or PRC National College Entrance Examination",
      "German Abitur",
      "Hong Kong Diploma of Secondary Education (HKDSE)/ Hong Kong A-Level",
      "Independent Examinations Board",
      "Indian Standard 12 (Central and ISC Boards)",
      "Indian Standard 12 (State and other Boards)",
      "Indonesian Ujian Nasional (UN) / Raport",
      "Italian Diploma di Esame di Stato",
      "Mauritius High School Certificate",
      "New Zealand National Certificate of Education Achievement (NCEA) Level 3",
      "Oman Thanawiya Amma (Secondary School Leaving Certificate)",
      "Sijil Tinggi Persekolahan Malaysia (STPM)",
      "Sri Lanka A-Level",
      "Swiss Matura/ Swiss Federal Maturity Certificate",
      "Taiwan Senior High School",
      "Thailand Certificate of Secondary Education (Mathayom 6)",
      "Turkish High School",
      "Unified Examination Certificate (UEC)",
      "Vietnam National High School Graduation Examination",
      "Other High School Qualifications"
    ],
    next: (answer) => "end_" + slugify(answer) // Dynamic end for each qualification
  }
];
