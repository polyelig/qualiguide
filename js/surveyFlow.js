// -------------------------------
// surveyFlow.js (patched)
// -------------------------------

// Build the full list of qualifications (excluding Transfer)
const allQualifications = [
  ...(window.localQualifications || []),
  ...(window.internationalQualifications || [])
].filter(q => q.id !== "transfer");

// Debugging: log qualifications
console.log(
  "All qualifications for dropdown:",
  allQualifications.map(q => q.name)
);

// -------------------------------
// Survey Flow
// -------------------------------
const surveyFlow = [
  {
    id: "transfer",
    question: "Are you currently studying in a tertiary institution OR have enrolled in OR graduated from a tertiary institution?",
    subtitle: "Tertiary institutions refer to universities and colleges of higher education, and does not include polytechnics and the Institute of Technical Education (ITE) in Singapore.",
    options: [
      "Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS)",
      "Overseas tertiary institutions",
      "I have never enrolled in a university before"
    ],
    next: function(answer){ 
      switch (answer) {
        case "Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS)":
          return "local_transfer";
        case "Overseas tertiary institutions":
          return "nationality_transfer";
        case "I have never enrolled in a university before":
          return "nationality";
        default:
          return null;
      }
    }
  },

  // Local Transfer → direct end
  {
    id: "local_transfer",
    question: "As you are currently studying in or have graduated from a local university, you will be considered a Transfer applicant.",
    options: [],
    next: function(){ return "end_transfer"; }
  },

  // Overseas Transfer → nationality check
  {
    id: "nationality_transfer",
    question: "What is your nationality?",
    options: [
      "Singapore Citizen/ Singapore Permanent Resident", 
      "Foreigner"
    ],
    next: function(answer){
      switch (answer) {
        case "Singapore Citizen/ Singapore Permanent Resident":
          return "end_transfer";
        case "Foreigner":
          return "qualification";
        default:
          return null;
      }
    }
  },

  // Non-transfer applicants nationality
  {
    id: "nationality",
    question: "What is your nationality?",
    options: [
      "Singapore Citizen/ Singapore Permanent Resident", 
      "Foreigner"
    ],
    next: function(){ 
      return "qualification"; 
    }
  },

  // Qualifications selection (ID-based)
  {
    id: "qualification",
    question: "What qualification will you be using to apply to the National University of Singapore (NUS)?",
    options: allQualifications.map(q => ({ label: q.name, value: q.id })),
    next: function(answerId){
      const qual = allQualifications.find(q => q.id === answerId);
      if (!qual) {
        console.warn("Selected qualification not found:", answerId);
        return null;
      }
      return "end_" + qual.id;
    }
  }
];

// Expose to global
window.surveyFlow = surveyFlow;

