import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImagePlus,
  Map as MapIcon,
  MapPin,
  Trash2,
  X,
  Calendar,
} from 'lucide-react';
import {
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsSearchUrl,
  INITIAL_GALLERY_PHOTOS,
  SPOTS_DATA,
} from '../data/journeyData';
import { GalleryPhoto, SpotItem } from '../types/journey';
import {
  compressImageToDataUrl,
  deleteUserPhoto,
  getUserPhotos,
  saveUserPhoto,
} from '../utils/photoStorage';
import { SafeImage } from './SafeImage';

interface SpotsAndGallerySectionProps {
  onSelectDayAndScroll: (dayNumber: number) => void;
}

const SPOT_CATEGORIES = ['全部', '海洋生態', '原民文化', '永續產業', '陸域生態', '交流據點'] as const;

export function SpotsAndGallerySection({ onSelectDayAndScroll }: SpotsAndGallerySectionProps) {
  // Spots state
  const [spotFilter, setSpotFilter] = useState<string>('全部');
  const [activeMapSpot, setActiveMapSpot] = useState<SpotItem>(SPOTS_DATA[0]);
  const [selectedSpotDetail, setSelectedSpotDetail] = useState<SpotItem | null>(null);

  // Gallery & User Upload state
  const [userPhotos, setUserPhotos] = useState<GalleryPhoto[]>([]);
  const [galleryFilter, setGalleryFilter] = useState<string>('全部');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Upload form state
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let mounted = true;
    getUserPhotos().then((photos) => {
      if (mounted) setUserPhotos(photos);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredSpots =
    spotFilter === '全部'
      ? SPOTS_DATA
      : SPOTS_DATA.filter((spot) => spot.category === spotFilter);

  const allPhotos: GalleryPhoto[] = [...userPhotos, ...INITIAL_GALLERY_PHOTOS];
  const galleryCategories = ['全部', '個人旅程紀錄', ...Array.from(new Set(INITIAL_GALLERY_PHOTOS.map((p) => p.category)))];

  const filteredPhotos =
    galleryFilter === '全部'
      ? allPhotos
      : galleryFilter === '個人旅程紀錄'
      ? allPhotos.filter((p) => p.isUserUploaded)
      : allPhotos.filter((p) => p.category === galleryFilter);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
        );
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredPhotos.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    if (!file.type.startsWith('image/')) {
      setUploadError('請選擇圖片檔案（JPG、PNG、WEBP 等格式）。');
      return;
    }

    try {
      setIsUploading(true);
      const dataUrl = await compressImageToDataUrl(file);
      setUploadPreview(dataUrl);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^.]+$/, ''));
      }
    } catch {
      setUploadError('圖片讀取失敗，請更換檔案重試。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadPreview) {
      setUploadError('請先選擇要上傳的旅程照片。');
      return;
    }
    const cleanTitle = uploadTitle.trim();
    if (!cleanTitle) {
      setUploadError('請輸入照片標題。');
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: `user-photo-${Date.now()}`,
      title: cleanTitle,
      description: uploadDesc.trim() || '個人帛琉永續旅程影像紀錄。',
      category: '個人旅程紀錄',
      imageUrl: uploadPreview,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
      isUserUploaded: true,
      createdAt: Date.now(),
    };

    await saveUserPhoto(newPhoto);
    setUserPhotos((prev) => [newPhoto, ...prev]);
    setUploadTitle('');
    setUploadDesc('');
    setUploadPreview('');
    setUploadError('');
    setShowUploadPanel(false);
    setGalleryFilter('全部');
  };

  const handleDeleteUserPhoto = async (id: string) => {
    await deleteUserPhoto(id);
    setUserPhotos((prev) => prev.filter((p) => p.id !== id));
    setLightboxIndex(null);
  };

  const currentLightboxPhoto =
    lightboxIndex !== null && filteredPhotos[lightboxIndex]
      ? filteredPhotos[lightboxIndex]
      : null;

  return (
    <section id="spots" className="py-16 sm:py-24 bg-[#F9FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Part A: 景點探索與 Google Maps */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#0B6E8C] mb-2">
              景點探索與地圖導覽
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              帛琉十一處核心踏查據點與 Google Maps 定位
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              點擊任一景點即可預覽地圖位置、查看永續目標關聯，或直接開啟 Google 地圖進行路線與周邊檢視。
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8" role="group" aria-label="景點分類篩選">
          {SPOT_CATEGORIES.map((category) => {
            const isActive = spotFilter === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSpotFilter(category)}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0B6E8C] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Interactive Embedded Map Preview Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-4 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#0B6E8C] mb-2">
                  <MapIcon className="w-4 h-4" />
                  <span>地圖位置預覽</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{activeMapSpot.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{activeMapSpot.englishName}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {activeMapSpot.summary}
                </p>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>造訪日期：{activeMapSpot.dateLabel}</div>
                  <div>對應指標：{activeMapSpot.sdgs.join(' · ')}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-4 border-t border-slate-100">
                <a
                  href={buildGoogleMapsSearchUrl(activeMapSpot.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg bg-[#0B6E8C] hover:bg-[#08566E] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  開啟 Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => onSelectDayAndScroll(activeMapSpot.dayIndex)}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg bg-[#EBF4F6] hover:bg-[#d8ebef] text-[#0B6E8C] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  跳至 Day {activeMapSpot.dayIndex}
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 min-h-[300px] sm:min-h-[340px] bg-slate-100 relative">
              <iframe
                title={`${activeMapSpot.name} 地圖預覽`}
                src={buildGoogleMapsEmbedUrl(activeMapSpot.mapQuery)}
                className="w-full h-full min-h-[300px] sm:min-h-[340px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Spots Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredSpots.map((spot) => {
            const isMapActive = activeMapSpot.id === spot.id;
            return (
              <article
                key={spot.id}
                className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-150 ${
                  isMapActive
                    ? 'border-[#0B6E8C] ring-2 ring-[#0B6E8C]/15 shadow-sm'
                    : 'border-slate-200/80 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <SafeImage
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                    fallbackTitle={spot.name}
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <span className="font-medium text-[#0B6E8C]">{spot.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">{spot.dateLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#1F6B4E] font-medium">{spot.sdgs.join(' / ')}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{spot.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{spot.englishName}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">
                    {spot.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                    <a
                      href={buildGoogleMapsSearchUrl(spot.mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B6E8C] hover:bg-[#08566E] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Google Maps
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setActiveMapSpot(spot)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#EBF4F6] hover:bg-[#d8ebef] text-[#0B6E8C] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      預覽地圖
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSpotDetail(spot)}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer ml-auto whitespace-nowrap"
                    >
                      詳細介紹
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Part B: 影像畫廊 & 旅程照片紀錄 */}
        <div id="gallery" className="pt-12 border-t border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-[#1F6B4E] mb-2">
                影像畫廊與旅程照片紀錄
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                帛琉自然人文影像紀實
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                點擊任一相片可開啟高解析度燈箱瀏覽並左右切換；您也可上傳並保存自己的旅程攝影紀錄。
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadPanel((prev) => !prev)}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#1F6B4E] hover:bg-[#17523B] text-white text-sm font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Camera className="w-4 h-4" />
              {showUploadPanel ? '收合照片上傳區' : '新增旅程照片紀錄'}
            </button>
          </div>

          {/* User Photo Upload Panel */}
          {showUploadPanel && (
            <form
              onSubmit={handleUploadSubmit}
              className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-xs"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-1">上傳個人旅程照片</h3>
              <p className="text-xs text-slate-500 mb-5">
                照片與文字說明將儲存在您的瀏覽器本機資料庫（IndexedDB），重新整理頁面後仍會完整保留。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    選擇照片檔案
                  </label>
                  <label className="flex flex-col items-center justify-center aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0B6E8C] bg-[#F9FAF8] cursor-pointer overflow-hidden transition-colors">
                    {uploadPreview ? (
                      <img
                        src={uploadPreview}
                        alt="上傳照片預覽"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-center p-4 text-slate-500">
                        <ImagePlus className="w-8 h-8 mb-2 text-[#0B6E8C]" />
                        <span className="text-sm font-medium text-slate-700">
                          {isUploading ? '圖片處理中...' : '點擊選擇照片'}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          支援 JPG、PNG、WEBP
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="photo-title-input"
                        className="block text-xs font-semibold text-slate-700 mb-1.5"
                      >
                        照片標題 *
                      </label>
                      <input
                        id="photo-title-input"
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="例如：洛克群島浮潛觀察紀錄"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0B6E8C]"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="photo-desc-input"
                        className="block text-xs font-semibold text-slate-700 mb-1.5"
                      >
                        照片描述與觀察筆記
                      </label>
                      <textarea
                        id="photo-desc-input"
                        rows={3}
                        value={uploadDesc}
                        onChange={(e) => setUploadDesc(e.target.value)}
                        placeholder="記錄拍攝時間、地點或當下的永續觀察心得..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0B6E8C]"
                      />
                    </div>
                  </div>

                  {uploadError && (
                    <p className="text-xs font-medium text-rose-600">{uploadError}</p>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadPanel(false);
                        setUploadPreview('');
                        setUploadError('');
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-5 py-2 rounded-lg bg-[#0B6E8C] hover:bg-[#08566E] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      儲存至旅程紀錄
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Gallery Category Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {galleryCategories.map((cat) => {
              const isActive = galleryFilter === cat;
              const count =
                cat === '全部'
                  ? allPhotos.length
                  : cat === '個人旅程紀錄'
                  ? userPhotos.length
                  : allPhotos.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0B6E8C] text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Gallery Grid */}
          {filteredPhotos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <Camera className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 mb-1">
                目前尚無「{galleryFilter}」照片
              </p>
              <p className="text-xs text-slate-500 mb-4">
                點擊上方「新增旅程照片紀錄」即可上傳您的帛琉現場攝影。
              </p>
              <button
                type="button"
                onClick={() => setShowUploadPanel(true)}
                className="px-4 py-2 rounded-lg bg-[#0B6E8C] text-white text-xs font-semibold cursor-pointer"
              >
                立即上傳照片
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-[#0B6E8C]"
                    aria-label={`放大檢視 ${photo.title}`}
                  >
                    <SafeImage
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      fallbackTitle={photo.title}
                    />
                  </button>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                        <span>{photo.category}</span>
                        {photo.date && <span className="font-mono-tabular">{photo.date}</span>}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">{photo.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {photo.description}
                      </p>
                    </div>

                    {photo.isUserUploaded && (
                      <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteUserPhoto(photo.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer py-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          刪除照片
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Spot Detail Modal */}
      {selectedSpotDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedSpotDetail(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-slate-100 shrink-0">
              <SafeImage
                src={selectedSpotDetail.image}
                alt={selectedSpotDetail.name}
                className="w-full h-full object-cover"
                fallbackTitle={selectedSpotDetail.name}
              />
              <button
                type="button"
                onClick={() => setSelectedSpotDetail(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white flex items-center justify-center cursor-pointer"
                aria-label="關閉視窗"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="text-xs text-slate-500 mb-2">
                {selectedSpotDetail.category} · {selectedSpotDetail.dateLabel} ·{' '}
                <span className="text-[#1F6B4E] font-medium">
                  {selectedSpotDetail.sdgs.join(' / ')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedSpotDetail.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{selectedSpotDetail.englishName}</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {selectedSpotDetail.details}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const dayIdx = selectedSpotDetail.dayIndex;
                    setSelectedSpotDetail(null);
                    onSelectDayAndScroll(dayIdx);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#EBF4F6] text-[#0B6E8C] text-xs font-semibold cursor-pointer"
                >
                  前往 Day {selectedSpotDetail.dayIndex} 行程
                </button>
                <a
                  href={buildGoogleMapsSearchUrl(selectedSpotDetail.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B6E8C] text-white text-xs font-semibold"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  開啟 Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {currentLightboxPhoto && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/92 flex flex-col justify-between p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="圖片燈箱檢視"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="flex items-center justify-between text-white/90 max-w-6xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-mono-tabular text-slate-300">
              {lightboxIndex + 1} / {filteredPhotos.length} · {currentLightboxPhoto.category}
            </div>
            <div className="flex items-center gap-2">
              {currentLightboxPhoto.isUserUploaded && (
                <button
                  type="button"
                  onClick={() => handleDeleteUserPhoto(currentLightboxPhoto.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  刪除
                </button>
              )}
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                aria-label="關閉圖片檢視"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-4 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                )
              }
              className="absolute left-1 sm:left-3 z-10 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="上一張圖片"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={currentLightboxPhoto.imageUrl}
              alt={currentLightboxPhoto.title}
              className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />

            <button
              type="button"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)}
              className="absolute right-1 sm:right-3 z-10 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="下一張圖片"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div
            className="max-w-3xl w-full mx-auto text-center text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-1">{currentLightboxPhoto.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentLightboxPhoto.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
