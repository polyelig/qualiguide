let currentStep = "transfer";
let answers = {};

function renderQuestion(stepId){
  const step = surveyFlow.find(s => s.id === stepId);
  const container = document.getElementById("quizContainer");

  if(!step){
    renderEndOfSurvey();
    return;
  }

  container.style.display = "block";
  container.innerHTML = `<h3>${step.question}</h3>`;
  step.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      answers[stepId] = opt;
      currentStep = step.next(opt);
      renderQuestion(currentStep);
    };
    container.appendChild(btn);
  });
}

function renderEndOfSurvey(){
  const container = document.getElementById("quizContainer");
  container.style.display = "none";

  const pdfDiv = document.getElementById("pdfContent");
  pdfDiv.innerHTML = `<p style="font-size:15px;">Hello! Thank you for your interest in applying to NUS.</p>`;

  let qualKey = answers["qualification"] || "Vietnam National High School Graduation Examination";
  const q = qualifications[qualKey];

  pdfDiv.innerHTML += `<div class="notice-box ${q.appClosed ? "notice-closed" : "notice-open"}">
    <h2>📅 AY2026/2027 Application Period for</h2>
    <p>${q.name}<br/>${q.appClosed ? "has <strong>closed</strong>." : "is<br/><strong>"+q.appPeriod+"</strong>."}</p>
  </div>`;

  if(answers["nationality"] === "Singapore Citizen/ Singapore Permanent Resident" || answers["transfer"] === "Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS, UAS)"){
    pdfDiv.innerHTML += `<div class="notice-box notice-open">
      <h2>🔎 Singapore Citizen / Singapore PR / FIN Holders</h2>
      <p>${q.localMsg}</p>
    </div>`;
  }

  if(answers["nationality"] === "Foreigner" || answers["transfer"] === "I am not a current or former undergraduate" || answers["transfer"] === "Overseas tertiary institutions"){
    pdfDiv.innerHTML += `<div class="notice-box notice-open">
      <h2>🌏 Foreigners (without FIN)</h2>
      <p>${q.foreignMsg}</p>
    </div>`;
  }

  pdfDiv.innerHTML += `<h2>🎓 Application Resources</h2><ul id="resourcesList"></ul>`;
  const resList = document.getElementById("resourcesList");
  q.resources.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${r.url}" target="_blank">${r.label}</a>`;
    resList.appendChild(li);
  });

  document.getElementById("downloadPdfBtn").style.display = "inline-block";
}

document.getElementById('downloadPdfBtn').addEventListener('click', function () {
  const element = document.getElementById('pdfContent');
  const opt = { margin: 0.5, filename: 'NUS_Application_Guide.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, scrollY: 0 }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }, pagebreak: { mode: ['css', 'legacy'] } };
  html2pdf().set(opt).from(element).save();
});

renderQuestion(currentStep);
