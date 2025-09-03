function slugify(str){
  return str.toString().toLowerCase().replace(/\s+/g,'-').replace(/[()\/,.]+/g,'').replace(/-+/g,'-').replace(/^-+/, '').replace(/-+$/,'');
}

var surveyFlow = [
  { id:"transfer", question:"Are you currently studying in a tertiary institution / have enrolled in / graduated from a tertiary institution?",
    options:[
      "Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS, UAS)",
      "Overseas tertiary institutions",
      "I am not a current or former undergraduate"
    ],
    next:function(answer){ 
      if(answer==="Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS, UAS)") return "endTransfer";
      if(answer==="Overseas tertiary institutions") return "nationality";
      if(answer==="I am not a current or former undergraduate") return "nationality";
    }
  },
  { id:"nationality", question:"What is your nationality?",
    options:["Singapore Citizen/ Singapore Permanent Resident","Foreigner"],
    next:function(answer){
      if(answer==="Singapore Citizen/ Singapore Permanent Resident") return "qualification";
      if(answer==="Foreigner") return "qualification";
    }
  },
  { id:"qualification", question:"What qualification will you be using to apply to the National University of Singapore (NUS)?",
    options: window.qualificationsData.map(q => q.name).filter(n=>n!=="Transfer"),
    next:function(answer){ return "end_" + slugify(answer);}
  }
];

window.surveyFlow = surveyFlow;

