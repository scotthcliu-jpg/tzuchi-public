# tzuchi-public 發布規則

## 唯一可編輯發布來源

四份 SBTi 公開頁面唯一可編輯來源是本 repo 的 `docs/`：

- `docs/index.html`
- `docs/dashboard.html`
- `docs/public-pathway.html`
- `docs/chiller-priority.html`

GitHub Pages 從 `main/docs` 發布。`G:\我的雲端硬碟\2026Claude\100_Todo\drafts\scripts\` 的同名 HTML 是 legacy archive，僅供查閱，不可再作為編輯或發布來源。

## 2040 情境數字

`docs/assets/sbti-metrics.js` 是 2040 情境的唯一資料與計算來源。四頁以 `data-sbti` 標記讀取數字；不可在 HTML 直接重寫 2040 目標、樂觀／保守結果、超額／缺口或冰機 Scope 1／2 輸入值。

每次提交前執行：

```powershell
node scripts/verify-sbti-2040.mjs
```

本機 hook 與 GitHub Actions 都會執行同一檢查。新 clone 請執行：

```powershell
git config core.hooksPath .githooks
```
