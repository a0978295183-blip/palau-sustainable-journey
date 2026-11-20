import { ArrowRight, CalendarDays, Compass, MapPin, Target, Sparkles } from 'lucide-react';
import { calculateJourneyDays, JOURNEY_IMAGES, JOURNEY_META } from '../data/journeyData';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const totalDays = calculateJourneyDays(JOURNEY_META.startDate, JOURNEY_META.endDate);

  return (
    <section id="home" className="relative">
      {/* Full-bleed Hero Banner */}
      <div className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-end overflow-hidden bg-[#083B4C]">
        <div className="absolute inset-0">
          <SafeImage
            src={JOURNEY_IMAGES.heroRockIslands}
            alt="帛琉洛克群島湛藍潟湖與石灰岩島嶼空拍景觀"
            className="w-full h-full object-cover"
            eager={true}
            fallbackTitle="帛琉洛克群島海域"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/45 to-slate-950/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#BBE6F2] mb-3">
              {JOURNEY_META.title} · {JOURNEY_META.englishTitle}
            </p>
            <h1
              className="font-bold text-white tracking-tight leading-[1.15] mb-5"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}
            >
              探索帛琉，實踐永續
            </h1>
            <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed max-w-2xl mb-8">
              從海洋生態到南島文化，展開一場有意義的海外實踐旅程。探索自然、理解文化、實踐永續。
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => onNavigate('intro')}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-lg bg-[#0B6E8C] hover:bg-[#0D82A6] text-white text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                開始探索
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('itinerary')}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                查看每日行程
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 旅程資訊卡 (Full-width strip directly below hero) */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200/80">
            <div className="lg:pr-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0B6E8C]" />
                <span>地點</span>
              </div>
              <p className="text-base font-semibold text-slate-900">{JOURNEY_META.location}</p>
            </div>

            <div className="lg:px-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-[#0B6E8C]" />
                <span>日期</span>
              </div>
              <p className="text-base font-semibold text-slate-900 font-mono-tabular">
                {JOURNEY_META.dateRangeDisplay}
              </p>
            </div>

            <div className="lg:px-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
                <Compass className="w-3.5 h-3.5 text-[#1F6B4E]" />
                <span>旅程天數</span>
              </div>
              <p className="text-base font-semibold text-slate-900 tabular-nums">
                {totalDays} 天 {totalDays - 1} 夜
              </p>
            </div>

            <div className="lg:px-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1F6B4E]" />
                <span>旅程主題</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                {JOURNEY_META.themes}
              </p>
            </div>

            <div className="lg:pl-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
                <Target className="w-3.5 h-3.5 text-[#0B6E8C]" />
                <span>核心目標</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                {JOURNEY_META.coreGoals}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
