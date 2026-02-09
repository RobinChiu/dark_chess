# 測試文檔 (Testing Documentation)

## TDD 實踐總結

本專案採用 **測試驅動開發 (Test-Driven Development, TDD)** 方法來確保代碼質量和可維護性。

### TDD 流程

1. **紅燈 (Red)** - 先寫測試，看測試失敗
2. **綠燈 (Green)** - 實現功能，讓測試通過
3. **重構 (Refactor)** - 優化代碼，保持測試通過

### 測試覆蓋率

當前測試覆蓋率：**76.09%**

| 文件 | 語句覆蓋 | 分支覆蓋 | 函數覆蓋 | 行覆蓋 |
|------|---------|---------|---------|--------|
| gameLogic.js | 98.97% | 92.59% | 100% | 98.82% |
| ChessBoard.js | 61.29% | 44.68% | 71.42% | 64.36% |
| App.js | 66.66% | 100% | 50% | 66.66% |

## 測試架構

### 1. 單元測試 (Unit Tests)

#### gameLogic.test.js
測試純函數的遊戲邏輯：

- **初始化測試**
  - ✅ 生成 32 個棋子（紅黑各 16 個）
  - ✅ 正確的棋子數量配置
  - ✅ 創建 4×8 棋盤

- **移動驗證測試**
  - ✅ 相鄰移動檢測
  - ✅ 棋子捕獲規則（將>士>象>車>馬>包>卒）
  - ✅ 特殊規則：兵/卒可吃將/帥
  - ✅ 炮/包的跳吃邏輯

- **勝負判定測試**
  - ✅ 檢測紅方獲勝
  - ✅ 檢測黑方獲勝
  - ✅ 進行中狀態

### 2. 集成測試 (Integration Tests)

#### ChessBoard.test.js
測試 React 組件的行為：

- ✅ 渲染 4×8 棋盤
- ✅ 翻開棋子功能
- ✅ 顯示當前玩家
- ✅ 顯示遊戲狀態
- ✅ 顯示被吃棋子
- ✅ 初始化 32 個棋子
- ✅ 交互後保持棋盤結構

#### App.test.js
測試主應用組件：

- ✅ 渲染遊戲標題

## 運行測試

### 基本測試命令

```bash
# 運行所有測試
npm test

# 運行測試並生成覆蓋率報告
npm test -- --coverage

# 運行測試（不進入 watch 模式）
npm test -- --watchAll=false

# 運行測試並生成覆蓋率報告（CI 模式）
npm test -- --coverage --watchAll=false
```

### 測試特定文件

```bash
# 只測試 gameLogic
npm test -- gameLogic.test.js

# 只測試 ChessBoard
npm test -- ChessBoard.test.js
```

### 查看詳細覆蓋率報告

運行測試後，可以在 `coverage/lcov-report/index.html` 查看詳細的 HTML 格式覆蓋率報告：

```bash
npm test -- --coverage --watchAll=false
open coverage/lcov-report/index.html
```

## 代碼結構

### 關注點分離 (Separation of Concerns)

為了提高可測試性，我們將代碼分為：

1. **gameLogic.js** - 純函數的遊戲邏輯
   - 無副作用
   - 易於單元測試
   - 可重用

2. **ChessBoard.js** - React 組件
   - UI 渲染
   - 狀態管理
   - 使用 gameLogic 中的函數

3. **App.js** - 主應用
   - 應用容器
   - 重置功能

## 測試最佳實踐

### 1. 測試命名

使用清晰的測試描述：
```javascript
test('should return true when cannon jumps exactly one piece to capture', () => {
  // 測試代碼
});
```

### 2. 測試隔離

每個測試都是獨立的，不依賴其他測試：
```javascript
test('each test creates its own board', () => {
  const board = Array(4).fill(null).map(() => Array(8).fill(null));
  // ...
});
```

### 3. 測試覆蓋邊界情況

```javascript
// 測試特殊規則
test('should allow 兵/卒 to capture 將/帥 (special rule)', () => {
  expect(canCapture('兵', '將')).toBe(true);
});

// 測試反向情況
test('should not allow 將/帥 to be captured by 兵/卒', () => {
  expect(canCapture('將', '兵')).toBe(false);
});
```

### 4. 使用描述性的 describe 區塊

```javascript
describe('Game Logic Tests', () => {
  describe('canCapture', () => {
    test('should allow equal rank to capture', () => {
      // ...
    });
  });
});
```

## 持續改進

### 下一步優化方向

1. **提高 ChessBoard.js 覆蓋率**
   - 添加更多邊界情況測試
   - 測試錯誤處理邏輯

2. **添加 E2E 測試**
   - 完整的遊戲流程測試
   - 勝負判定測試

3. **性能測試**
   - 大量操作後的性能
   - 內存洩漏檢測

4. **快照測試**
   - UI 組件快照
   - 防止意外的 UI 變更

## CI/CD 集成

測試可以集成到 CI/CD 流程中：

```yaml
# .github/workflows/test.yml 示例
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test -- --coverage --watchAll=false
```

## 參考資源

- [Jest 官方文檔](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [TDD 最佳實踐](https://testdriven.io/)
