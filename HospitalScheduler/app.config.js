// NOTE object below must be a valid JSON
window.HospitalScheduler = $.extend(true, window.HospitalScheduler, {
  "config": {
    "layoutSet": "navbar",
    "navigation": [
      {
        "title": "Scheduler",
        "onExecute": "#Scheduler",
        "icon": "scheduler"
      },
      {
        "title": "Resources",
        "onExecute": "#Resources",
        "icon": "resources"
      }
    ]
  }
});