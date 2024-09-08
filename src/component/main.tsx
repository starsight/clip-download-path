import { useState, useEffect } from "react"
import { Button, message } from "antd"
import { CopyOutlined } from "@ant-design/icons"
import { ToggleSwitch } from "./ToggleSwitch"

export function Main() {
  const [latestPath, setLatestPath] = useState<string>("")

  useEffect(() => {
    chrome.downloads.search({state: 'complete'}, function(downloads) {
        const validDownloads = downloads.filter(download => download.exists);
        if (validDownloads.length > 0) {
            const latestDownload = validDownloads.sort((a, b) => {
                return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
            })[0];
            setLatestPath(latestDownload.filename)
        } else {
            setLatestPath('')
        }
    });
  }, [])

  const copyToClipboard = async () => {
    if (!latestPath) {
      message.warning("没有可复制的路径")
      return
    }
    try {
      await navigator.clipboard.writeText(latestPath)
      message.success("路径已复制到剪贴板")
    } catch (err) {
      message.error("复制失败")
    }
  }

  return (
    <div>
      <ToggleSwitch />
      <p>最新下载文件路径:</p>
      <p style={{ wordBreak: "break-all" }}>{latestPath || "暂无下载记录"}</p>
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