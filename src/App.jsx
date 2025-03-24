import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Tooltip, Divider } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ChatList from "./components/ChatList";
import GroupsIcon from "@mui/icons-material/Groups";
import AppointmentList from "./components/AppointmentList";

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState("home");

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Left Navigation */}
        <Box
          sx={{
            width: 45,
            bgcolor: "primary.main",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
            gap: 2,
          }}
        >
          <Tooltip title="Chat" disableInteractive>
            <ChatIcon
              sx={{
                color: "white",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={() => handleNavigation("home")}
            />
          </Tooltip>
          <Divider sx={{ width: "100%", bgcolor: "white" }} />
          <Tooltip title="Appointments" disableInteractive>
            <GroupsIcon
              sx={{
                color: "white",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={() => handleNavigation("appointments")}
            />
          </Tooltip>
          <Divider sx={{ width: "100%", bgcolor: "white" }} />
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {currentView === "home" && <ChatList mode="chat" />}
          {currentView === "appointments" && <AppointmentList mode="appointment" /> }
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
