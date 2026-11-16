import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Zap, Tag, ShieldCheck, FileText } from 'lucide-react';

interface TrustRowProps {
  language: Language;
}

export const TrustRow: React.FC<TrustRowProps> = ({ language }) => {
  const t = translations[language];

  const trustItems = [
    {
      icon: Zap,
      title: t.trustLocal,
      desc: t.trustLocalDesc,
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      icon: Tag,
      title: t.trustBhaav,
      desc: t.trustBhaavDesc,
      iconColor: 'text-brass'
    },
    {
      icon: ShieldCheck,
      title: t.trustArtisans,
      desc: t.trustArtisansDesc,
      iconColor: 'text-slate-deep dark:text-zinc-300'
    },
    {
      icon: FileText,
      title: t.trustGst,
      desc: t.trustGstDesc,
      iconColor: 'text-brick dark:text-brick-light'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-surface dark:bg-charcoal-800 border border-subtle rounded p-4">
        {trustItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-start gap-3 p-2">
              <div className="w-8 h-8 rounded bg-concrete dark:bg-charcoal-700 border border-subtle flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div>
                <h4 className="text-xs font-heading font-semibold text-ink dark:text-zinc-100">
                  {item.title}
                </h4>
                <p className="text-[11px] text-ink-muted dark:text-zinc-400 mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
