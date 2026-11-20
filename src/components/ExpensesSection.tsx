import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Pencil,
  Plus,
  Receipt,
  Trash2,
  Wallet,
} from 'lucide-react';
import { ExpenseCategory, ExpenseRecord } from '../types/journey';

const EXPENSES_STORAGE_KEY = 'palau_journey_expenses_v1';

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: '#0B6E8C',
  [ExpenseCategory.TRANSPORT]: '#1F6B4E',
  [ExpenseCategory.SHOPPING]: '#D97706',
  [ExpenseCategory.ATTRACTION]: '#2563EB',
  [ExpenseCategory.ACCOMMODATION]: '#7C3AED',
  [ExpenseCategory.OTHER]: '#64748B',
};

const ALL_CATEGORIES = Object.values(ExpenseCategory);

export function ExpensesSection() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(EXPENSES_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as ExpenseRecord[]) : [];
    } catch {
      return [];
    }
  });

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('2027-07-29');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FOOD);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState('');

  // Filter & Sort states
  const [filterCategory, setFilterCategory] = useState<string>('全部');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    } catch {
      // Ignore quota errors
    }
  }, [expenses]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanName = name.trim();
    const numericAmount = Number(amount);

    if (!cleanName) {
      setFormError('請輸入消費名稱。');
      return;
    }
    if (!date) {
      setFormError('請選擇消費日期。');
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError('請輸入大於 0 的有效金額。');
      return;
    }

    if (editingId) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: cleanName,
                date,
                category,
                amount: numericAmount,
                note: note.trim(),
              }
            : item
        )
      );
      setEditingId(null);
    } else {
      const newRecord: ExpenseRecord = {
        id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: cleanName,
        date,
        category,
        amount: numericAmount,
        note: note.trim(),
        createdAt: Date.now(),
      };
      setExpenses((prev) => [newRecord, ...prev]);
    }

    setName('');
    setAmount('');
    setNote('');
  };

  const handleEdit = (record: ExpenseRecord) => {
    setEditingId(record.id);
    setName(record.name);
    setDate(record.date);
    setCategory(record.category);
    setAmount(String(record.amount));
    setNote(record.note);
    setFormError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setAmount('');
    setNote('');
    setFormError('');
  };

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      handleCancelEdit();
    }
  };

  const totalSpend = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses]
  );

  const categoryBreakdown = useMemo(() => {
    return ALL_CATEGORIES.map((cat) => {
      const sum = expenses
        .filter((item) => item.category === cat)
        .reduce((acc, item) => acc + item.amount, 0);
      const percent = totalSpend > 0 ? Math.round((sum / totalSpend) * 100) : 0;
      return {
        category: cat,
        total: sum,
        percent,
        color: CATEGORY_COLORS[cat],
      };
    }).sort((a, b) => b.total - a.total);
  }, [expenses, totalSpend]);

  const displayedExpenses = useMemo(() => {
    const filtered =
      filterCategory === '全部'
        ? expenses
        : expenses.filter((item) => item.category === filterCategory);

    return [...filtered].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) {
        return sortOrder === 'desc' ? -dateCompare : dateCompare;
      }
      return sortOrder === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
    });
  }, [expenses, filterCategory, sortOrder]);

  return (
    <section id="expenses" className="py-16 sm:py-24 bg-[#F9FAF8] border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold tracking-wider text-[#0B6E8C] mb-2">
            旅費管理與支出統計 · 自動本機儲存
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            帛琉旅程個人旅費紀錄
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            隨時記下餐飲、交通、市集購物或景點支出，系統將即時計算總花費與各分類佔比，資料保留於本機。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Add/Edit Expense Form + Category Chart */}
          <div className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#0B6E8C]" />
                {editingId ? '編輯旅費紀錄' : '新增一筆旅費紀錄'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="exp-name"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    消費名稱 *
                  </label>
                  <input
                    id="exp-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：早市水果與芋頭點心"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0B6E8C]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="exp-date"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      消費日期 *
                    </label>
                    <input
                      id="exp-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-tabular focus:outline-none focus:border-[#0B6E8C]"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="exp-category"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      消費分類 *
                    </label>
                    <select
                      id="exp-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#0B6E8C]"
                    >
                      {ALL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="exp-amount"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    金額（新台幣 / 美元計價數值） *
                  </label>
                  <input
                    id="exp-amount"
                    type="number"
                    min="0.01"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="輸入金額，例如 350"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-tabular focus:outline-none focus:border-[#0B6E8C]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="exp-note"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    備註
                  </label>
                  <input
                    id="exp-note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="選填：付款方式或商品備註"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0B6E8C]"
                  />
                </div>

                {formError && <p className="text-xs font-medium text-rose-600">{formError}</p>}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-lg bg-[#0B6E8C] hover:bg-[#08566E] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {editingId ? '儲存修改' : '新增紀錄'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="min-h-[44px] px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium cursor-pointer"
                    >
                      取消
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Category Breakdown Visualization */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Wallet className="w-4 h-4 text-[#1F6B4E]" />
                  <span>支出統計圖表</span>
                </div>
                <span className="text-xs text-slate-500">依分類比例</span>
              </div>

              {/* Stacked Proportional Bar */}
              {totalSpend > 0 ? (
                <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-100 mb-5">
                  {categoryBreakdown
                    .filter((c) => c.total > 0)
                    .map((c) => (
                      <div
                        key={c.category}
                        style={{
                          width: `${(c.total / totalSpend) * 100}%`,
                          backgroundColor: c.color,
                        }}
                        title={`${c.category}: $${c.total.toLocaleString()} (${c.percent}%)`}
                      />
                    ))}
                </div>
              ) : (
                <div className="w-full h-3.5 rounded-full bg-slate-100 mb-5" />
              )}

              <div className="space-y-3">
                {categoryBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.category}
                      </span>
                      <span className="font-mono-tabular text-slate-800 font-semibold">
                        ${item.total.toLocaleString()}（{item.percent}%）
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${item.percent}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Total Summary + Filterable Expense List */}
          <div className="lg:col-span-7 space-y-6">
            {/* Total Metric Strip */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 sm:divide-x sm:divide-slate-100">
              <div>
                <div className="text-xs text-slate-500 mb-1">累計總花費</div>
                <div className="text-2xl sm:text-3xl font-bold text-[#0B6E8C] font-mono-tabular">
                  ${totalSpend.toLocaleString()}
                </div>
              </div>
              <div className="sm:pl-5">
                <div className="text-xs text-slate-500 mb-1">已記錄筆數</div>
                <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
                  {expenses.length} 筆
                </div>
              </div>
              <div className="sm:pl-5">
                <div className="text-xs text-slate-500 mb-1">最高支出分類</div>
                <div className="text-lg font-bold text-[#1F6B4E]">
                  {totalSpend > 0 ? categoryBreakdown[0].category : '尚無紀錄'}
                </div>
              </div>
            </div>

            {/* Filter & Sort Controls */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-1.5">
                  {['全部', ...ALL_CATEGORIES].map((cat) => {
                    const isActive = filterCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFilterCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-[#0B6E8C] text-white'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0 self-start sm:self-auto whitespace-nowrap"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {sortOrder === 'desc' ? '日期新到舊' : '日期舊到新'}
                </button>
              </div>

              {displayedExpenses.length === 0 ? (
                <div className="py-12 text-center">
                  <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">
                    {expenses.length === 0
                      ? '尚未新增任何旅費紀錄'
                      : `「${filterCategory}」分類下目前沒有紀錄`}
                  </p>
                  <p className="text-xs text-slate-500">
                    使用左側表單即可新增旅程支出，支援隨時編輯與刪除。
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {displayedExpenses.map((record) => (
                    <li
                      key={record.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-mono-tabular">{record.date}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className="font-semibold"
                            style={{ color: CATEGORY_COLORS[record.category] }}
                          >
                            {record.category}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">{record.name}</div>
                        {record.note && (
                          <div className="text-xs text-slate-500 mt-0.5">{record.note}</div>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <span className="text-base font-bold font-mono-tabular text-slate-900">
                          ${record.amount.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(record)}
                            className="w-9 h-9 rounded-lg text-slate-500 hover:text-[#0B6E8C] hover:bg-[#EBF4F6] flex items-center justify-center transition-colors cursor-pointer"
                            aria-label={`編輯 ${record.name}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(record.id)}
                            className="w-9 h-9 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label={`刪除 ${record.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
