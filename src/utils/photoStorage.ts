import { GalleryPhoto } from '../types/journey';

const DB_NAME = 'palau_journey_db';
const DB_VERSION = 1;
const STORE_NAME = 'user_photos';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getUserPhotos(): Promise<GalleryPhoto[]> {
  try {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = (req.result as GalleryPhoto[]) || [];
        items.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage if IndexedDB is restricted
    try {
      const raw = localStorage.getItem('palau_user_photos_fallback');
      return raw ? (JSON.parse(raw) as GalleryPhoto[]) : [];
    } catch {
      return [];
    }
  }
}

export async function saveUserPhoto(photo: GalleryPhoto): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(photo);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const existing = await getUserPhotos();
    const updated = [photo, ...existing.filter((p) => p.id !== photo.id)];
    localStorage.setItem('palau_user_photos_fallback', JSON.stringify(updated));
  }
}

export async function deleteUserPhoto(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const existing = await getUserPhotos();
    const updated = existing.filter((p) => p.id !== id);
    localStorage.setItem('palau_user_photos_fallback', JSON.stringify(updated));
  }
}

export function compressImageToDataUrl(file: File, maxDimension = 1400, quality = 0.84): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('讀取圖片失敗'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('無效的圖片格式'));
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(result);
      img.onload = () => {
        const { width, height } = img;
        if (width <= maxDimension && height <= maxDimension) {
          resolve(result);
          return;
        }
        const scale = Math.min(maxDimension / width, maxDimension / height);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}
