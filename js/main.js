// -------------------------------
// main.js
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quizContainer");
  const quizForm = document.getElementById("quizForm");
  const continueBtn = document.getElementById("continueBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const pdfContent = document.getElementById("pdfContent");

  // Track current question index and answers
  let currentStep = 0;
  const answers = {};

  // Flatten survey flow for easy lookup by ID
  const flowMap = {};
  window.surveyFlow.forEach(q => flowMap[q.id] = q);

  function renderStep(stepId) {
    const step = flowMap[stepId];
    if (!step) return;

    // Clear container
    quizContainer.innerHTML = "";

    // Render question
    const questionLabel = document.createElement("div");
    questionLabel.className = "question-label";
    questionLabel.textContent = step.question;
    quizContainer.appendChild(questionLabel);

    // Render options
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options-list";

    step.options.forEach(opt => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "userAnswer";
      input.value = opt;

      const label = document.createElement("label");
      label.textContent = opt;

      optionDiv.appendChild(input);
      optionDiv.appendChild(label);
      optionsDiv.appendChild(optionDiv);

      // Allow clicking anywhere
      optionDiv.addEventListener("click", () => {
        input.checked = true;
      });
    });

    quizContainer.appendChild(optionsDiv);

    // Show/hide continue button
    continueBtn.style.display = "block";
    downloadPdfBtn.style.display = "none";
  }

  function renderEndPage(qualificationName) {
    // Find qualification object
    const allQuals = [
      ...(window.localQualifications || []),
      ...(window.internationalQualifications || []),
      ...(window.transferQualification ? [window.transferQualification] : [])
    ];
    const qualification = allQuals.find(q => q.name === qualificationName);

    if (!qualification) {
      quizContainer.innerHTML = "<p>Qualification not found.</p>";
      return;
    }

    // Clear container
    quizContainer.innerHTML = "";

    // Determine template
    let html = "";
    switch (qualification.type) {
      case "international":
        html = window.templates.internationalQualificationTemplate(qualification);
        break;
      case "local":
        html = window.templates.localQualificationTemplate(qualification);
        break;
      case "transfer":
        html = window.templates.transferTemplate(qualification);
        break;
      default:
        html = `<div class="info-card"><p>${qualification.name}</p></div>`;
    }

    quizContainer.innerHTML = html;

    // Show PDF button
    downloadPdfBtn.style.display = "inline-block";
  }

  // Handle form submission
  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = quizForm.userAnswer?.value;
    if (!selected) return alert("Please select an option.");

    // Track answer
    const stepId = window.surveyFlow[currentStep].id;
    answers[stepId] = selected;

    // Determine next step
    const nextStepId = window.surveyFlow[currentStep].next(selected);

    // If nextStepId starts with 'end_', render final page
    if (nextStepId.startsWith("end_")) {
      const qualSlug = nextStepId.replace("end_", "");
      // Match by slug
      const allQuals = [
        ...(window.localQualifications || []),
        ...(window.internationalQualifications || []),
        ...(window.transferQualification ? [window.transferQualification] : [])
      ];
      const qualObj = allQuals.find(q => slugify(q.name) === qualSlug);
      if (qualObj) {
        renderEndPage(qualObj.name);
      } else {
        quizContainer.innerHTML = "<p>Qualification not found.</p>";
      }
    } else {
      // Move to next step
      const nextIndex = window.surveyFlow.findIndex(q => q.id === nextStepId);
      if (nextIndex >= 0) currentStep = nextIndex;
      renderStep(window.surveyFlow[currentStep].id);
    }
  });

  // PDF Download
  downloadPdfBtn.addEventListener("click", () => {
    const element = quizContainer;
    const opt = {
      margin: 0.5,
      filename: "nus_application_quiz.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  });

  // Render first step
  renderStep(window.surveyFlow[currentStep].id);
});
