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

const saveAttendance = (tabId) => {
  useArrowDown(tabId);
  chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter"
  });
};

const attachDebugger = (tabId) => chrome.debugger.attach({ tabId }, "1.0");
const detachDebugger = (tabId) => chrome.debugger.detach({ tabId });

//

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.tabs.query({ active: true }, (tabs) => {
    const tabId = tabs[0].id;
    const messageTypes = {
      attach: attachDebugger,
      pressTab: useTab,
      pressDown: useArrowDown,
      save: saveAttendance,
      detach: detachDebugger
    };
    return messageTypes[message](tabId);
  });

  // if (message.attach) {
  //   chrome.tabs.query({ active: true }, function (tabs) {
  //     const tabId = tabs[0].id;
  //     attachDebugger(tabId);
  //   });
  // }

  // if (message.pressTab) {
  //   chrome.tabs.query({ active: true }, function (tabs) {
  //     const tabId = tabs[0].id;
  //     useTab(tabId);
  //   });
  // }

  // if (message.pressDown) {
  //   chrome.tabs.query({ active: true }, (tabs) => {
  //     const tabId = tabs[0].id;
  //     useArrowDown(tabId);
  //   });
  // }

  // if (message.save) {
  //   chrome.tabs.query({ active: true }, (tabs) => {
  //     const tabId = tabs[0].id;
  //     useArrowDown(tabId);
  //     pressEnter(tabId);
  //   });
  // }
  // if (message.detach) {
  //   chrome.tabs.query({ active: true }, (tabs) => {
  //     const tabId = tabs[0].id;
  //     detachDebugger(tabId);
  //   });
  // }
});
