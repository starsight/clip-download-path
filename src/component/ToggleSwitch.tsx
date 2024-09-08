import { useState, useEffect } from "react"
import { Switch } from "antd"

export function ToggleSwitch() {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    console.log("ToggleSwitch: 初始化")
    chrome.storage.local.get(["copyEnabled"], (result) => {
      console.log("ToggleSwitch: 从存储中获取状态", result)
      setIsEnabled(result.copyEnabled ?? false)
    })
  }, [])

  const handleToggle = (checked: boolean) => {
    console.log("ToggleSwitch: 切换状态", checked)
    setIsEnabled(checked)
    chrome.storage.local.set({ copyEnabled: checked }, () => {
      if (chrome.runtime.lastError) {
        console.error("ToggleSwitch: 保存状态到存储失败", chrome.runtime.lastError)
      } else {
        console.log("ToggleSwitch: 状态已保存到存储")
      }
    })
    
    chrome.runtime.sendMessage({ action: "toggleCopy", enabled: checked }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("ToggleSwitch: 发送消息到background失败", chrome.runtime.lastError)
      } else {
        console.log("ToggleSwitch: 发送消息到background成功", response)
      }
    })
  }

  return (
    <div>
      <span>启用自动复制: </span>
      <Switch checked={isEnabled} onChange={handleToggle} />
    </div>
  )
}