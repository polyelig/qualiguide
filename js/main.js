// -------------------------------
// main.js (updated: desktop-only overlay select, cleanup)
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quizContainer");
  const quizForm = document.getElementById("quizForm");
  const continueBtn = document.getElementById("continueBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const pageTitle = document.getElementById("pageTitle"); // unused for end pages
  const formActions = document.querySelector(".form-actions");

  // Detect coarse (touch) pointers (mobile/tablet)
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

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
    // keep visible so the expanded dropdown can overlay (desktop),
    // and allow the container to scroll on mobile via CSS media rules
    quizContainer.style.overflowY = "visible";
    formActions.classList.remove("final-actions");
    const dateEl = document.getElementById("actionsDate");
    if (dateEl) dateEl.style.display = "none";
  }

  function setFinalScrollMode() {
    quizContainer.classList.add("final-scroll", "final-mode");
    quizContainer.style.overflowY = "auto";
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

  // Collapse any other open dropdowns (desktop overlay select)
  function closeAllDropdowns(exceptEl = null) {
    document.querySelectorAll("select.dropdown.dropdown-open").forEach(sel => {
      if (sel !== exceptEl) {
        sel.classList.remove("dropdown-open", "dropdown-open-up");
        sel.removeAttribute("size");
      }
    });
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
      // wrapper to allow overlay expansion (desktop)
      const wrap = document.createElement("div");
      wrap.className = "select-wrap";

      const select = document.createElement("select");
      select.name = "userAnswer";
      select.className = "dropdown";
      select.setAttribute("aria-label", "Select your qualification");

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

      // ==== Expand-on-focus behavior (DESKTOP ONLY) ====
      if (!isTouch) {
        const ROW_HEIGHT = 34; // for flip decision only
        const V_PADDING = 16;

        const expand = () => {
          if (select.classList.contains("dropdown-open")) return;

          closeAllDropdowns(select);

          const rows = Math.min(10, Math.max(1, select.options.length));
          const desiredHeight = rows * ROW_HEIGHT + V_PADDING;

          const rect = select.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;

          const openUp = spaceBelow < desiredHeight && spaceAbove > spaceBelow;

          select.setAttribute("size", String(rows));
          select.classList.add("dropdown-open");
          if (openUp) select.classList.add("dropdown-open-up");
          else select.classList.remove("dropdown-open-up");
        };

        const collapse = () => {
          select.classList.remove("dropdown-open", "dropdown-open-up");
          select.removeAttribute("size"); // restore native single-row
        };

        // Open on focus/click
        select.addEventListener("focus", expand);
        select.addEventListener("click", () => {
          if (!select.classList.contains("dropdown-open")) expand();
        });

        // Collapse on change/blur
        select.addEventListener("change", collapse);
        select.addEventListener("blur", () => setTimeout(collapse, 0));

        // Keyboard support
        select.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            collapse();
            select.blur();
          } else if (e.key === "Enter") {
            collapse();
          }
        });

        // Close when clicking outside (desktop only)
        const onDocPointerDown = (e) => {
          if (!wrap.contains(e.target)) collapse();
        };
        setTimeout(() => {
          document.addEventListener("pointerdown", onDocPointerDown, { passive: true, once: true });
        }, 0);
      }
      // (On touch, we rely on the native picker—no custom listeners)

      wrap.appendChild(select);
      quizContainer.appendChild(wrap);
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

    // Special routing: Overseas → Foreigner → Local quals => end_transfer
    if (currentStepId === "qualification") {
      const allQuals = (window.localQualifications || []).concat(window.internationalQualifications || []);
      const qual = allQuals.find(q => q.id === selected);
      if (qual) {
        const natTransfer = answers["nationality_transfer"]; // "Singapore Citizen/ Singapore Permanent Resident" | "Foreigner" | undefined
        if (natTransfer === "Foreigner" && qual.type === "local") {
          renderEndPage("transfer");
          return;
        } else {
          renderEndPage(selected);
          return;
        }
      }
    }

    // Default next-step logic
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
