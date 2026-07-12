//+------------------------------------------------------------------+
//|                                          MT5_TradeSync.mq5       |
//|            Real-time trade sync from MT5 to TradeOS backend      |
//+------------------------------------------------------------------+
#property copyright "TradeOS"
#property version   "1.00"
#property description "Syncs opened/modified/closed trades to TradeOS website in real-time"
#property strict

//+------------------------------------------------------------------+
//| Configuration - EDIT THESE                                       |
//+------------------------------------------------------------------+
input string BackendURL  = "https://tradeos-backend-twuw.onrender.com/api/broker/trade-update";
input string APIKey      = "";  // Optional: for authentication
input string AccountID   = "";  // Leave empty to auto-detect from MT5
input string BrokerName  = "MT5"; // Used for account mapping in Settings

//+------------------------------------------------------------------+
//| Includes                                                         |
//+------------------------------------------------------------------+
#include <JSON.mqh>  // Download from: https://github.com/dingmaotu/mql5-json

//+------------------------------------------------------------------+
//| Globals                                                          |
//+------------------------------------------------------------------+
string g_accountId = "";
string g_lastTradeIds[];      // Track known trades to detect new ones
string g_lastOrderTickets[];  // Track known pending orders
int    g_lastTotalTrades = -1;
int    g_lastTotalOrders = -1;
bool   g_firstRun = true;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit() {
   if (AccountID == "") {
      g_accountId = IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN));
   } else {
      g_accountId = AccountID;
   }

   // Allow WebRequest for our backend URL
   string allowedUrls[] = {BackendURL};
   if (!AllowWebRequest(allowedUrls)) {
      Print("⚠ MT5_TradeSync: WebRequest not enabled! Go to Tools → Options → Expert Advisors and add: " + BackendURL);
      return INIT_FAILED;
   }

   Print("✅ MT5_TradeSync initialized. Account: " + g_accountId);
   Print("   Backend: " + BackendURL);

   // Snapshot current state
   SnapshotTrades();
   g_firstRun = false;
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Expert tick function - polls every tick for changes              |
//+------------------------------------------------------------------+
void OnTick() {
   static datetime lastCheck = 0;
   if (TimeCurrent() - lastCheck < 2) return;  // Check every 2 seconds
   lastCheck = TimeCurrent();

   SyncTrades();
}

//+------------------------------------------------------------------+
//| Trade event handler - fires immediately on any trade change     |
//+------------------------------------------------------------------+
void OnTrade() {
   SyncTrades();
}

//+------------------------------------------------------------------+
//| Detect and sync trade changes                                   |
//+------------------------------------------------------------------+
void SyncTrades() {
   int totalTrades = PositionsTotal();
   int totalOrders = OrdersTotal();

   if (totalTrades == g_lastTotalTrades && totalOrders == g_lastTotalOrders && !g_firstRun) {
      return;  // No changes
   }

   // Check for new/modified trades
   for (int i = 0; i < totalTrades; i++) {
      ulong ticket = PositionGetTicket(i);
      if (ticket > 0 && PositionSelectByTicket(ticket)) {
         string tid = IntegerToString(ticket);
         if (!IsKnownTrade(tid)) {
            SendTradeData(ticket, "OPEN");
            AddKnownTrade(tid);
         }
      }
   }

   // Check for closed trades (tickets no longer in positions)
   CheckForClosedTrades();

   // Send pending orders
   SyncOrders();

   g_lastTotalTrades = totalTrades;
   g_lastTotalOrders = totalOrders;
}

