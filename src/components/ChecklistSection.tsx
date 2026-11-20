import { useEffect, useState } from 'react';
import { Check, RotateCcw, CheckSquare } from 'lucide-react';
import { CHECKLIST_CATEGORIES } from '../data/journeyData';

const STORAGE_KEY = 'palau_journey_checklist_v1';

export function ChecklistSection() {
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [checkedIds]);

  const totalItems = CHECKLIST_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedCount = checkedIds.length;
  const percentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const toggleItem = (itemId: string) => {
    setCheckedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleReset = () => {
    setCheckedIds([]);
    setConfirmReset(false);
  };

  const visibleCategories =
    activeCategory === 'all'
      ? CHECKLIST_CATEGORIES
      : CHECKLIST_CATEGORIES.filter((cat) => cat.id === activeCategory);

  return (
    <section id="checklist" className="py-16 sm:py-24 bg-[#F3EFE6]/60 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#0B6E8C] mb-2">
              行前準備檢核表 · 自動本機儲存
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              帛琉永續行前準備清單
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              勾選已完成的打包項目，進度將自動保存於您的瀏覽器，重新整理頁面不會消失。
            </p>
          </div>

          {/* Progress Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 min-w-[290px] sm:min-w-[340px] shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CheckSquare className="w-4 h-4 text-[#1F6B4E]" />
                <span>準備完成進度</span>
              </div>
              <div className="text-sm font-mono-tabular font-bold text-[#0B6E8C]">
                {completedCount} / {totalItems} 項（{percentage}%）
              </div>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[#1F6B4E] transition-all duration-300 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-500">
                {percentage === 100 ? '所有行前項目皆已就緒' : '點擊下方項目即可勾選或取消'}
              </span>

              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  disabled={completedCount === 0}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed font-medium whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  重置清單
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-rose-600 font-semibold hover:underline cursor-pointer"
                  >
                    確定清除
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="text-slate-500 hover:underline cursor-pointer"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-[#0B6E8C] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            全部分類 ({completedCount}/{totalItems})
          </button>

          {CHECKLIST_CATEGORIES.map((cat) => {
            const catCompleted = cat.items.filter((i) => checkedIds.includes(i.id)).length;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0B6E8C] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.title} ({catCompleted}/{cat.items.length})
              </button>
            );
          })}
        </div>

        {/* Checklist Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleCategories.map((category) => {
            const catCompleted = category.items.filter((i) => checkedIds.includes(i.id)).length;
            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs"
              >
                <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{category.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{category.description}</p>
                  </div>
                  <span className="font-mono-tabular text-xs font-semibold text-[#1F6B4E] shrink-0">
                    {catCompleted} / {category.items.length}
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {category.items.map((item) => {
                    const isChecked = checkedIds.includes(item.id);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-pressed={isChecked}
                          className={`w-full flex items-start gap-3.5 p-3 rounded-xl border text-left transition-colors cursor-pointer min-h-[48px] ${
                            isChecked
                              ? 'bg-[#E2EFE8]/45 border-[#1F6B4E]/30'
                              : 'bg-[#F9FAF8] hover:bg-slate-50 border-slate-200/70'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isChecked
                                ? 'bg-[#1F6B4E] border-[#1F6B4E] text-white'
                                : 'bg-white border-slate-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-sm font-semibold transition-colors ${
                                isChecked ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {item.label}
                            </div>
                            {item.note && (
                              <div
                                className={`text-xs mt-0.5 leading-relaxed ${
                                  isChecked ? 'text-slate-400' : 'text-slate-500'
                                }`}
                              >
                                {item.note}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
