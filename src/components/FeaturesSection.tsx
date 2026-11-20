import { useState } from 'react';
import { ArrowRight, Calendar, X } from 'lucide-react';
import { ITINERARY_DAYS, JOURNEY_FEATURES } from '../data/journeyData';
import { FeatureItem } from '../types/journey';
import { SafeImage } from './SafeImage';

interface FeaturesSectionProps {
  onSelectDayAndScroll: (dayNumber: number) => void;
}

export function FeaturesSection({ onSelectDayAndScroll }: FeaturesSectionProps) {
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

  return (
    <section id="intro" className="py-16 sm:py-24 bg-[#F9FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold tracking-wider text-[#0B6E8C] mb-2">
            旅程介紹與八大核心實踐
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
            從海洋保育到原民社群的立體田野觀察
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            十五天的帛琉行程橫跨海洋生態、傳統部落、永續農漁業與社區訪談，引導參與者以第一手觀察理解南島島嶼的永續實踐。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {JOURNEY_FEATURES.map((feature, index) => (
            <article
              key={feature.id}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1 shadow-xs hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <SafeImage
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  fallbackTitle={feature.title}
                />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-mono-tabular font-medium text-[#0B6E8C]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{feature.subtitle}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">
                  {feature.description}
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedFeature(feature)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B6E8C] hover:text-[#08566E] transition-colors cursor-pointer self-start py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6E8C] rounded-sm"
                >
                  查看更多
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feature-modal-title"
          onClick={() => setSelectedFeature(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-slate-100 shrink-0">
              <SafeImage
                src={selectedFeature.image}
                alt={selectedFeature.title}
                className="w-full h-full object-cover"
                fallbackTitle={selectedFeature.title}
              />
              <button
                type="button"
                onClick={() => setSelectedFeature(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="關閉視窗"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-7 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                <span>{selectedFeature.subtitle}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#1F6B4E] font-medium">{selectedFeature.relatedSdg}</span>
              </div>

              <h3 id="feature-modal-title" className="text-2xl font-bold text-slate-900 mb-3">
                {selectedFeature.title}
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                {selectedFeature.details}
              </p>

              <div className="border-t border-slate-200/80 pt-5">
                <p className="text-xs font-semibold text-slate-500 mb-3">
                  對應實踐日期（點擊跳轉至每日行程）
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedFeature.relatedDays.map((dayNum) => {
                    const dayObj = ITINERARY_DAYS.find((d) => d.dayNumber === dayNum);
                    if (!dayObj) return null;
                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => {
                          setSelectedFeature(null);
                          onSelectDayAndScroll(dayNum);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EBF4F6] hover:bg-[#0B6E8C] text-[#0B6E8C] hover:text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Day {dayObj.dayNumber} · {dayObj.shortDate} {dayObj.title}
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
