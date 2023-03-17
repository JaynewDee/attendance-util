const attachDebugger = (tabId) => chrome.debugger.attach({ tabId }, "1.0");
const detachDebugger = (tabId) => chrome.debugger.detach({ tabId });

const keyCommand = (key, tabId) =>
  chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
    type: "keyDown",
    key
  });

const useTab = (tabId) => keyCommand("Tab", tabId);
const useArrowDown = (tabId) => keyCommand("ArrowDown", tabId);
const useEnter = (tabId) => keyCommand("Enter", tabId);

const init = (tabId) => {
  attachDebugger(tabId);
  useTab(tabId);
  useTab(tabId);
};

const cycle = (tabId) => {
  useTab(tabId);
  useTab(tabId);
  useArrowDown(tabId);
};

const cleanup = (tabId) => {
  useTab(tabId);
  detachDebugger(tabId);
};

chrome.runtime.onMessage.addListener((message) => {
  chrome.tabs.query({ active: true }, (tabs) => {
    const tabId = tabs[0].id;
    const messageTypes = {
      init,
      cycle,
      cleanup
    };
    return messageTypes[message](tabId);
  });
});
