# 第六週作業：非同步程式開發

## 作業主題：電商 API 資料串接練習

### 情境說明

使用六角學院提供的 LiveJS 電商 API，練習用 Node.js 的 `fetch` 串接 API，取得產品資料、操作購物車。

---

## 快速開始

### Step 1：環境準備

1. 確認 Node.js 版本 >= 18
2. 下載此作業專案後，需打開終端機輸入 `npm install`
3. 註冊 [LiveJS 電商 API](https://hexschool.github.io/hexschoolliveswagger/) 的 API，並取得自己的 API Path 和 Key
   1. 請進入到[此網站](https://livejs-api.hexschool.io/)，並點選「註冊」，註冊帳號成功後，登入到網站
   2. 登入後即可進入到 API 申請畫面，請依照說明建立 API Path，也可以取得 API Key

### Step 2：設定環境變數

在專案根目錄建立 `.env` ，並在 `.env` 檔案中設定環境變數：

```bash
API_PATH=your-api-path
API_KEY=your-admin-token
```

### Step 3：開始寫作業

開啟 `homework.js`，按照註解提示完成所有函式：

```javascript
// 範例：完成 getProducts 函式
async function getProducts() {
	const response = await fetch(
		`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`,
	);
	const data = await response.json();
	return data.products;
}
```

### Step 4：測試你的程式碼

```bash
# 執行快速測試（看基本輸出）
npm start

# 執行完整 Jest 測試（看通過/失敗）
npm test
```

---

## 作業任務

### 任務一：基礎 fetch 練習

完成以下函式：

| 函式名稱            | 說明         | 回傳值                         |
| ------------------- | ------------ | ------------------------------ |
| `getProducts()`     | 取得產品列表 | `products` 陣列                |
| `getCart()`         | 取得購物車   | `{ carts, total, finalTotal }` |
| `getProductsSafe()` | 錯誤處理版本 | `{ success, data/error }`      |

### 任務二：購物車操作

完成以下函式：

| 函式名稱                           | HTTP 方法 | 說明         |
| ---------------------------------- | --------- | ------------ |
| `addToCart(productId, quantity)`   | POST      | 加入購物車   |
| `updateCartItem(cartId, quantity)` | PATCH     | 修改數量     |
| `removeCartItem(cartId)`           | DELETE    | 刪除單一商品 |
| `clearCart()`                      | DELETE    | 清空購物車   |

### 額外練習：HTTP 知識

回答 `homework.js` 中的問答題。

---

## API 資訊

```
Base URL: https://livejs-api.hexschool.io

=== 客戶端 API（不需認證）===
GET    /api/livejs/v1/customer/{api_path}/products     取得產品列表
GET    /api/livejs/v1/customer/{api_path}/carts        取得購物車列表
POST   /api/livejs/v1/customer/{api_path}/carts        加入購物車
PATCH  /api/livejs/v1/customer/{api_path}/carts        編輯購物車數量
DELETE /api/livejs/v1/customer/{api_path}/carts        清空購物車
DELETE /api/livejs/v1/customer/{api_path}/carts/{id}   刪除特定購物車商品

```

---

## 測試說明

本作業使用 **Jest** 進行自動化測試。

### 測試指令

```bash
# 執行測試
npm test
```

### 測試結果說明

- ✓ 表示測試通過
- ✕ 表示測試失敗

### 測試項目（共 15 項）

| 任務               | 測試數量 |
| ------------------ | -------- |
| 任務一：基礎 fetch | 8 項     |
| 任務二：購物車操作 | 7 項     |

---

## 繳交方式

1. 完成 `homework.js` 中的所有函式
2. 確保 `npm test` 測試通過
3. 將程式碼 push 到你的 GitHub 儲存庫
4. 提交 GitHub Repo 連結

---

## 常見問題

### Q: 測試失敗時，可先檢查跟確認？

1. 確認 `.env` 設定正確
2. 確認網路連線正常
3. 檢查 `homework.js` 的函式是否有正確回傳值
4. 確認 async/await 語法正確使用