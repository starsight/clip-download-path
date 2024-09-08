export { }

console.log("Background script 已加载")

let copyDisabled = false

// 初始化时从存储中读取copyDisabled的值
chrome.storage.local.get(["copyDisabled"], (result) => {
  copyDisabled = result.copyDisabled ?? false
  console.log("Background: 初始化copyDisabled值为", copyDisabled)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background: 收到消息", message, "来自", sender)
  if (message && message.action === "toggleCopy") {
    copyDisabled = message.disabled
    console.log("Background: 复制功能已", copyDisabled ? "禁用" : "启用")
    sendResponse({ status: "success", received: true })
    return true  // 表示我们将异步发送响应
  }
})

// 监听下载完成事件
chrome.downloads.onChanged.addListener((delta) => {
  if (!copyDisabled && delta.state && delta.state.current === "complete") {
    // 获取下载的文件信息
    chrome.downloads.search({ id: delta.id }, (results) => {
      if (results && results.length > 0) {
        const filePath = results[0].filename;
        console.log("下载 success: ", results[0]);
        // 复制路径到剪贴板
        copyToClipboard(filePath);
      }
    });
  }
});

function copyToClipboard(text) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: textToClipboard,
        args: [text]
      }, (results) => {
        if (chrome.runtime.lastError) {
          handleClipboardError('执行脚本失败: ' + chrome.runtime.lastError.message);
        } else {
          console.log('路径已复制到剪贴板, path: ' + text);
          // notifyUser('文件路径已复制到剪贴板');
        }
      });
    } else {
      handleClipboardError('没有找到活动标签页');
    }
  });
}

function handleClipboardError(errorMessage) {
  console.error(errorMessage);
  notifyUser('复制文件路径失败: ' + errorMessage);
}

function textToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('主方案 copy to clipboard successfully');
    }).catch(err => {
      console.error('主方案 Failed to copy!!: ', err);
      // 回退到 document.execCommand('copy')
      fallbackCopyToClipboard(text);
    });
  } else {
      // 回退到 document.execCommand('copy')
      fallbackCopyToClipboard(text);
  }

  function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    // textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('备用方案 copy to clipboard ' + msg);
    } catch (err) {
      console.error('备用方案: Failed to copy', err);
    }
    document.body.removeChild(textArea);
  }
}

function notifyUser(message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',  // 确保这个文件存在
    title: '下载完成',
    message: message
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('通知创建失败:', chrome.runtime.lastError);
    } else {
      console.log('通知已创建，ID:', notificationId);
    }
  });
}
