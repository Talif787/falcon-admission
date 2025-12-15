// frontend/src/app/interview/[sessionId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Loader2, CheckCircle, XCircle, Bot, User } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export default function InterviewPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [outcome, setOutcome] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [program, setProgram] = useState<string>("");
  const [showProgramSelect, setShowProgramSelect] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

    const initializeChat = useCallback(async () => {
    try {
      setIsInitializing(true);

      const response = await fetch(
        `http://localhost:5000/api/chat/${sessionId}/init`
      );
      const data = await response.json();

      if (data.success) {
        setMessages([
          {
            role: "assistant",
            content: data.data.message,
            timestamp: new Date(),
          },
        ]);

        if (
          data.data.message.toLowerCase().includes("business") &&
          data.data.message.toLowerCase().includes("computer science")
        ) {
          setShowProgramSelect(true);
        }
      } else {
        toast.error(data.message || "Failed to initialize chat");
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Failed to connect to server");
    } finally {
      setIsInitializing(false);
    }
  }, [sessionId]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };



  const selectProgram = async (selectedProgram: string) => {
    setProgram(selectedProgram);
    setShowProgramSelect(false);

    // Send program selection as first message
    await sendMessage(
      `I'm interested in the ${selectedProgram} program`,
      selectedProgram
    );
  };

  const sendMessage = async (
    messageText?: string,
    selectedProgram?: string
  ) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading || isCompleted) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/${sessionId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: textToSend,
            program: selectedProgram || program,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Check if interview completed
        if (data.data.completed) {
          setIsCompleted(true);
          setOutcome(data.data.outcome);
          setSummary(data.data.summary);
        }
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Initializing interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Falcon University
              </h1>
              <p className="text-sm text-gray-600">Admission Interview</p>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-2">
                {outcome === "Meets Criteria" ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Eligible</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Not Eligible</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-white rounded-lg shadow-sm p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user" ? "bg-blue-100" : "bg-purple-100"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-5 h-5 text-blue-600" />
                ) : (
                  <Bot className="w-5 h-5 text-purple-600" />
                )}
              </div>

              <div
                className={`flex-1 max-w-[70%] ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
                <p
                  className={`text-xs text-gray-500 mt-1 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {format(new Date(message.timestamp), "HH:mm")}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-100">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Program Selection */}
        {showProgramSelect && !isCompleted && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-blue-200">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Please select your program of interest:
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => selectProgram("Business")}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Business
              </button>
              <button
                onClick={() => selectProgram("Computer Science")}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Computer Science
              </button>
            </div>
          </div>
        )}

        {/* Completion Summary */}
        {isCompleted && (
          <div
            className={`mb-4 p-4 rounded-lg border ${
              outcome === "Meets Criteria"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p
              className={`text-sm font-medium mb-2 ${
                outcome === "Meets Criteria" ? "text-green-900" : "text-red-900"
              }`}
            >
              Interview Complete
            </p>
            <p
              className={`text-sm ${
                outcome === "Meets Criteria" ? "text-green-800" : "text-red-800"
              }`}
            >
              {summary}
            </p>
            <a
              href="/admin"
              className="inline-block mt-3 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Admin Dashboard
            </a>
          </div>
        )}

        {/* Input */}
        {!isCompleted && !showProgramSelect && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm p-4"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
