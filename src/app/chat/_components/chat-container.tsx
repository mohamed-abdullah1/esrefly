"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { useTranslations } from "next-intl";
import isSiteArabic from "@/lib/is-site-arabic";
import * as signalR from "@microsoft/signalr";
import { fetchMetadata, fetchPromptHistory } from "@/actions/incomes";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/loading-spinner";
import { isTodayTargetDate } from "@/lib/is-today";

const ChatContainer = () => {
  const { data: metadata, isPending: metaDataIsPending } = useQuery({
    queryKey: ["metadata"],
    queryFn: fetchMetadata,
  });
  const { data: prompts, isPending: promptsIsPending } = useQuery({
    queryKey: ["prompts"],
    queryFn: fetchPromptHistory,
  });

  const t = useTranslations();
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! How can I help you today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const isConnectionStarted = useRef(false);
  const currentResponseId = useRef<number | null>(null);

  useEffect(() => {
    console.log("🔥✨ ", { prompts });

    if (!Array.isArray(prompts)) {
      // If prompts is not an array or prompts[0] is not an array, set messages to an empty array
      setMessages([]);
      return;
    }
    console.log("🔥✨ ", prompts[0].prompts);
    let allMessages = [
      { id: 1, content: "Hello! How can I help you today?", sender: "ai" },
    ];
    prompts
      .find((p) => isTodayTargetDate(p.createdDate))
      ?.prompts.forEach((prompt) => {
        const prompt1 = {
          id: prompt.createdDate.length + prompt.prompt.length + Math.random(),
          content: prompt.prompt,
          sender: "user",
        };
        const response = {
          id:
            prompt.createdDate.length + prompt.response.length + Math.random(),
          content: prompt.response,
          sender: "ai",
        };
        allMessages = [...allMessages, prompt1, response];
      });

    setMessages([...allMessages]);
  }, [prompts]); // Add prompts to the dependency array

  useEffect(() => {
    let newConnection: signalR.HubConnection | null = null;

    if (metadata?.data.externalId) {
      newConnection = new signalR.HubConnectionBuilder()
        .withUrl(
          process.env.NEXT_PUBLIC_BACKEND +
            "/agent" +
            `?userId=${metadata?.data.externalId}`
        )
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      setConnection(newConnection);
    }

    const startConnection = async () => {
      if (
        newConnection?.state === signalR.HubConnectionState.Disconnected &&
        !isConnectionStarted.current
      ) {
        try {
          await newConnection.start();
          console.log("SignalR Connected");
          isConnectionStarted.current = true;
          setupMessageHandler(newConnection);
        } catch (err) {
          console.error("SignalR Connection Error: ", err);
        }
      }
    };

    startConnection();

    return () => {
      if (newConnection) {
        newConnection.stop();
        isConnectionStarted.current = false;
      }
    };
  }, [metadata?.data.externalId]);

  const setupMessageHandler = (conn: signalR.HubConnection) => {
    conn.on("ReceiveMessage", (word: string) => {
      console.log("Received word:", word);

      // Clean the word and handle \n
      const cleanedWord = word.trim();
      const normalizedWord = cleanedWord
        .replace("es ref ly", "Esrefly")
        .replace("budget ing", "budgeting");

      setMessages((prevMessages) => {
        if (!currentResponseId.current) {
          const newMessageId = prevMessages.length + 1;
          currentResponseId.current = newMessageId;
          return [
            ...prevMessages,
            {
              id: newMessageId,
              content: normalizedWord,
              sender: "ai",
            },
          ];
        } else {
          return prevMessages.map((msg) => {
            if (msg.id === currentResponseId.current) {
              const currentContent = msg.content;
              // If the word is \n, append as a newline marker; otherwise, append as a word
              const newContent =
                normalizedWord === "\n"
                  ? `${currentContent}\n`
                  : currentContent.endsWith("\n")
                  ? `${currentContent}${normalizedWord}`
                  : `${currentContent} ${normalizedWord}`;
              return {
                ...msg,
                content: newContent,
              };
            }
            return msg;
          });
        }
      });

      setIsLoading(false);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !connection) return;

    const newMessageId = messages.length + 1; // Fixed: Increment ID correctly
    setMessages((prev) => [
      ...prev,
      {
        id: newMessageId,
        content: input,
        sender: "user",
      },
    ]);

    setIsLoading(true);
    setInput("");
    currentResponseId.current = null;

    try {
      if (connection.state === signalR.HubConnectionState.Connected) {
        console.log("Sending prompt:", input);
        await connection.invoke("SendPrompt", metadata?.data.externalId, input);
      } else {
        console.warn("Connection not active, retrying to start...");
        await connection.start();
        await connection.invoke("SendPrompt", metadata?.data.externalId, input);
      }
    } catch (err) {
      console.error("Error sending message: ", err);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: t("error-message"),
          sender: "ai",
        },
      ]);
    }
  };
  // Function to render content with newlines
  const renderContent = (content: string) => {
    return content.split("\n").map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  return metaDataIsPending || promptsIsPending ? (
    <div className="grid place-content-center ">
      <Spinner className="!w-7 !h-7 !border-[3px] " />
    </div>
  ) : (
    <div className=" border bg-background rounded-lg flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatMessageList className="overflow-y-scroll max-h-[63vh]">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              {message.sender === "user" ? (
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  fallback={"ME"}
                />
              ) : (
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src={"/logos/small-esrefly.svg"}
                  fallback={"AI"}
                />
              )}
              <ChatBubbleMessage
                className="text-xs lg:text-base"
                variant={message.sender === "user" ? "sent" : "received"}
              >
                {renderContent(message.content)}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={"/logos/small-esrefly.svg"}
                fallback="AI"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>

      <div className="p-4 border-t">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("message-placeholder")}
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex">
              {/* Add file attachment or microphone buttons here if needed */}
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={
                !connection ||
                connection.state !== signalR.HubConnectionState.Connected
              }
              className={`${isSiteArabic() ? "mr-auto" : "ml-auto"} gap-1.5`}
            >
              {t("send-message")}
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