//+------------------------------------------------------------------+
//| Send trade data to backend                                       |
//+------------------------------------------------------------------+
void SendTradeData(ulong ticket, string status) {
   if (!PositionSelectByTicket(ticket)) return;

   string symbol = PositionGetString(POSITION_SYMBOL);
   double volume = PositionGetDouble(POSITION_VOLUME);
   double openPrice = PositionGetDouble(POSITION_PRICE_OPEN);
   double currentPrice = PositionGetDouble(POSITION_PRICE_CURRENT);
   double sl = PositionGetDouble(POSITION_SL);
   double tp = PositionGetDouble(POSITION_TP);
   double profit = PositionGetDouble(POSITION_PROFIT);
   double swap = PositionGetDouble(POSITION_SWAP);
   double commission = PositionGetDouble(POSITION_COMMISSION);
   datetime openTime = (datetime)PositionGetInteger(POSITION_TIME);
   long type = PositionGetInteger(POSITION_TYPE);  // 0=BUY, 1=SELL
   string comment = PositionGetString(POSITION_COMMENT);
   ulong magic = PositionGetInteger(POSITION_MAGIC);

   // Build JSON
   CJAVal json;
   json["ticket"] = IntegerToString(ticket);
   json["account_id"] = g_accountId;
   json["broker"] = BrokerName;
   json["symbol"] = symbol;
   json["type"] = (type == 0 ? "BUY" : "SELL");
   json["volume"] = DoubleToString(volume, 2);
   json["open_price"] = DoubleToString(openPrice, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS));
   json["current_price"] = DoubleToString(currentPrice, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS));
   json["stop_loss"] = (sl == 0 ? "" : DoubleToString(sl, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS)));
   json["take_profit"] = (tp == 0 ? "" : DoubleToString(tp, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS)));
   json["profit"] = DoubleToString(profit, 2);
   json["swap"] = DoubleToString(swap, 2);
   json["commission"] = DoubleToString(commission, 2);
   json["open_time"] = TimeToString(openTime, TIME_DATE | TIME_SECONDS);
   json["status"] = status;
   json["comment"] = comment;
   json["magic"] = IntegerToString(magic);

   string payload = json.Serialize();
   string response = "";

   char data[];
   char result[];
   StringToCharArray(payload, data);

   string headers = "Content-Type: application/json\r\n";
   if (StringLen(APIKey) > 0) {
      headers += "X-API-Key: " + APIKey + "\r\n";
   }

   ResetLastError();
   int res = WebRequest("POST", BackendURL, headers, 5000, data, result, headers);
   if (res == -1) {
      Print("⚠ WebRequest failed: " + IntegerToString(GetLastError()));
      Print("   URL: " + BackendURL);
   } else {
      Print("✅ Trade synced: " + symbol + " " + (type == 0 ? "BUY" : "SELL") + " ticket=" + IntegerToString(ticket));
   }
}

//+------------------------------------------------------------------+
//| Check if a trade ticket is already known                         |
//+------------------------------------------------------------------+
bool IsKnownTrade(string ticket) {
   for (int i = 0; i < ArraySize(g_lastTradeIds); i++) {
      if (g_lastTradeIds[i] == ticket) return true;
   }
   return false;
}

//+------------------------------------------------------------------+
//| Add trade to known list                                          |
//+------------------------------------------------------------------+
void AddKnownTrade(string ticket) {
   int size = ArraySize(g_lastTradeIds);
   ArrayResize(g_lastTradeIds, size + 1);
   g_lastTradeIds[size] = ticket;
}

//+------------------------------------------------------------------+
//| Check for closed trades (positions no longer open)               |
//+------------------------------------------------------------------+
void CheckForClosedTrades() {
   int totalNow = PositionsTotal();
   int knownSize = ArraySize(g_lastTradeIds);

   // Get current tickets
   string currentTickets[];
   ArrayResize(currentTickets, totalNow);
   for (int i = 0; i < totalNow; i++) {
      ulong ticket = PositionGetTicket(i);
      currentTickets[i] = IntegerToString(ticket);
   }

   // Find closed ones
   for (int i = knownSize - 1; i >= 0; i--) {
      bool found = false;
      for (int j = 0; j < totalNow; j++) {
         if (g_lastTradeIds[i] == currentTickets[j]) { found = true; break; }
      }
      if (!found) {
         // Trade was closed - we can't get details, so send a close notification
         SendCloseNotification(g_lastTradeIds[i]);
         // Remove from known list
         for (int k = i; k < knownSize - 1; k++) g_lastTradeIds[k] = g_lastTradeIds[k+1];
         ArrayResize(g_lastTradeIds, knownSize - 1);
         knownSize--;
      }
   }
}

