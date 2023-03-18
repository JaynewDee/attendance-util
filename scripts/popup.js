const runBtn = document.getElementById("run-btn");
const studentCount = document.getElementById("student-count-input");

window.addEventListener("keydown", (e) => e.key === "Enter" && runBtn.click());

const execute = async (_) => {
  const numStudents = studentCount.value;
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: takeAttendance,
    args: [numStudents]
  });
  await chrome.runtime.sendMessage("cleanup");
  window.close();
};

runBtn.addEventListener("click", execute);

const takeAttendance = async (numStudents) => {
  await chrome.runtime.sendMessage("init");
  let i = 0;
  while (i < numStudents) {
    await chrome.runtime.sendMessage("cycle");
    i++;
  }
};
