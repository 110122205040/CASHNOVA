import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { SendHorizontal, Sparkles } from "lucide-react";
import PageContainer from "../components/common/PageContainer";

const AIAssistant = () => {
  const location = useLocation();
  const chatAreaRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#chat-area") {
      chatAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 250);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [location.hash]);

  return (
    <PageContainer>
      <div
        id="chat-area"
        ref={chatAreaRef}
        className="theme-card flex h-[calc(100vh-150px)] flex-col overflow-hidden rounded-[28px] shadow-[0_20px_48px_rgba(176,103,230,0.14)]"
      >
        <div className="theme-panel-strong flex items-center justify-between border-b border-[rgba(203,174,241,0.24)] px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9B84BF]">
              Cashnova AI
            </p>
            <h2 className="mt-2 text-[24px] font-bold tracking-[-0.03em] text-[#24163B]">
              Assistant Workspace
            </h2>
          </div>

          <div className="theme-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#8C79B0]">
            <Sparkles className="h-4 w-4 text-[#9E63FF]" />
            Sync-ready interface
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-6 py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,142,212,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(156,104,255,0.1),transparent_30%)]" />
          <div className="relative flex h-full items-center justify-center">
            <div className="max-w-[480px] text-center">
              <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[linear-gradient(145deg,rgba(255,240,248,0.96),rgba(241,228,255,0.92))] text-[#9E63FF] shadow-[0_16px_32px_rgba(176,103,230,0.14)]">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-[22px] font-bold tracking-[-0.03em] text-[#24163B]">
                Ask for insights, forecasts, and finance help
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#8C79B0]">
                This space is ready for the backend-assisted chat flow. Once connected, responses and context-aware prompts will appear here in the same live theme.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(203,174,241,0.24)] px-6 py-4">
          <div className="theme-panel flex items-center gap-3 rounded-[20px] px-4 py-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="w-full bg-transparent text-sm text-[#281A43] outline-none placeholder:text-[#9C8BB9]"
            />
            <button className="theme-button-primary rounded-xl p-2.5 text-white transition duration-200 active:scale-[0.98]">
              <SendHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AIAssistant;
