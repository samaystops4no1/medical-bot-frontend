import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  getChatMessages,
  submitUserMessage,
  createChat,
  bookAppointment,
} from "../utilities/backend";
import React from "react";
import SendButton from "./SendButton";

function ChatArea({ chatId, chats, setChats, setSelectedChatId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [appointmentRequested, setAppointmentRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const currentChatId = useRef(chatId);
  const textFieldRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        textFieldRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAppoinmentBooking = async () => {
    setIsLoading(true);
    setAppointmentRequested(false);

    const appoinmentData = await bookAppointment();

    if (appoinmentData?.error) {
        setError({ message: 'Failed to book appointment. Please try again later.' });
    }

    if (appoinmentData?.data) {
        setMessages([...messages, { role: "UI", content: appoinmentData.data.message }]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      currentChatId.current = chatId;
      getChatMessages(chatId).then((messages) => {
        setMessages(messages);
      });
    } else {
      setMessages([]);
      currentChatId.current = null;
    }
  }, [chatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const updatedMessages = [
        ...messages,
        {
          role: "user",
          content: newMessage.trim(),
        },
      ];

      setAppointmentRequested(false);
      setIsLoading(true);
      setMessages(updatedMessages);
      setNewMessage("");
      setError(null);

      if (!currentChatId.current) {
        const newChatId = Math.floor(100000 + Math.random() * 900000);

        //creating a new chat
        const newChat = await createChat(newChatId, updatedMessages);
        currentChatId.current = newChatId;
        setChats([...chats, newChat]);
        setSelectedChatId(newChatId);
      }

      const response = await submitUserMessage(
        currentChatId.current,
        updatedMessages,
        setMessages,
      );

      if (response?.error) {
        setError({ message: "Failed to generate a response for your query. Please try again later. If the issue persists, please contact support."});
      }

      if (response?.result?.includes("consultation")) {
        setAppointmentRequested(true);
      }
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: "0 auto", // Centers the ChatArea horizontally
      }}
    >
      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {!currentChatId.current ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                fontSize: "64px",
                lineHeight: 1,
              }}
            >
              💬
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Start chatting with the medical bot
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} index={index} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Input Area */}
      {appointmentRequested && (
        <SystemMessage intensity="info" message="It seems like you want to book an appointment. Click here to proceed." clickHandler={handleAppoinmentBooking} />
      )}
      {error && (
        <SystemMessage intensity="error" message={error.message} />
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          gap: 2,
        }}
      >
        <TextField
          inputRef={textFieldRef}
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          disabled={isLoading}
          autoFocus
          sx={{
            "& .MuiInputBase-root": {
              height: "50px",
            },
          }}
        />
        <SendButton isLoading={isLoading} disabled={!newMessage.trim()} />
      </Box>
    </Box>
  );
}

const ChatMessage = React.memo(({ message, index }) => {
  const messageStyles = {
    UI: {
      paper: {
        p: 1.5,
        maxWidth: "70%",
        bgcolor: "grey.100",
        alignSelf: "center",
        mx: "auto",
        borderRadius: 3,
        boxShadow: 1,
        "&:hover": { boxShadow: 2 },
      },
      typography: {
        color: "text.secondary",
        fontWeight: 500,
        whiteSpace: "pre-wrap",
        textAlign: "center",
      },
    },
    user: {
      paper: {
        p: 1.5,
        maxWidth: "70%",
        bgcolor: "primary.light",
        alignSelf: "flex-end",
        ml: "auto",
        mr: 0,
        borderRadius: 3,
        boxShadow: 2,
        "&:hover": { boxShadow: 3 },
      },
      typography: {
        color: "common.white",
        fontWeight: 400,
        whiteSpace: "pre-wrap",
      },
    },
    assistant: {
      paper: {
        p: 1.5,
        maxWidth: "70%",
        bgcolor: "background.paper",
        alignSelf: "flex-start",
        ml: 0,
        mr: "auto",
        borderRadius: 3,
        boxShadow: 2,
        "&:hover": { boxShadow: 3 },
      },
      typography: {
        color: "text.primary",
        fontWeight: 400,
        whiteSpace: "pre-wrap",
      },
    },
  };

  const style = messageStyles[message.role];

  return (
    <Paper key={index} sx={style.paper}>
      <Typography sx={style.typography}>{message.content}</Typography>
    </Paper>
  );
});

const SystemMessage = ({ intensity, message, clickHandler }) => {
    return <Box
    sx={{
      p: 0.5,
      borderRadius: "10px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mx: "5%",
      mb: "10px",
      border: "2px solid",
      borderColor: intensity === "error" ? "#ffcdd2" : "#e3f2fd",
      cursor: clickHandler ? "pointer" : "default",
      "&:hover": {
        bgcolor: "#e3f2fd",
      },
    }}
    onClick={() => {
        if (clickHandler) {
            clickHandler();
        }
    }}
  >
    <Typography
      variant="subtitle1"
      color={intensity === "error" ? "error" : "primary"}
      sx={{
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {message}
    </Typography>
  </Box>
}

export default ChatArea;
