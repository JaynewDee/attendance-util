const { init, cycle, cleanup } = Object.freeze({
  attachDebugger: (tabId) => chrome.debugger.attach({ tabId }, "1.0"),
  keyCommand: (key, tabId) =>
    chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
      type: "keyDown",
      key
    }),
  useTab: (tabId) => keyCommand("Tab", tabId),
  useArrowDown: (tabId) => keyCommand("ArrowDown", tabId),
  init: (tabId) => [attachDebugger, useTab, useTab].map((fn) => fn(tabId)),
  cycle: (tabId) => [useTab, useTab, useArrowDown].map((fn) => fn(tabId)),
  cleanup: async (tabId) => {
    await useTab(tabId);
    await detachDebugger(tabId);
  },
  detachDebugger: (tabId) => chrome.debugger.detach({ tabId })
});

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
