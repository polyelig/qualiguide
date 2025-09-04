// -------------------------------
// main.js
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quizContainer");
  const quizForm = document.getElementById("quizForm");
  const continueBtn = document.getElementById("continueBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const pageTitle = document.getElementById("pageTitle");

  // Feature-detect :has(); set a class for CSS fallbacks
  try {
    if (!CSS.supports("selector(:has(*))")) {
      document.documentElement.classList.add("no-has");
    }
  } catch {
    document.documentElement.classList.add("no-has");
  }

  // Defensive: surveyFlow must exist
  if (!Array.isArray(window.surveyFlow) || window.surveyFlow.length === 0) {
    console.error("Survey flow not found.");
    quizContainer.innerHTML = "<p>We’re sorry, something went wrong loading the survey. Please refresh.</p>";
    continueBtn.style.display = "none";
    downloadPdfBtn.style.display = "none";
    return;
  }

  let currentStepId = window.surveyFlow[0].id;
  const answers = {};

  // Map for quick access
  const flowMap = {};
  window.surveyFlow.forEach(q => flowMap[q.id] = q);

  function renderStep(stepId) {
    const step = flowMap[stepId];
    if (!step) return;

    currentStepId = stepId;
    // Clear title on question steps
    pageTitle.innerHTML = "";

    quizContainer.innerHTML = "";

    const questionLabel = document.createElement("div");
    questionLabel.className = "question-label";
    questionLabel.textContent = step.question;
    quizContainer.appendChild(questionLabel);

    // No options → auto-advance
    if (!step.options || step.options.length === 0) {
      const nextStepId = typeof step.next === "function" ? step.next() : step.next;
      if (nextStepId?.startsWith?.("end_")) {
        renderEndPage(nextStepId.replace("end_", ""));
      } else if (nextStepId) {
        renderStep(nextStepId);
      }
      return;
    }

    // Qualification dropdown (options are {label, value})
    if (stepId === "qualification") {
      const select = document.createElement("select");
      select.name = "userAnswer";
      select.className = "dropdown";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "-- Select your qualification --";
      select.appendChild(defaultOption);

      step.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
      });

      quizContainer.appendChild(select);
    } else {
      // Radio buttons for other steps (options are strings)
      const optionsDiv = document.createElement("div");
      optionsDiv.className = "options-list";

      step.options.forEach(opt => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "option";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "userAnswer";
        input.value = opt;
        const safeId = String(opt).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "");
        input.id = `${stepId}-${safeId}`;

        const label = document.createElement("label");
        label.textContent = opt;
        label.setAttribute("for", input.id);

        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsDiv.appendChild(optionDiv);

        optionDiv.addEventListener("click", () => { input.checked = true; });
      });

      quizContainer.appendChild(optionsDiv);
    }

    continueBtn.style.display = "block";
    downloadPdfBtn.style.display = "none";

    quizContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setPageTitle(qualification) {
    pageTitle.innerHTML = `
      <div class="page-title">${qualification.name}</div>
    `;
  }

  function renderEndPage(qualificationId) {
    const allQuals = window.qualificationsData || [];
    let qualification = allQuals.find(q => q.id === qualificationId) ||
                        (qualificationId === "transfer" ? allQuals.find(q => q.type === "transfer") : null);

    if (!qualification) {
      quizContainer.innerHTML = "<p>Qualification not found.</p>";
      continueBtn.style.display = "none";
      downloadPdfBtn.style.display = "none";
      return;
    }

    setPageTitle(qualification);

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
    continueBtn.style.display = "none";

    quizContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Handle continue
  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectEl = quizContainer.querySelector('select[name="userAnswer"]');
    let selected = null;

    if (selectEl) {
      selected = selectEl.value;
      if (!selected) return alert("Please select an option.");
    } else {
      const selectedInput = quizContainer.querySelector('input[name="userAnswer"]:checked');
      if (!selectedInput) return alert("Please select an option.");
      selected = selectedInput.value;
    }

    answers[currentStepId] = selected;

    const step = flowMap[currentStepId];
    const nextStepId = typeof step.next === "function" ? step.next(selected) : step.next;

    if (nextStepId?.startsWith?.("end_")) {
      renderEndPage(nextStepId.replace("end_", ""));
    } else if (nextStepId) {
      renderStep(nextStepId);
    }
  });

  // PDF Download
  downloadPdfBtn.addEventListener("click", () => {
    if (typeof html2pdf === "undefined") {
      alert("PDF engine is still loading. Please try again in a moment.");
      return;
    }
    const element = quizContainer;
    const opt = {
      margin: 0.5,
      filename: "nus_application_quiz.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  });

  // Start
  renderStep(currentStepId);
});

