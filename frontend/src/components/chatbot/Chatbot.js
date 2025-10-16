import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatWindow from "./ChatWindow";
import companyInfo from "./company_data/companyInfo";
import { GoogleGenerativeAI } from "@google/generative-ai";
 
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";
// Max chars from company text to include in the prompt (adjust if you hit model limits)
const MAX_COMPANY_CHARS = 3800;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I’m the Stoic & Salamander assistant. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep a single chat session alive so context is preserved
  const chatRef = useRef(null);

  async function ensureChat() {
    if (!API_KEY) {
      throw new Error("Missing REACT_APP_GEMINI_API_KEY in .env.local");
    }
    if (!chatRef.current) {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Seed chat with an instruction so it stays on-topic.
      chatRef.current = model.startChat({
         history: [
          {
            role: "user",
            parts: [
              {
                text:
                  "You are an assistant for Stoic & Salamander. You must answer only using the company information supplied with each user question. If the info doesn't cover the question, say you don't have that information and suggest contacting office@stoicsalamander.com."
              }
            ]
          },
          {
            role: "model",
            parts: [{ text: "Understood — I will only use the provided company information to answer." }]
          }
        ]
      });
    }
  }

  // Utility: safely trim company text for prompt
function getCompanyTextSnippet() {
  const entries = [];

  entries.push(`Name: ${companyInfo.name}`);
  entries.push(`Tagline: ${companyInfo.tagline}`);
  entries.push(`Industry: ${companyInfo.industry}`);
  entries.push(`Founded: ${companyInfo.founded}`);
  entries.push(`Headquarters: ${companyInfo.headquarters}`);
  entries.push(`Company Size: ${companyInfo.companySize}`);
  entries.push(`Website: ${companyInfo.website}`);
  entries.push(`Phone: ${companyInfo.phone}`);
  entries.push(`Email: ${companyInfo.email}`);

  if (companyInfo.offices) {
    entries.push("Offices:");
    companyInfo.offices.forEach((o) =>
      entries.push(`- ${o.type}: ${o.address}`)
    );
  }

  if (companyInfo.leadership) {
    entries.push("Leadership:");
    companyInfo.leadership.forEach((p) =>
      entries.push(`- ${p.name}, ${p.role}`)
    );
  }

  if (companyInfo.specialties) {
    entries.push("Specialties: " + companyInfo.specialties.join(", "));
  }

  if (companyInfo.products) {
    entries.push("Products: " + companyInfo.products.join(", "));
  }

  if (companyInfo.metrics) {
    entries.push(
      `Metrics: ${companyInfo.metrics.yearsOfExcellence} years, ${companyInfo.metrics.organizationsServed} orgs, ${companyInfo.metrics.projectsDelivered} projects, ${companyInfo.metrics.clientSatisfaction} satisfaction`
    );
    if (companyInfo.metrics.awards) {
      entries.push("Awards: " + companyInfo.metrics.awards.join(", "));
    }
  }

  if (companyInfo.industriesServed) {
    entries.push("Industries: " + companyInfo.industriesServed.join(", "));
  }

  if (companyInfo.careerGrowth) {
    entries.push("Career Growth: " + companyInfo.careerGrowth.description);
    entries.push("Domains: " + companyInfo.careerGrowth.domains.join(", "));
    entries.push("Programs: " + companyInfo.careerGrowth.programs.join(", "));
  }

  if (companyInfo.sustainability) {
    entries.push("Sustainability: " + companyInfo.sustainability.philosophy);
    entries.push("Initiatives: " + companyInfo.sustainability.initiatives.join(", "));
  }

  if (companyInfo.media) {
    entries.push("Media Recognition: " + companyInfo.media.recognition.join(", "));
  }

  if (companyInfo.support) {
    entries.push("Support: " + companyInfo.support.description);
    entries.push("Channels: " + companyInfo.support.channels.join(", "));
    if (companyInfo.support.faq) {
      entries.push("FAQ:");
      companyInfo.support.faq.forEach((f) =>
        entries.push(`Q: ${f.q} A: ${f.a}`)
      );
    }
  }

  if (companyInfo.summary) {
    entries.push("Summary: " + companyInfo.summary);
  }

  let text = entries.join("\n");
  if (text.length > MAX_COMPANY_CHARS) {
    text = text.slice(0, MAX_COMPANY_CHARS) + "\n\n[...truncated...]";
  }

  return text;
}

// send function
 async function onSend(e) {
  e.preventDefault();
  const content = input.trim();
  if (!content) return;

  setMessages((m) => [...m, { role: "user", text: content }]);
  setInput("");
  setLoading(true);

  try {
    await ensureChat();
    const companySnippet = getCompanyTextSnippet();

    // Heuristic: detect if it's a company-related question
    const lowerQ = content.toLowerCase();
    const isCompanyQ =
      lowerQ.includes("stoic") ||
      lowerQ.includes("salamander") ||
      lowerQ.includes("office") ||
      lowerQ.includes("career") ||
      lowerQ.includes("job") ||
      lowerQ.includes("ceo") ||
      lowerQ.includes("founder") ||
      lowerQ.includes("product") ||
      lowerQ.includes("service") ||
      lowerQ.includes("contact") ||
      lowerQ.includes("support");

    let combinedPrompt;
    if (isCompanyQ) {
      combinedPrompt = `
Company information (use ONLY this to answer; do NOT invent facts):
${companySnippet}

User question:
"${content}"

REPLY INSTRUCTIONS:
- Use only the company information above.
- If the answer is present in the company info, answer concisely and cite the relevant short phrase (one sentence).
- If the company info does not contain the answer, respond: "I don't have that information in the company data. Please contact office@stoicsalamander.com for details."
- Keep the answer polite and helpful.
`;
    } else {
      combinedPrompt = `
The user is asking a general question not related to company data. 
Answer briefly and clearly, in 1–3 sentences max.

User question:
"${content}"
`;
    }

    // send to Gemini
    const result = await chatRef.current.sendMessage(combinedPrompt, {
      timeout: 120000,
    });
    const reply =
      (await result.response.text())?.trim() || "Sorry, no reply.";

    setMessages((m) => [...m, { role: "assistant", text: reply }]);
  } catch (err) {
    console.error("Error with Gemini request:", err);
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        text: "Sorry — can't reach the AI right now. Check API key or network.",
      },
    ]);
  } finally {
    setLoading(false);
  }
}


  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          borderRadius: "999px",
          background: "#4c6fff",
          color: "#fff",
          width: 64,
          height: 64,
          fontSize: 26,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 12px 30px rgba(76,111,255,0.35)",
          zIndex: 40
        }}
      >
        💬
      </motion.button>

      {/* Chat Window (animated mount/unmount) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <ChatWindow
              messages={messages}
              loading={loading}
              input={input}
              setInput={setInput}
              onSend={onSend}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
