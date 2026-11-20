import { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  buildGoogleMapsSearchUrl,
  ITINERARY_DAYS,
  SPOTS_DATA,
} from '../data/journeyData';
import { SpotItem } from '../types/journey';
import { SafeImage } from './SafeImage';

interface ItinerarySectionProps {
  selectedDayNumber: number;
  onSelectDay: (dayNumber: number) => void;
  onNavigateToSdg: (sdgCode: string) => void;
}

export function ItinerarySection({
  selectedDayNumber,
  onSelectDay,
  onNavigateToSdg,
}: ItinerarySectionProps) {
  const [modalSpot, setModalSpot] = useState<SpotItem | null>(null);

  const currentDay =
    ITINERARY_DAYS.find((d) => d.dayNumber === selectedDayNumber) || ITINERARY_DAYS[0];
  const relatedSpots = SPOTS_DATA.filter((s) => currentDay.spotIds.includes(s.id));

  const handlePrevDay = () => {
    if (currentDay.dayNumber > 1) {
      onSelectDay(currentDay.dayNumber - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDay.dayNumber < ITINERARY_DAYS.length) {
      onSelectDay(currentDay.dayNumber + 1);
    }
  };

  return (
    <section id="itinerary" className="py-16 sm:py-24 bg-[#F3EFE6]/60 border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#0B6E8C] mb-2">
              每日行程總覽 · 2027/07/29－2027/08/12
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              十五日帛琉永續實踐互動行程表
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrevDay}
              disabled={currentDay.dayNumber === 1}
              className="inline-flex items-center gap-1 min-h-[40px] px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
            >
              <ChevronLeft className="w-4 h-4" />
              前一天
            </button>
            <span className="px-3 text-sm font-mono-tabular font-semibold text-slate-700 whitespace-nowrap">
              Day {String(currentDay.dayNumber).padStart(2, '0')} / {ITINERARY_DAYS.length}
            </span>
            <button
              type="button"
              onClick={handleNextDay}
              disabled={currentDay.dayNumber === ITINERARY_DAYS.length}
              className="inline-flex items-center gap-1 min-h-[40px] px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
            >
              下一天
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Date Selector Bar */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar"
          role="tablist"
          aria-label="行程日期選擇器"
        >
          {ITINERARY_DAYS.map((day) => {
            const isActive = day.dayNumber === currentDay.dayNumber;
            return (
              <button
                key={day.dayNumber}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectDay(day.dayNumber)}
                className={`flex flex-col items-start min-w-[92px] px-3.5 py-2.5 rounded-xl border text-left transition-all duration-150 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0B6E8C] ${
                  isActive
                    ? 'bg-[#0B6E8C] border-[#0B6E8C] text-white shadow-sm'
                    : 'bg-white border-slate-200/90 text-slate-700 hover:border-[#0B6E8C]/50 hover:bg-[#EBF4F6]/50'
                }`}
              >
                <span
                  className={`text-[11px] font-mono-tabular font-medium ${
                    isActive ? 'text-sky-100' : 'text-slate-500'
                  }`}
                >
                  Day {String(day.dayNumber).padStart(2, '0')}
                </span>
                <span className="text-sm font-bold font-mono-tabular mt-0.5 whitespace-nowrap">
                  {day.shortDate}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Detailed Day Card & Timeline */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-5 border-b border-slate-200/80">
              <div className="md:col-span-2 aspect-[4/3] md:aspect-auto md:min-h-[240px] bg-slate-100">
                <SafeImage
                  src={currentDay.image}
                  alt={`${currentDay.date} ${currentDay.title}`}
                  className="w-full h-full object-cover"
                  fallbackTitle={currentDay.title}
                />
              </div>

              <div className="md:col-span-3 p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-mono-tabular font-semibold text-[#0B6E8C]">
                      {currentDay.date}（{currentDay.weekday}）
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{currentDay.locationName}</span>
                    {currentDay.theme && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-[#1F6B4E]">主題：{currentDay.theme}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                    {currentDay.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                    {currentDay.summary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                    {currentDay.sdgs.length > 0 ? (
                      currentDay.sdgs.map((sdg) => (
                        <button
                          key={sdg}
                          type="button"
                          onClick={() => onNavigateToSdg(sdg)}
                          className="text-[#1F6B4E] hover:underline cursor-pointer whitespace-nowrap"
                        >
                          {sdg} 永續目標 →
                        </button>
                      ))
                    ) : (
                      <span className="text-slate-500">團隊行前與成果總結階段</span>
                    )}
                  </div>

                  <a
                    href={buildGoogleMapsSearchUrl(currentDay.mapQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#EBF4F6] hover:bg-[#0B6E8C] text-[#0B6E8C] hover:text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    開啟 Google 地圖
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Activities & Timeline */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Exact PDF Activities */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0B6E8C]" />
                  當日核心實踐內容
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentDay.activities.map((activity, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F9FAF8] border border-slate-200/70 text-sm text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1F6B4E] shrink-0 mt-0.5" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0B6E8C]" />
                  行程時間軸
                </h4>
                <ol className="relative space-y-5 pl-6 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                  {currentDay.timeline.map((step, idx) => (
                    <li key={idx} className="relative">
                      <span className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#0B6E8C]" />
                      <div className="text-xs font-semibold text-[#0B6E8C] mb-0.5">
                        {step.phase}
                      </div>
                      <div className="text-base font-semibold text-slate-900 mb-1">
                        {step.title}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Clickable Related Spots */}
              {relatedSpots.length > 0 && (
                <div className="pt-6 border-t border-slate-200/80">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">
                    當日相關探索景點（點擊查看介紹）
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedSpots.map((spot) => (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={() => setModalSpot(spot)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-[#0B6E8C] bg-white hover:bg-[#EBF4F6]/40 text-left transition-colors cursor-pointer group"
                      >
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                          <SafeImage
                            src={spot.image}
                            alt={spot.name}
                            className="w-full h-full object-cover"
                            fallbackTitle={spot.name}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0B6E8C] truncate">
                            {spot.name}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{spot.englishName}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Full 15-Day Quick Navigator List */}
          <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">十五日行程快速導覽</h3>
            <p className="text-xs text-slate-500 mb-4">點選任一日期即可切換當日完整行程</p>

            <div className="space-y-1.5 max-h-[540px] overflow-y-auto pr-1">
              {ITINERARY_DAYS.map((day) => {
                const isSelected = day.dayNumber === currentDay.dayNumber;
                return (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => onSelectDay(day.dayNumber)}
                    className={`w-full flex items-start gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B6E8C]/10 text-[#0B6E8C]'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="font-mono-tabular text-xs font-semibold mt-0.5 shrink-0 w-11">
                      {day.shortDate}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">{day.title}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {day.theme ? `主題：${day.theme}` : day.locationName}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      {/* Spot Detail Modal */}
      {modalSpot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="itinerary-spot-title"
          onClick={() => setModalSpot(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-slate-100 shrink-0">
              <SafeImage
                src={modalSpot.image}
                alt={modalSpot.name}
                className="w-full h-full object-cover"
                fallbackTitle={modalSpot.name}
              />
              <button
                type="button"
                onClick={() => setModalSpot(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white flex items-center justify-center cursor-pointer"
                aria-label="關閉景點介紹"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>{modalSpot.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{modalSpot.dateLabel}</span>
                {modalSpot.sdgs.length > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#1F6B4E] font-medium">{modalSpot.sdgs.join(' / ')}</span>
                  </>
                )}
              </div>

              <h3 id="itinerary-spot-title" className="text-xl font-bold text-slate-900 mb-1">
                {modalSpot.name}
              </h3>
              <p className="text-xs text-slate-500 mb-4">{modalSpot.englishName}</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">{modalSpot.details}</p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalSpot(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  關閉
                </button>
                <a
                  href={buildGoogleMapsSearchUrl(modalSpot.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B6E8C] hover:bg-[#08566E] text-white text-sm font-semibold transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  在 Google Maps 查看
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
