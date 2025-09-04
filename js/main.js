// -------------------------------
// main.js
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quizContainer");
  const quizForm = document.getElementById("quizForm");
  const continueBtn = document.getElementById("continueBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");

  let currentStep = 0;
  const answers = {};

  const flowMap = {};
  window.surveyFlow.forEach(q => flowMap[q.id] = q);

  function renderStep(stepId) {
    const step = flowMap[stepId];
    if (!step) return;

    quizContainer.innerHTML = "";

    // If this is the transfer step, skip options and go directly to transfer template
    if (step.id === "transfer") {
      if (window.transferQualification) {
        renderEndPage("transfer");
        return;
      }
    }

    // Question
    const questionLabel = document.createElement("div");
    questionLabel.className = "question-label";
    questionLabel.textContent = step.question;
    quizContainer.appendChild(questionLabel);

    // Options
    if (step.id === "qualification") {
      // Dropdown
      const select = document.createElement("select");
      select.name = "userAnswer";

      const defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = "-- Please select --";
      select.appendChild(defaultOpt);

      step.options.forEach(opt => {
        const optionEl = document.createElement("option");
        optionEl.value = opt;
        optionEl.textContent = opt;
        select.appendChild(optionEl);
      });

      quizContainer.appendChild(select);
    } else {
      // Radio buttons
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

        optionDiv.addEventListener("click", () => {
          input.checked = true;
        });
      });

      quizContainer.appendChild(optionsDiv);
    }

    continueBtn.style.display = "block";
    downloadPdfBtn.style.display = "none";
  }

  function renderEndPage(qualificationId) {
    const allQuals = [
      ...(window.localQualifications || []),
      ...(window.internationalQualifications || []),
      ...(window.transferQualification ? [window.transferQualification] : [])
    ];
    const qualification = allQuals.find(q => q.id === qualificationId);

    if (!qualification) {
      quizContainer.innerHTML = "<p>Qualification not found.</p>";
      return;
    }

    quizContainer.innerHTML = "";

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
  }

  // Handle form submission
  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = quizForm.userAnswer?.value;
    const stepId = window.surveyFlow[currentStep].id;

    // Skip validation if it's transfer (direct render already handled)
    if (stepId !== "transfer" && !selected) {
      return alert("Please select an option.");
    }

    answers[stepId] = selected;

    const nextStepId = window.surveyFlow[currentStep].next(selected);

    if (nextStepId.startsWith("end_")) {
      const qualId = nextStepId.replace("end_", "");
      renderEndPage(qualId);
    } else {
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
      filename: "NUS_Qualification_Guide.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  });

  // Start
  renderStep(window.surveyFlow[currentStep].id);
});
