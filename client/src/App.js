// client/src/App.js

import React from "react";
import Sidebar from "./components/Sidebar";
import ChannelList from "./components/ChannelList";
import ChatPanel from "./components/ChatPanel";
import theme from "./styles/theme";
 
const App = () => {
  return (
    <div style={styles.appContainer}>
      <div style={styles.sidebar}><Sidebar /></div>
      <div style={styles.channelList}><ChannelList /></div>
      <div style={styles.chatPanel}><ChatPanel /></div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: "grid",
    gridTemplateColumns: "72px 240px 1fr",
    height: "100vh",
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.font,
  },
  sidebar: {
    borderRight: `1px solid ${theme.colors.border}`,
    backgroundColor: "#1e1f22",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 0",
  },
  channelList: {
    borderRight: `1px solid ${theme.colors.border}`,
    backgroundColor: "#2b2d31",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
  chatPanel: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};

export default App;
