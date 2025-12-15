// frontend/src/app/interview/[sessionId]/page.tsx
// PRODUCTION-SAFE VERSION
// - Uses NEXT_PUBLIC_API_URL (falls back to localhost for local dev)
// - No hook dependency warnings
// - Defensive fetch + JSON parsing
// - Keeps your UI/logic intact

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Send, Loader2, CheckCircle, XCircle, Bot, User } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

type InitResponse = {
  success?: boolean;
  message?: string;
  data?: { message?: string; sessionId?: string };
};

type SendResponse = {
  success?: boolean;
  message?: string;
  data?: {
    message?: string;
    completed?: boolean;
    outcome?: string;
    summary?: string;
  };
};

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Unexpected error";
};

export default function InterviewPage() {
  const params = useParams();
  const sessionId = String(params.sessionId || "");

  const API_BASE_URL = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return raw.replace(/\/$/, "");
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [summary, setSummary] = useState("");
  const [program, setProgram] = useState("");
  const [showProgramSelect, setShowProgramSelect] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const initializeChat = useCallback(async () => {
    if (!sessionId) return;

    try {
      setIsInitializing(true);

      const response = await fetch(`${API_BASE_URL}/api/chat/${sessionId}/init`, {
        method: "GET",
      });

      let data: InitResponse | null = null;
      try {
        data = (await response.json()) as InitResponse;
      } catch {
        data = null;
      }

      if (!response.ok || data?.success === false) {
        toast.error(data?.message || `Failed to initialize (HTTP ${response.status})`);
        return;
      }

      const greeting = data?.data?.message || "Welcome!";
      setMessages([
        {
          role: "assistant",
          content: greeting,
          timestamp: new Date(),
        },
      ]);

      const lower = greeting.toLowerCase();
      if (lower.includes("business") && lower.includes("computer science")) {
        setShowProgramSelect(true);
      } else {
        setShowProgramSelect(false);
      }
    } catch (err: unknown) {
      console.error("Error initializing chat:", err);
      toast.error(getErrorMessage(err) || "Failed to connect to server");
    } finally {
      setIsInitializing(false);
    }
  }, [API_BASE_URL, sessionId]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const sendMessage = useCallback(
    async (messageText?: string, selectedProgram?: string) => {
      const textToSend = (messageText ?? inputMessage).trim();
      if (!textToSend || isLoading || isCompleted || !sessionId) return;

      const userMessage: Message = {
        role: "user",
        content: textToSend,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/${sessionId}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: textToSend,
            program: selectedProgram || program,
          }),
        });

        let data: SendResponse | null = null;
        try {
          data = (await response.json()) as SendResponse;
        } catch {
          data = null;
        }

        if (!response.ok || data?.success === false) {
          toast.error(data?.message || `Failed to send (HTTP ${response.status})`);
          return;
        }

        const reply = data?.data?.message || "OK";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: reply, timestamp: new Date() },
        ]);

        if (data?.data?.completed) {
          setIsCompleted(true);
          setOutcome(data?.data?.outcome || "");
          setSummary(data?.data?.summary || "");
        }
      } catch (err: unknown) {
        console.error("Error sending message:", err);
        toast.error(getErrorMessage(err) || "Failed to send message");
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [API_BASE_URL, inputMessage, isLoading, isCompleted, sessionId, program]
  );

  const selectProgram = useCallback(
    async (selectedProgram: string) => {
      setProgram(selectedProgram);
      setShowProgramSelect(false);
      await sendMessage(`I'm interested in the ${selectedProgram} program`, selectedProgram);
    },
    [sendMessage]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void sendMessage();
    },
    [sendMessage]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void sendMessage();
      }
    },
    [sendMessage]
  );

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
              <h1 className="text-xl font-bold text-gray-900">Falcon University</h1>
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
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
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
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
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
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
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
                onClick={() => void selectProgram("Business")}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Business
              </button>
              <button
                onClick={() => void selectProgram("Computer Science")}
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
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4">
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
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
