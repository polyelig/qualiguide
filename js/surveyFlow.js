// -------------------------------
// surveyFlow.js
// -------------------------------

// Build the full list of qualifications (excluding Transfer)
const allQualifications = [
  ...(window.localQualifications || []),
  ...(window.internationalQualifications || [])
].filter(q => q.id !== "transfer");

const surveyFlow = [
  {
    id: "transfer",
    question: "Are you currently studying in a tertiary institution / have enrolled in / graduated from a tertiary institution?",
    options: [
      "Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS, UAS)",
      "Overseas tertiary institutions",
      "I am not a current or former undergraduate"
    ],
    next: function(answer){ 
      // All three options lead to nationality page
      return "nationality";
    }
  },
  {
    id: "nationality",
    question: "What is your nationality?",
    options: ["Singapore Citizen/ Singapore Permanent Resident", "Foreigner"],
    next: function(answer){
      return "qualification";
    }
  },
  {
    id: "qualification",
    question: "What qualification will you be using to apply to the National University of Singapore (NUS)?",
    options: allQualifications.map(q => q.name),
    next: function(answer){
      // Find the qualification by name and return its actual ID
      const qual = allQualifications.find(q => q.name === answer);
      return qual ? "end_" + qual.id : null;
    }
  }
];

// Expose to global
window.surveyFlow = surveyFlow;
