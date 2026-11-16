import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import {
  Grid,
  Smartphone,
  Shirt,
  Home,
  ShoppingBag,
  Sparkles,
  Palette,
  BookOpen,
  HeartPulse
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  language: Language;
  onOpenCommunity?: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  language,
  onOpenCommunity
}) => {
  const t = translations[language];

  const categories = [
    { id: 'all', label: t.allCategories, icon: Grid },
    { id: 'catKirana', label: t.catKirana, icon: ShoppingBag, isLocalHighlight: true },
    { id: 'catSpices', label: t.catSpices, icon: Sparkles },
    { id: 'catTech', label: t.catTech, icon: Smartphone },
    { id: 'catFashion', label: t.catFashion, icon: Shirt },
    { id: 'catHome', label: t.catHome, icon: Home },
    { id: 'catCrafts', label: t.catCrafts, icon: Palette },
    { id: 'catWellness', label: t.catWellness, icon: HeartPulse },
    { id: 'catBooks', label: t.catBooks, icon: BookOpen }
  ];

  return (
    <nav className="bg-surface dark:bg-charcoal-800 border-b border-subtle overflow-x-auto scrollbar-none py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 min-w-max">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium tracking-wide transition whitespace-nowrap border ${
                isSelected
                  ? 'bg-slate-deep text-white border-slate-deep dark:bg-brass dark:text-slate-deep dark:border-brass'
                  : 'bg-concrete/60 dark:bg-charcoal-700/60 text-ink dark:text-zinc-300 border-subtle hover:border-brass/70'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-brass dark:text-slate-deep' : 'text-ink-muted dark:text-zinc-400'}`} />
              <span>{cat.label}</span>
              {cat.isLocalHighlight && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          );
        })}
        {onOpenCommunity && (
          <button
            type="button"
            onClick={onOpenCommunity}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition whitespace-nowrap border border-brass/50 bg-brass-light/30 dark:bg-brass/10 text-slate-deep dark:text-brass hover:bg-brass/20 ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-brass" />
            <span>{language === 'hi' ? 'कारीगर व रीसेल' : 'Artisans & Resale'}</span>
          </button>
        )}
      </div>
    </nav>
  );
};
