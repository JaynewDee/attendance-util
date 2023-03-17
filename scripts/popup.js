const runBtn = document.getElementById("run-btn");

runBtn.addEventListener("click", async (e) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  e.preventDefault();
  // window.close();
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: takeAttendance
  });
});

const takeAttendance = () => {
  const numStudents = 48;
  chrome.runtime.sendMessage("init");

  let i = 0;
  while (i < numStudents) {
    chrome.runtime.sendMessage("cycle");
    i++;
  }

  chrome.runtime.sendMessage("save");
};
