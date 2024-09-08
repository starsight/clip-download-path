import { useState, useEffect } from "react"
import { Button, message } from "antd"
import { CopyOutlined } from "@ant-design/icons"

export function Main() {
  const [latestPath, setLatestPath] = useState<string>("")

  useEffect(() => {
    // 获取最新下载文件的路径
    chrome.downloads.search({ limit: 1, orderBy: ["-startTime"] }, (results) => {
      if (results.length > 0 && results[0].filename) {
        setLatestPath(results[0].filename)
      }
    })
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(latestPath)
      message.success("路径已复制到剪贴板")
    } catch (err) {
      message.error("复制失败")
    }
  }

  return (
    <div>
      <p>最新下载文件路径:</p>
      <p style={{ wordBreak: "break-all" }}>{latestPath}</p>
      <Button
        icon={<CopyOutlined />}
        onClick={copyToClipboard}
        disabled={!latestPath}
      >
        复制路径
      </Button>
    </div>
  )
}