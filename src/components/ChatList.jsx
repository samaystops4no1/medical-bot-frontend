import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { getChatList } from "../utilities/backend";
import ListNavigation from "./ListNavigation";
import ChatArea from "./ChatArea";

/**
 * @returns
 */
function ChatList({}) {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    getChatList().then((chatList) => {
      setChats(chatList);
    });
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <ListNavigation
        listArray={chats}
        emptyMessage="No existing chats found"
        setSelectedItem={setSelectedChatId}
        mode="chat"
      />
      <ChatArea chatId={selectedChatId} chats={chats} setChats={setChats} setSelectedChatId={setSelectedChatId} />
    </Box>
  );
}

export default ChatList;
