const attachDebugger = (tabId) => chrome.debugger.attach({ tabId }, "1.0");
const keyCommand = (key, tabId) =>
  chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
    type: "keyDown",
    key
  });
const useTab = (tabId) => keyCommand("Tab", tabId);
const useArrowDown = (tabId) => keyCommand("ArrowDown", tabId);
const init = (tabId) => [attachDebugger, useTab, useTab].map((fn) => fn(tabId));
const cycle = (tabId) => [useTab, useTab, useArrowDown].map((fn) => fn(tabId));
const cleanup = async (tabId) => {
  await useTab(tabId);
  await detachDebugger(tabId);
};
const detachDebugger = (tabId) => chrome.debugger.detach({ tabId });

chrome.runtime.onMessage.addListener((message) =>
  chrome.tabs.query({ active: true }, (tabs) => {
    const tabId = tabs[0].id;
    const messageTypes = Object.freeze({
      init,
      cycle,
      cleanup
    });
    return messageTypes[message](tabId);
  })
);
