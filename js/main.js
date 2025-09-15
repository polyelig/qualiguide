// -------------------------------
// main.js (updated)
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quizContainer");
  const quizForm = document.getElementById("quizForm");
  const continueBtn = document.getElementById("continueBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const pageTitle = document.getElementById("pageTitle"); // unused for end pages
  const formActions = document.querySelector(".form-actions");

  // feature detect :has()
  try {
    if (!CSS.supports("selector(:has(*))")) document.documentElement.classList.add("no-has");
  } catch { document.documentElement.classList.add("no-has"); }

  if (!Array.isArray(window.surveyFlow) || window.surveyFlow.length === 0) {
    quizContainer.innerHTML = "<p>We’re sorry, something went wrong loading the survey. Please refresh.</p>";
    continueBtn.style.display = "none";
    downloadPdfBtn.style.display = "none";
    return;
  }

  let currentStepId = window.surveyFlow[0].id;
  const answers = {};
  const flowMap = {};
  window.surveyFlow.forEach(q => (flowMap[q.id] = q));

  // ----- helpers
  function setQuestionScrollMode() {
    quizContainer.classList.remove("final-scroll", "final-mode");
    quizContainer.style.overflowY = "hidden";
    quizContainer.style.flex = "0 0 auto";
    formActions.classList.remove("final-actions");
    const dateEl = document.getElementById("actionsDate");
    if (dateEl) dateEl.style.display = "none";
  }

  function setFinalScrollMode() {
    quizContainer.classList.add("final-scroll", "final-mode");
    quizContainer.style.overflowY = "auto";
    quizContainer.style.flex = "0 0 auto";
    formActions.classList.add("final-actions");
  }

  function setPageTitleHTML(qualification) {
    const titleHtml = String(qualification.name).replace(/\s*\/\s*/g, "/<wbr> ");
    return `
      <div class="page-title-block">
        <div class="page-title">${titleHtml}</div>
      </div>
    `;
  }

  function getAudience() {
    // Prefer transfer nationality if present; otherwise fall back to non-transfer nationality
    const raw = answers["nationality_transfer"] || answers["nationality"] || null;
    if (raw === "Foreigner") return "foreigner";
    if (raw === "Singapore Citizen/ Singapore Permanent Resident") return "sgpr";
    return null; // unknown/edge case
  }

  function formatToday() {
    try {
      return new Date().toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return new Date().toDateString();
    }
  }

  function ensureDateLabel() {
    let dateEl = document.getElementById("actionsDate");
    if (!dateEl) {
      dateEl = document.createElement("div");
      dateEl.id = "actionsDate";
      dateEl.className = "actions-date";
      const inner = formActions.querySelector(".actions-inner") || formActions;
      inner.prepend(dateEl); // <--- prepend inside actions-inner
  }
  dateEl.textContent = `Date: ${formatToday()}`;
  dateEl.style.display = "block";
}

  // ----- renderers
  function renderStep(stepId) {
    const step = flowMap[stepId];
    if (!step) return;

    currentStepId = stepId;

    if (pageTitle) pageTitle.innerHTML = "";
    setQuestionScrollMode();

    quizContainer.innerHTML = "";

    const questionLabel = document.createElement("div");
    questionLabel.className = "question-label";
    questionLabel.textContent = step.question;
    quizContainer.appendChild(questionLabel);

    // Subtitle (optional)
      if (step.subtitle) {
        const subtitleEl = document.createElement("div");
        subtitleEl.className = "question-subtitle";
        subtitleEl.textContent = step.subtitle;
        quizContainer.appendChild(subtitleEl);
      }

    if (!step.options || step.options.length === 0) {
      const nextStepId = typeof step.next === "function" ? step.next() : step.next;
      if (nextStepId?.startsWith?.("end_")) renderEndPage(nextStepId.replace("end_", ""));
      else if (nextStepId) renderStep(nextStepId);
      return;
    }

    if (stepId === "qualification") {
      const select = document.createElement("select");
      select.name = "userAnswer";
      select.className = "dropdown";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "-- Select your qualification --";
      select.appendChild(defaultOption);

      step.options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        select.appendChild(o);
      });

      quizContainer.appendChild(select);
    } else {
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
        optionDiv.addEventListener("click", () => (input.checked = true));
      });

      quizContainer.appendChild(optionsDiv);
    }

    continueBtn.style.display = "block";
    downloadPdfBtn.style.display = "none";
    quizContainer.scrollTop = 0;
  }

  function renderEndPage(qualificationId) {
    const allQuals = window.qualificationsData || [];
    const qualification =
      allQuals.find(q => q.id === qualificationId) ||
      (qualificationId === "transfer" ? allQuals.find(q => q.type === "transfer") : null);

    if (!qualification) {
      quizContainer.innerHTML = "<p>Qualification not found.</p>";
      continueBtn.style.display = "none";
      downloadPdfBtn.style.display = "none";
      return;
    }

    const headerHTML = setPageTitleHTML(qualification);
    const audience = getAudience();
    let contentHTML = "";
    switch (qualification.type) {
      case "international":
        contentHTML = window.templates.internationalQualificationTemplate(qualification, { audience });
        break;
      case "local":
        contentHTML = window.templates.localQualificationTemplate(qualification, { audience });
        break;
      case "transfer":
        contentHTML = window.templates.transferTemplate(qualification, { audience });
        break;
      default:
        contentHTML = `<div class="info-card"><p>${qualification.name}</p></div>`;
  }

    quizContainer.innerHTML = headerHTML + contentHTML;

    // end-page actions
    setFinalScrollMode();
    ensureDateLabel();
    downloadPdfBtn.style.display = "inline-block";
    continueBtn.style.display = "none";
    quizContainer.scrollTop = 0;
  }

  // ----- events
