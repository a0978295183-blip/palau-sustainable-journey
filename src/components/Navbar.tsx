import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: '首頁' },
  { id: 'intro', label: '旅程介紹' },
  { id: 'itinerary', label: '每日行程' },
  { id: 'spots', label: '景點探索' },
  { id: 'sdgs', label: '永續目標' },
  { id: 'checklist', label: '行前準備' },
  { id: 'expenses', label: '旅費紀錄' },
  { id: 'about', label: '關於我們' },
];

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        scrolled
          ? 'bg-[#F9FAF8]/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
          : 'bg-[#F9FAF8]/90 backdrop-blur-sm border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-[#0A4D63] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B6E8C] rounded-sm"
        >
          帛琉南島永續實踐計畫
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="主要導覽">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B6E8C] rounded-sm ${
                  isActive
                    ? 'text-[#0B6E8C]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#0B6E8C] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action on desktop / Hamburger menu on mobile */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#itinerary"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('itinerary');
            }}
            className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#0B6E8C] hover:bg-[#08566E] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6E8C]"
          >
            探索 15 日行程
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-700 hover:bg-slate-200/60 transition-colors focus-visible:outline-2 focus-visible:outline-[#0B6E8C]"
            aria-label={mobileMenuOpen ? '關閉導覽選單' : '開啟導覽選單'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          className="lg:hidden border-t border-slate-200/80 bg-[#F9FAF8] px-4 py-3 space-y-1 shadow-md"
          aria-label="行動版導覽"
        >
          <div className="grid grid-cols-2 gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.id);
                  }}
                  className={`flex items-center min-h-[44px] px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#0B6E8C]/10 text-[#0B6E8C]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
