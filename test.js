// ========================================
// 第六週作業 Jest 測試
// 執行方式：npm test
// ========================================

// 載入環境變數
require("dotenv").config({ path: ".env" });

const homework = require("./homework.js");

// 測試超時設定（API 請求需要時間）
jest.setTimeout(30000);

// 全域變數
let testProductId;

// ========================================
// 測試前準備
// ========================================
beforeAll(async () => {
	// 檢查 API 設定
	if (!homework.API_PATH) {
		throw new Error("請先在 .env 檔案中設定 API_PATH！");
	}

	console.log(`API_PATH: ${homework.API_PATH}`);
	console.log(`BASE_URL: ${homework.BASE_URL}\n`);

	// 清空購物車
	try {
		await homework.clearCart();
		console.log("已清空購物車\n");
	} catch (e) {
		console.log("清空購物車失敗（可能函式尚未實作），繼續測試...\n");
	}
});

// 測試後清理
afterAll(async () => {
	try {
		await homework.clearCart();
		console.log("測試完成，已清空購物車");
	} catch (e) {
		// 忽略清理錯誤
	}
});

// ========================================
// 任務一：基礎 fetch
// ========================================
describe("任務一：基礎 fetch", () => {
	describe("getProducts", () => {
		test("應回傳陣列", async () => {
			const products = await homework.getProducts();
			expect(Array.isArray(products)).toBe(true);
		});

		test("應有產品資料", async () => {
			const products = await homework.getProducts();
			expect(products.length).toBeGreaterThan(0);
			// 儲存產品 ID 供後續測試使用
			testProductId = products[0]?.id;
		});

		test("產品應有 id 欄位", async () => {
			const products = await homework.getProducts();
			expect(products[0]).toHaveProperty("id");
		});
	});

	describe("getCart", () => {
		test("應回傳物件", async () => {
			const cart = await homework.getCart();
			expect(typeof cart).toBe("object");
			expect(cart).not.toBeNull();
		});

		test("應有 carts 陣列", async () => {
			const cart = await homework.getCart();
			expect(Array.isArray(cart.carts)).toBe(true);
		});
	});

	describe("getProductsSafe", () => {
		test("應回傳物件", async () => {
			const result = await homework.getProductsSafe();
			expect(typeof result).toBe("object");
			expect(result).not.toBeNull();
		});

		test("應有 success 欄位（布林值）", async () => {
			const result = await homework.getProductsSafe();
			expect(typeof result.success).toBe("boolean");
		});

		test("成功時應有 data 陣列", async () => {
			const result = await homework.getProductsSafe();
			expect(result.success).toBe(true);
			expect(Array.isArray(result.data)).toBe(true);
		});
	});
});

// ========================================
// 任務二：購物車操作
// ========================================
describe("任務二：購物車操作", () => {
	let testCartId;

	describe("addToCart", () => {
		test("應回傳物件", async () => {
			// 確保有產品 ID
			if (!testProductId) {
				const products = await homework.getProducts();
				testProductId = products[0]?.id;
			}

			const result = await homework.addToCart(testProductId, 1);
			expect(typeof result).toBe("object");
			expect(result).not.toBeNull();
		});

		test("應有 carts 陣列", async () => {
			const result = await homework.addToCart(testProductId, 1);
			expect(Array.isArray(result.carts)).toBe(true);
			// 儲存購物車項目 ID 供後續測試
			testCartId = result.carts[0]?.id;
		});
	});

	describe("updateCartItem", () => {
		test("應回傳物件", async () => {
			// 確保有購物車項目
			if (!testCartId) {
				const cart = await homework.getCart();
				testCartId = cart.carts[0]?.id;
			}

			if (testCartId) {
				const result = await homework.updateCartItem(testCartId, 2);
				expect(typeof result).toBe("object");
				expect(result).not.toBeNull();
			}
		});

		test("應有 carts 陣列", async () => {
			if (testCartId) {
				const result = await homework.updateCartItem(testCartId, 2);
				expect(Array.isArray(result.carts)).toBe(true);
			}
		});
	});

	describe("removeCartItem", () => {
		test("應回傳物件", async () => {
			// 先加入商品確保有項目可刪除
			if (!testCartId) {
				await homework.addToCart(testProductId, 1);
				const cart = await homework.getCart();
				testCartId = cart.carts[0]?.id;
			}

			if (testCartId) {
				const result = await homework.removeCartItem(testCartId);
				expect(typeof result).toBe("object");
				expect(result).not.toBeNull();
			}
		});
	});

	describe("clearCart", () => {
		test("應回傳物件", async () => {
			// 先加入商品
			await homework.addToCart(testProductId, 1);
			const result = await homework.clearCart();
			expect(typeof result).toBe("object");
			expect(result).not.toBeNull();
		});

		test("清空後購物車應為空", async () => {
			await homework.addToCart(testProductId, 1);
			const result = await homework.clearCart();
			expect(result.carts).toHaveLength(0);
		});
	});
});