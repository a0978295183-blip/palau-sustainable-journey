import { ABOUT_CONTENT, JOURNEY_IMAGES, JOURNEY_META } from '../data/journeyData';
import { NAV_ITEMS } from './Navbar';
import { SafeImage } from './SafeImage';

interface AboutSectionProps {
  onNavigate: (sectionId: string) => void;
}

export function AboutSection({ onNavigate }: AboutSectionProps) {
  return (
    <>
      <section id="about" className="py-16 sm:py-24 bg-white border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Split About Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold tracking-wider text-[#1F6B4E] mb-2">
                關於我們 · 計畫初衷與核心價值
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-5">
                以田野實踐連結環境意識與文化尊重
              </h2>
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                {ABOUT_CONTENT.intro}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('itinerary')}
                  className="px-5 py-2.5 rounded-lg bg-[#0B6E8C] hover:bg-[#08566E] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  檢視十五日行程
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('checklist')}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                >
                  確認行前準備清單
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200/80 h-full min-h-[280px] bg-slate-100">
                <SafeImage
                  src={JOURNEY_IMAGES.youthExchange}
                  alt="帛琉南島永續實踐計畫青年田野交流"
                  className="w-full h-full object-cover"
                  fallbackTitle="帛琉青年永續交流"
                />
              </div>
            </div>
          </div>

          {/* 4 Pillars: 計畫理念, 旅程目標, 永續精神, 文化尊重 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {ABOUT_CONTENT.pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="bg-[#F9FAF8] rounded-2xl border border-slate-200/80 p-6"
              >
                <div className="font-mono-tabular text-xs font-semibold text-[#0B6E8C] mb-2">
                  {pillar.number}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5">{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>

          {/* Team Introduction Block */}
          <div className="bg-[#F3EFE6]/70 rounded-2xl border border-slate-200/80 p-6 sm:p-8">
            <div className="max-w-2xl mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">團隊介紹與協作分工</h3>
              <p className="text-sm text-slate-600">
                由跨領域青年行動者、帶隊導師及生態文化引導員共同組成，陪伴參與者完成每一階段的田野學習。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {ABOUT_CONTENT.teamRoles.map((member, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200/80 p-5">
                  <div className="text-xs font-mono-tabular text-[#1F6B4E] font-semibold mb-1.5">
                    角色編組 0{idx + 1}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{member.role}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{member.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#0A3544] text-slate-200 py-12 border-t border-[#0E485C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8 border-b border-white/10">
            <div className="max-w-md">
              <div className="text-lg font-bold text-white mb-2">
                {JOURNEY_META.title}
              </div>
              <p className="text-xs text-sky-100/80 mb-3 font-mono-tabular">
                {JOURNEY_META.englishTitle} · {JOURNEY_META.dateRangeDisplay}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                從帛琉海岸到南島部落，恪守環境保護與文化尊重公約，讓每一步田野探索都成為永續未來的一份實踐。
              </p>
            </div>

            <nav aria-label="頁尾導覽" className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id);
                  }}
                  className="text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <span>© 2027 帛琉南島永續實踐計畫｜Palau Sustainable Journey</span>
            <span>實踐 SDGs 2 · 4 · 11 · 12 · 14 · 15</span>
          </div>
        </div>
      </footer>
    </>
  );
}