// ----- events
quizForm.addEventListener("submit", e => {
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

  // Save the answer for the current step
  answers[currentStepId] = selected;

  // --- NEW: special routing for Overseas → Foreigner → Local quals => end_transfer
  if (currentStepId === "qualification") {
    const allQuals = (window.localQualifications || []).concat(window.internationalQualifications || []);
    const qual = allQuals.find(q => q.id === selected);
    if (qual) {
      const natTransfer = answers["nationality_transfer"]; // "Singapore Citizen/ Singapore Permanent Resident" | "Foreigner" | undefined
      if (natTransfer === "Foreigner" && qual.type === "local") {
        // Route to Transfer end page (audience-aware login text handled by template)
        renderEndPage("transfer");
        return;
      } else {
        // Normal behavior: go to the selected qualification's end page
        renderEndPage(selected);
        return;
      }
    }
  }

  // Default next-step logic (unchanged)
  const step = flowMap[currentStepId];
  const nextStepId = typeof step.next === "function" ? step.next(selected) : step.next;

  if (nextStepId?.startsWith?.("end_")) renderEndPage(nextStepId.replace("end_", ""));
  else if (nextStepId) renderStep(nextStepId);
});


  // PDF: capture only the scroll area (not the actions bar)
  downloadPdfBtn.addEventListener("click", () => {
    if (typeof html2pdf === "undefined") return alert("PDF engine is still loading. Please try again in a moment.");

    const prevOverflow = quizContainer.style.overflow;
    const prevOverflowY = quizContainer.style.overflowY;
    const prevHeight   = quizContainer.style.height;
    const prevMaxH     = quizContainer.style.maxHeight;

    quizContainer.style.overflow = "visible";
    quizContainer.style.overflowY = "visible";
    quizContainer.style.height = "auto";
    quizContainer.style.maxHeight = "none";

    const opt = {
      margin: 0.5,
      filename: "NUS_Qualification_Guide.pdf",
      html2canvas: { scale: 2, useCORS: true, windowWidth: document.documentElement.offsetWidth },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] }
    };

    html2pdf().set(opt).from(quizContainer).save().then(() => {
      quizContainer.style.overflow = prevOverflow;
      quizContainer.style.overflowY = prevOverflowY;
      quizContainer.style.height = prevHeight;
      quizContainer.style.maxHeight = prevMaxH;
      setFinalScrollMode();
    }).catch(() => {
      quizContainer.style.overflow = prevOverflow;
      quizContainer.style.overflowY = prevOverflowY;
      quizContainer.style.height = prevHeight;
      quizContainer.style.maxHeight = prevMaxH;
      setFinalScrollMode();
    });
  });

  // init
  renderStep(currentStepId);
});






