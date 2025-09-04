// -------------------------------
// main.js
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quizContainer");
  const quizForm = document.getElementById("quizForm");
  const continueBtn = document.getElementById("continueBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");

  let currentStepId = window.surveyFlow[0]?.id || null;
  const answers = {};

  // Flatten survey flow for lookup by ID
  const flowMap = {};
  window.surveyFlow.forEach(q => flowMap[q.id] = q);

  function renderStep(stepId) {
    const step = flowMap[stepId];
    if (!step) return;

    currentStepId = stepId;
    quizContainer.innerHTML = "";

    // Question
    const questionLabel = document.createElement("div");
    questionLabel.className = "question-label";
    questionLabel.textContent = step.question;
    quizContainer.appendChild(questionLabel);

    // Auto-advance if no options (e.g., Transfer)
    if (!step.options || step.options.length === 0) {
      continueBtn.style.display = "none";
      const nextStepId = step.next();
      if (nextStepId?.startsWith("end_")) {
        const qualId = nextStepId.replace("end_", "");
        renderEndPage(qualId);
      } else if (nextStepId) {
        renderStep(nextStepId);
      }
      return;
    }

    // Dropdown for qualifications (more than 5 options) or radio for few options
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options-list";

    if (step.id === "qualification") {
      const select = document.createElement("select");
      select.name = "userAnswer";
      select.id = "userAnswer";

      const defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = "-- Select your qualification --";
      select.appendChild(defaultOpt);

      step.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });

      optionsDiv.appendChild(select);
    } else {
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

        optionDiv.addEventListener("click", () => {
          input.checked = true;
        });
      });
    }

    quizContainer.appendChild(optionsDiv);
    continueBtn.style.display = "block";
    downloadPdfBtn.style.display = "none";
  }

  function renderEndPage(qualificationId) {
    const allQuals = window.qualificationsData || [];
    const qualification = allQuals.find(q => q.id === qualificationId);

    if (!qualification) {
      quizContainer.innerHTML = "<p>Qualification not found.</p>";
      continueBtn.style.display = "none";
      return;
    }

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
    downloadPdfBtn.style.display = "inline-block";
    continueBtn.style.display = "none";
  }

  // Handle form submission
  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let selected;
    if (currentStepId === "qualification") {
      selected = document.getElementById("userAnswer")?.value;
    } else {
      selected = quizForm.userAnswer?.value;
    }

    if (!selected) return alert("Please select an option.");

    answers[currentStepId] = selected;
    const nextStepId = flowMap[currentStepId].next(selected);

    if (!nextStepId) return;

    if (nextStepId.startsWith("end_")) {
      const qualId = nextStepId.replace("end_", "");
      renderEndPage(qualId);
    } else {
      renderStep(nextStepId);
    }
  });

  // PDF Download
  downloadPdfBtn.addEventListener("click", () => {
    html2pdf().set({
      margin: 0.5,
      filename: "nus_application_quiz.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    }).from(quizContainer).save();
  });

  // Render first step
  if (currentStepId) renderStep(currentStepId);
});
