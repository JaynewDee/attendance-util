const runBtn = document.getElementById("run-btn");
const studentCount = document.getElementById("student-count-input");

window.addEventListener("keydown", (e) => e.key === "Enter" && runBtn.click());

runBtn.addEventListener("click", async (e) => {
  const numStudents = studentCount.value;
  window.close();
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: takeAttendance,
    args: [numStudents]
  });
});

const takeAttendance = (numStudents) => {
  chrome.runtime.sendMessage("init");

  let i = 0;
  while (i < numStudents) {
    chrome.runtime.sendMessage("cycle");
    i++;
  }

  chrome.runtime.sendMessage("cleanup");
};
