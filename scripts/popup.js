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
  chrome.runtime.sendMessage("attach");
  chrome.runtime.sendMessage("pressTab");
  chrome.runtime.sendMessage("pressTab");

  let i = 0;
  while (i < numStudents) {
    chrome.runtime.sendMessage("pressTab");
    chrome.runtime.sendMessage("pressTab");
    chrome.runtime.sendMessage("pressDown");
    i++;
  }

  chrome.runtime.sendMessage("save");
  chrome.runtime.sendMessage("detach");
};
