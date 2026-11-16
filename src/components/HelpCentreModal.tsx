import React, { useState } from 'react';
import { HelpArticle, Language } from '../types';
import { translations } from '../data/translations';
import { INITIAL_HELP_ARTICLES } from '../data/help';
import {
  X,
  HelpCircle,
  MessageSquare,
  Send,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

interface HelpCentreModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenLegal: (type: 'terms' | 'privacy' | 'returns' | 'scratchAdvisory') => void;
}

export const HelpCentreModal: React.FC<HelpCentreModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenLegal
}) => {
  const t = translations[language];

  const [articles] = useState<HelpArticle[]>(INITIAL_HELP_ARTICLES);
  const [expandedId, setExpandedId] = useState<string | null>('help-1');

  // Contact Support State
  const [issueCategory, setIssueCategory] = useState('Order Tracking');
  const [supportMessage, setSupportMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setTicketSubmitted(true);
    setSupportMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-brass/15 text-brass flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
                {t.helpCentre}
              </h2>
              <p className="text-xs text-ink-muted dark:text-zinc-400">
                Frequently Asked Questions, Order Support & Policy Guidelines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Policy Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onOpenLegal('terms')}
              className="py-1 px-2.5 bg-concrete dark:bg-charcoal-700 hover:border-brass border border-subtle rounded text-ink dark:text-zinc-200"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="py-1 px-2.5 bg-concrete dark:bg-charcoal-700 hover:border-brass border border-subtle rounded text-ink dark:text-zinc-200"
            >
              Privacy Policy (DPDP Act)
            </button>
            <button
              onClick={() => onOpenLegal('returns')}
              className="py-1 px-2.5 bg-concrete dark:bg-charcoal-700 hover:border-brass border border-subtle rounded text-ink dark:text-zinc-200"
            >
              7-Day Returns Policy
            </button>
            <button
              onClick={() => onOpenLegal('scratchAdvisory')}
              className="py-1 px-2.5 bg-concrete dark:bg-charcoal-700 hover:border-brass border border-subtle rounded text-ink dark:text-zinc-200"
            >
              Scratch Card Guidelines
            </button>
          </div>

          {/* Accordion FAQs */}
          <div className="space-y-2.5">
            <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200">
              Popular Help Topics
            </h3>

            {articles.map((art) => {
              const isExpanded = expandedId === art.id;
              return (
                <div
                  key={art.id}
                  className="border border-subtle rounded overflow-hidden bg-concrete/30 dark:bg-charcoal-700/30"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : art.id)}
                    className="w-full p-3 text-left font-semibold text-ink dark:text-zinc-100 flex justify-between items-center hover:bg-concrete/60 dark:hover:bg-charcoal-700/60 transition"
                  >
                    <span>{art.question}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-brass' : 'text-ink-muted'}`} />
                  </button>
                  {isExpanded && (
                    <div className="p-3 pt-1 border-t border-subtle text-ink-muted dark:text-zinc-300 leading-relaxed bg-surface dark:bg-charcoal-800">
                      {art.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Support Form */}
          <div className="p-4 bg-concrete/60 dark:bg-charcoal-900 border border-subtle rounded space-y-3">
            <h3 className="font-heading font-semibold uppercase tracking-wider text-ink dark:text-zinc-200 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-brass" />
              <span>Contact Live Customer Desk</span>
            </h3>

            {ticketSubmitted ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ticket registered! Our support representative will contact you via WhatsApp / SMS within 15 minutes.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-ink-muted mb-1">
                    Support Category
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-surface dark:bg-charcoal-800 border border-subtle rounded text-xs"
                  >
                    <option value="Order Tracking">Order & Same-Day Dispatch</option>
                    <option value="Bhaav-Taav Bargain">Bhaav-Taav Bargain Issue</option>
                    <option value="Return / Exchange">7-Day Return / Exchange Request</option>
                    <option value="Scratch Card Reward">Scratch Card Reward Claim</option>
                    <option value="Seller Grievance">Seller or Kirana Complaint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-ink-muted mb-1">
                    Describe your query or order ID
                  </label>
                  <textarea
                    rows={2}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Enter order ID or explain your query..."
                    className="w-full px-2.5 py-1.5 bg-surface dark:bg-charcoal-800 border border-subtle rounded text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="py-1.5 px-4 bg-slate-deep hover:bg-slate-hover text-white font-semibold uppercase tracking-wider rounded flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-brass" />
                  <span>Submit Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-concrete hover:bg-zinc-200 dark:bg-charcoal-700 text-ink dark:text-zinc-200 text-xs font-semibold uppercase rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
