# Pozzo Manager (v4)

One installable app ordered **Stock | Sale | Dashboard | Sticker | Dispatch** (opening on **Dashboard**) with **pull-down-to-refresh** on every page. Swipe left and right, or tap the tabs at the top.

- **Stock** (`stock.html`): products with codes like DUPH-001, purchases, return condition inspections, issues, and stock list import.
- **Sale** (`orders.html`): paste an order message, check or edit product variants, save it. Also lets you open any order to **Cancel** or **Return** it, build the cash memo, and generate parcel entry files.
- **Dashboard** (`dashboard.html`): home overview with period range selector (defaults to **This month**), live **Stock Value at Cost & Sale**, **Total Items**, clickable **Low Stock** & **Out of Stock** buttons with values, selected-range **Sales Value**, **Purchases (stock bought)**, **No. of Sales**, **Gross Profit**, **Other Expenses** (Meta Ads, Packaging, Transportation, plus custom categories), and **Net Profit**.
- **Sticker** (`stickers.html`): reads Steadfast label PDFs and builds the parcel tag Excel.
- **Dispatch** (`dispatch.html`): lists customer names as buttons (one button per Order ID, appearing automatically as orders are entered). Tap any customer name to open their packing window with every product's name, quantity, and variant, plus a final **Done** button at the bottom that removes the customer button from the queue, alongside Packed history and courier parcel file export.

Files to upload to GitHub Pages: `index.html`, `dashboard.html`, `dispatch.html`, `orders.html`, `stock.html`, `stickers.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `README.md`.

**Never upload `pozzo-script.txt` to a public GitHub repo.** Paste `pozzo-script.txt` into Google Apps Script because it holds your secret key.

---

## Updating from v3 to v4

1. Upload all the changed files (`index.html`, `dashboard.html`, `dispatch.html`, `orders.html`, `stock.html`, `stickers.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `README.md`) to GitHub and commit. Open the app twice on your phone so it loads the latest version.
2. In the Google Apps Script editor, replace the whole script with the new `pozzo-script.txt`. Keep your secret key on line 1 (`KEY = "..."`) and `"timeZone": "Asia/Dhaka"` in `appsscript.json`.
3. Run **setup** once in the script editor. It adds the new columns (`Status`, `Returned Qty`, `Seller Delivery Cost`, `Return Note`, `Return Loss (Cost)`) to your Sales sheet automatically without touching existing rows.
4. Click **Deploy** → **Manage deployments** → the pencil icon → **Version: New version** → **Deploy**. The Web app link stays the same.

---

## How Order Cancel & Order Return Work in v4

### 1. Cancel Order
- In **Sales**, open any order under **Manage order** (by typing its Order ID like `PZ26OCT-014` or `14`, or by picking from **Browse recent orders from sheet**).
- Tap **Cancel order**:
  - Every product deducted for that order is automatically added back into Stock (`Ledger` entry with type `cancel`).
  - All calculations on that order (`Quantity`, `Subtotal`, `Discount`, `Order Total`, `Delivery Charge`, `Advance`) are set to `0`, and `Status` becomes `Cancelled`.
  - Any pending `To check` rows or open issues on that order are closed, and the order is automatically excluded from future Steadfast parcel files.

### 2. Return Order + Inspect Condition in Stock
- In **Sales**, open an order and tap **Return items…**.
- A review screen opens (just like the Order Confirm screen) where you:
  1. Choose which items and how many pieces came back (supports partial returns or returning the full order).
  2. Enter the **Delivery charge paid by me (seller)** (optional note as well) and preview the updated subtotal, delivery charge, discount, grand total, and COD.
- **Delayed Stock Return:** Returned items do **not** go back into sellable stock right away. Saving opens an inspection issue in **Stock → Issues**.
- Go to **Stock → Issues** and choose what condition each returned item came back in:
  - **✓ Good · Back to stock**: Adds the returned quantity back to sellable stock (`Ledger` entry with type `return`).
  - **✕ Bad · Loss by cost**: Does **not** add back to stock; calculates the loss using the product's cost (`qty × unit cost`), records it on the order row under `Return Loss (Cost)`, and logs it in `Change log`.
  - **Split Good / Bad**: When multiple pieces come back and some are good while some are damaged, split how many go back to stock vs how many are recorded as a loss by cost.
