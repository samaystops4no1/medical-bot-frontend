import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  getChatMessages,
  submitUserMessage,
  createChat,
  bookAppointment,
} from "../utilities/backend";
import React from "react";
import ReactMarkdown from "react-markdown";

function ChatArea({ chatId, chats, setChats }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [appointmentRequested, setAppointmentRequested] = useState(false);
  const messagesEndRef = useRef(null);
  const currentChatId = useRef(chatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAppoinmentBooking = async () => {
    console.log("Starting to book appointment");
    const appoinmentData = await bookAppointment();
    console.log(appoinmentData);
    setAppointmentRequested(false);
    setMessages([...messages, { role: "assistant", content: appoinmentData.message }]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("called");
    if (chatId) {
      currentChatId.current = chatId;
      getChatMessages(chatId).then((messages) => {
        setMessages(messages);
      });
    } else {
      console.log("herer");
      setMessages([]);
      currentChatId.current = null;
    }
  }, [chatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
        setAppointmentRequested(false);
      const updatedMessages = [
        ...messages,
        {
          role: "user",
          content: newMessage.trim(),
        },
      ];
      setMessages(updatedMessages);
      setNewMessage("");
      if (!currentChatId.current) {
        const newChatId = Math.floor(100000 + Math.random() * 900000);
        const newChat = await createChat(newChatId, updatedMessages);
        currentChatId.current = newChatId;
        setChats([...chats, newChat]);
        submitUserMessage(
          currentChatId.current,
          updatedMessages,
          setMessages,
          setAppointmentRequested
        );
      } else {
        submitUserMessage(
          currentChatId.current,
          updatedMessages,
          setMessages,
          setAppointmentRequested
        );
      }
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
        <Box
          sx={{
            p: 0.5,
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mx: '5%',
            mb: '10px',
            border: "2px solid",
            borderColor: "#ffcdd2",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "#e3f2fd",
            },
          }}
          onClick={() => {
            //setAppointmentRequested(false);
            handleAppoinmentBooking();
          }}
        >
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            It seems like you want to book an appointment. Click here to proceed.
          </Typography>
        </Box>
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
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
        />
        <Button type="submit" variant="contained" disabled={!newMessage.trim()}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

const ChatMessage = React.memo(({ message, index }) => {
  return (
    <Paper
      key={index}
      sx={{
        p: 1.5,
        maxWidth: "70%",
        bgcolor: message.role === "user" ? "primary.light" : "background.paper",
        alignSelf: message.role === "user" ? "flex-end" : "flex-start",
        ml: message.role === "user" ? "auto" : "0",
        mr: message.role === "user" ? "0" : "auto",
        borderRadius: 3,
        boxShadow: 2,
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <Typography
        sx={{
          color: message.role === "user" ? "common.white" : "text.primary",
          fontWeight: 400,
          whiteSpace: "pre-wrap",
        }}
      >
        {message.content}
      </Typography>
    </Paper>
  );
});

export default ChatArea;
