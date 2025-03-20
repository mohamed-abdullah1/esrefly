import React from "react";
import ChatContainer from "./_components/chat-container";
import Title from "./_components/title";

const ChatPage = () => {
  return (
    <main className="container mx-auto !py-0">
      <Title />
      <ChatContainer />
    </main>
  );
};

export default ChatPage;