//+------------------------------------------------------------------+
//| Send close notification for a closed trade                       |
//+------------------------------------------------------------------+
void SendCloseNotification(string ticket) {
   // We don't have the trade details anymore, but we can try HistorySelect
   datetime now = TimeCurrent();
   HistorySelect(now - 86400 * 7, now);  // Last 7 days

   int total = HistoryDealsTotal();
   for (int i = total - 1; i >= 0; i--) {
      ulong dealTicket = HistoryDealGetTicket(i);
      if (dealTicket > 0) {
         string dealComment = HistoryDealGetString(dealTicket, DEAL_COMMENT);
         if (StringFind(dealComment, ticket) >= 0 || HistoryDealGetInteger(dealTicket, DEAL_ORDER) == (ulong)StringToInteger(ticket)) {
            // Found the closing deal
            CJAVal json;
            json["ticket"] = ticket;
            json["account_id"] = g_accountId;
            json["status"] = "CLOSED";
            json["close_price"] = DoubleToString(HistoryDealGetDouble(dealTicket, DEAL_PRICE), 5);
            json["profit"] = DoubleToString(HistoryDealGetDouble(dealTicket, DEAL_PROFIT), 2);
            json["close_time"] = TimeToString((datetime)HistoryDealGetInteger(dealTicket, DEAL_TIME), TIME_DATE | TIME_SECONDS);

            string payload = json.Serialize();
            char data[], result[];
            StringToCharArray(payload, data);
            string headers = "Content-Type: application/json\r\n";

            ResetLastError();
            WebRequest("POST", BackendURL, headers, 5000, data, result, headers);
            Print("✅ Close synced: ticket=" + ticket + " profit=" + DoubleToString(HistoryDealGetDouble(dealTicket, DEAL_PROFIT), 2));
            return;
         }
      }
   }

   // Fallback: just send ticket as closed
   CJAVal json;
   json["ticket"] = ticket;
   json["account_id"] = g_accountId;
   json["status"] = "CLOSED";

   string payload = json.Serialize();
   char data[], result[];
   StringToCharArray(payload, data);
   string headers = "Content-Type: application/json\r\n";

   ResetLastError();
   WebRequest("POST", BackendURL, headers, 5000, data, result, headers);
   Print("✅ Close synced (no history): ticket=" + ticket);
}

//+------------------------------------------------------------------+
//| Sync pending orders                                              |
//+------------------------------------------------------------------+
void SyncOrders() {
   int total = OrdersTotal();
   for (int i = 0; i < total; i++) {
      ulong ticket = OrderGetTicket(i);
      if (ticket > 0 && OrderSelect(ticket)) {
         string tid = IntegerToString(ticket);
         bool known = false;
         for (int j = 0; j < ArraySize(g_lastOrderTickets); j++) {
            if (g_lastOrderTickets[j] == tid) { known = true; break; }
         }
         if (!known) {
            string symbol = OrderGetString(ORDER_SYMBOL);
            double volume = OrderGetDouble(ORDER_VOLUME_CURRENT);
            double price = OrderGetDouble(ORDER_PRICE_OPEN);
            long type = OrderGetInteger(ORDER_TYPE);
            datetime openTime = (datetime)OrderGetInteger(ORDER_TIME_SETUP);

            CJAVal json;
            json["ticket"] = tid;
            json["account_id"] = g_accountId;
            json["symbol"] = symbol;
            json["type"] = (type == 0 ? "BUY_LIMIT" : type == 1 ? "SELL_LIMIT" : type == 2 ? "BUY_STOP" : "SELL_STOP");
            json["volume"] = DoubleToString(volume, 2);
            json["price"] = DoubleToString(price, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS));
            json["status"] = "PENDING";
            json["open_time"] = TimeToString(openTime, TIME_DATE | TIME_SECONDS);

            string payload = json.Serialize();
            char data[], result[];
            StringToCharArray(payload, data);
            string headers = "Content-Type: application/json\r\n";

            ResetLastError();
            WebRequest("POST", BackendURL, headers, 5000, data, result, headers);
            Print("📋 Order synced: " + symbol + " ticket=" + tid);

            int sz = ArraySize(g_lastOrderTickets);
            ArrayResize(g_lastOrderTickets, sz + 1);
            g_lastOrderTickets[sz] = tid;
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Take initial snapshot on startup                                 |
//+------------------------------------------------------------------+
void SnapshotTrades() {
   int total = PositionsTotal();
   for (int i = 0; i < total; i++) {
      ulong ticket = PositionGetTicket(i);
      if (ticket > 0) {
         string tid = IntegerToString(ticket);
         AddKnownTrade(tid);
         SendTradeData(ticket, "OPEN");
      }
   }
}

//+------------------------------------------------------------------+
//| Allow WebRequest helper                                          |
//+------------------------------------------------------------------+
bool AllowWebRequest(string &urls[]) {
   // This is a reminder - actual whitelisting must be done in MT5 UI:
   // Tools → Options → Expert Advisors → Allow WebRequest for
   Print("➡ Please ensure this URL is whitelisted in MT5:");
   Print("   " + BackendURL);
   return true;
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason) {
   Print("🛑 MT5_TradeSync stopped.");
}
//+------------------------------------------------------------------+
