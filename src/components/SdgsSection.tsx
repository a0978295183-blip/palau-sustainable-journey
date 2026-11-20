import { useEffect, useState } from 'react';
import {
  BookOpen,
  Building2,
  Calendar,
  Fish,
  Recycle,
  Sprout,
  Trees,
  X,
} from 'lucide-react';
import { ITINERARY_DAYS, SDGS_DATA } from '../data/journeyData';
import { SDGItem } from '../types/journey';
import { SafeImage } from './SafeImage';

interface SdgsSectionProps {
  highlightedSdgCode: string | null;
  onSelectDayAndScroll: (dayNumber: number) => void;
}

function getSdgIcon(number: number) {
  switch (number) {
    case 2:
      return Sprout;
    case 4:
      return BookOpen;
    case 11:
      return Building2;
    case 12:
      return Recycle;
    case 14:
      return Fish;
    case 15:
      return Trees;
    default:
      return Sprout;
  }
}

export function SdgsSection({ highlightedSdgCode, onSelectDayAndScroll }: SdgsSectionProps) {
  const [selectedSdg, setSelectedSdg] = useState<SDGItem | null>(null);

  useEffect(() => {
    if (!highlightedSdgCode) return;
    const normalized = highlightedSdgCode.replace(/\s+/g, '').toUpperCase();
    const match = SDGS_DATA.find((item) => `SDG${item.number}` === normalized);
    if (match) {
      setSelectedSdg(match);
    }
  }, [highlightedSdgCode]);

  return (
    <section id="sdgs" className="py-16 sm:py-24 bg-white border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold tracking-wider text-[#1F6B4E] mb-2">
            聯合國永續發展目標 · Sustainable Development Goals
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
            扣合六項 SDGs 的帛琉行動實踐
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            本計畫將每日探勘與部落踏查明確對應至聯合國永續發展目標，點擊卡片即可檢視詳細議題說明與對應行程日程。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SDGS_DATA.map((sdg) => {
            const IconComponent = getSdgIcon(sdg.number);
            return (
              <button
                key={sdg.number}
                type="button"
                onClick={() => setSelectedSdg(sdg)}
                className="group text-left bg-[#F9FAF8] hover:bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-150 hover:shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0B6E8C]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <SafeImage
                    src={sdg.image}
                    alt={`${sdg.code} ${sdg.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fallbackTitle={sdg.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-mono-tabular font-bold text-sm text-white shrink-0"
                        style={{ backgroundColor: sdg.color }}
                      >
                        {sdg.number}
                      </span>
                      <div>
                        <div className="text-xs text-slate-200">{sdg.englishTitle}</div>
                        <div className="text-base font-bold">{sdg.title}</div>
                      </div>
                    </div>
                    <IconComponent className="w-5 h-5 text-white/90 shrink-0" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between w-full">
                  <div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{sdg.summary}</p>
                    <div className="text-xs font-semibold text-slate-800 mb-2">旅程對應行動</div>
                    <ul className="space-y-1.5 text-xs text-slate-600 mb-4">
                      {sdg.palauActions.slice(0, 2).map((act, i) => (
                        <li key={i} className="line-clamp-2">
                          • {act}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs font-semibold text-[#0B6E8C]">
                    <span>對應 {sdg.relatedDays.map((d) => `Day ${d}`).join('、')}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      查看詳細 →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SDG Detail Modal */}
      {selectedSdg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sdg-modal-title"
          onClick={() => setSelectedSdg(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] bg-slate-100 shrink-0">
              <SafeImage
                src={selectedSdg.image}
                alt={selectedSdg.title}
                className="w-full h-full object-cover"
                fallbackTitle={selectedSdg.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedSdg(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white flex items-center justify-center cursor-pointer"
                aria-label="關閉視窗"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-center gap-3 text-white">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-mono-tabular font-bold text-lg shrink-0"
                  style={{ backgroundColor: selectedSdg.color }}
                >
                  {selectedSdg.number}
                </span>
                <div>
                  <div className="text-xs text-slate-200">
                    {selectedSdg.code} · {selectedSdg.englishTitle}
                  </div>
                  <h3 id="sdg-modal-title" className="text-xl sm:text-2xl font-bold">
                    {selectedSdg.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-1.5">永續脈絡說明</h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {selectedSdg.detailedExplanation}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-2">本次旅程對應活動</h4>
                <ul className="space-y-2">
                  {selectedSdg.palauActions.map((action, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-[#F9FAF8] border border-slate-200/80 text-sm text-slate-800"
                    >
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-2.5">前往相關行程頁面</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSdg.relatedDays.map((dayNum) => {
                    const dayObj = ITINERARY_DAYS.find((d) => d.dayNumber === dayNum);
                    if (!dayObj) return null;
                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => {
                          setSelectedSdg(null);
                          onSelectDayAndScroll(dayNum);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EBF4F6] hover:bg-[#0B6E8C] text-[#0B6E8C] hover:text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Day {dayObj.dayNumber} ({dayObj.shortDate})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
