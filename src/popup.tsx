import { useEffect } from "react"
import "antd/dist/reset.css"
import { Layout, Typography } from "antd"
import { Main } from "~src/component/main"

const { Header, Content, Footer } = Layout
const { Title } = Typography

function IndexPopup() {
  useEffect(() => {
    document.body.style.width = "400px"
    document.body.style.height = "300px"
  }, [])

  return (
    <Layout style={{ height: "100%" }}>
      <Header style={{ background: "#fff", padding: "0 16px" }}>
        <Title level={4}>Clip Download Path</Title>
      </Header>
      <Content style={{ padding: "16px" }}>
        <Main />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Clip Download Path ©2023 Created by You
      </Footer>
    </Layout>
  )
}

export default IndexPopup