const attachDebugger = (tabId) => chrome.debugger.attach({ tabId }, "1.0");
const detachDebugger = (tabId) => chrome.debugger.detach({ tabId });

const useTab = (tabId) =>
  chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Tab"
  });

const useArrowDown = (tabId) =>
  chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "ArrowDown"
  });

const useEnter = (tabId) =>
  chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter"
  });

const saveAttendance = (tabId) => {
  useTab(tabId);
  detachDebugger(tabId);
};

const useCycle = (tabId) => {
  useTab(tabId);
  useTab(tabId);
  useArrowDown(tabId);
};

const initialize = (tabId) => {
  attachDebugger(tabId);
  useTab(tabId);
  useTab(tabId);
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.tabs.query({ active: true }, (tabs) => {
    const tabId = tabs[0].id;
    const messageTypes = {
      init: initialize,
      cycle: useCycle,
      save: saveAttendance
    };
    return messageTypes[message](tabId);
  });
});
