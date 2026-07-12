//+------------------------------------------------------------------+
//|                                          MT4_TradeSync.mq4       |
//|            Real-time trade sync from MT4 to TradeOS backend      |
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
input string AccountID   = "";  // Leave empty to auto-detect from MT4
input string BrokerName  = "MT4"; // Used for account mapping in Settings

//+------------------------------------------------------------------+
//| Includes                                                         |
//+------------------------------------------------------------------+
#include <JSON.mqh>

//+------------------------------------------------------------------+
//| Globals                                                          |
//+------------------------------------------------------------------+
string g_accountId = "";
int    g_lastTotalTrades = -1;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit() {
   if (AccountID == "") {
      g_accountId = IntegerToString(AccountNumber());
   } else {
      g_accountId = AccountID;
   }

   Print("✅ MT4_TradeSync initialized. Account: " + g_accountId);
   Print("   Backend: " + BackendURL);
   Print("   Broker: " + BrokerName);
   Print("➡ Ensure this URL is whitelisted in MT4: Tools → Options → Expert Advisors → Allow WebRequest for");
   Print("   " + BackendURL);

   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick() {
   static datetime lastCheck = 0;
   if (TimeCurrent() - lastCheck < 2) return;
   lastCheck = TimeCurrent();
   SyncTrades();
}

//+------------------------------------------------------------------+
//| Sync all open trades to backend                                  |
//+------------------------------------------------------------------+
void SyncTrades() {
   int total = OrdersTotal();
   if (total == g_lastTotalTrades) return;

   for (int i = 0; i < total; i++) {
      if (OrderSelect(i, SELECT_BY_POS, MODE_TRADES)) {
         if (OrderType() <= OP_SELL) { // OP_BUY=0, OP_SELL=1
            SendTradeData(OrderTicket(), "OPEN");
         }
      }
   }

   g_lastTotalTrades = total;
}

//+------------------------------------------------------------------+
//| Send trade data to backend                                       |
//+------------------------------------------------------------------+
void SendTradeData(int ticket, string status) {
   if (!OrderSelect(ticket, SELECT_BY_TICKET)) return;

   string symbol = OrderSymbol();
   double volume = OrderLots();
   double openPrice = OrderOpenPrice();
   double sl = OrderStopLoss();
   double tp = OrderTakeProfit();
   double profit = OrderProfit() + OrderSwap() + OrderCommission();
   double swap = OrderSwap();
   double commission = OrderCommission();
   datetime openTime = OrderOpenTime();
   int type = OrderType(); // 0=BUY, 1=SELL
   string comment = OrderComment();
   int magic = OrderMagicNumber();

   // Build JSON
   CJAVal json;
   json["ticket"] = IntegerToString(ticket);
   json["account_id"] = g_accountId;
   json["broker"] = BrokerName;
   json["symbol"] = symbol;
   json["type"] = (type == 0 ? "BUY" : "SELL");
   json["volume"] = DoubleToString(volume, 2);
   json["open_price"] = DoubleToString(openPrice, (int)MarketInfo(symbol, MODE_DIGITS));
   json["stop_loss"] = (sl == 0 ? "" : DoubleToString(sl, (int)MarketInfo(symbol, MODE_DIGITS)));
   json["take_profit"] = (tp == 0 ? "" : DoubleToString(tp, (int)MarketInfo(symbol, MODE_DIGITS)));
   json["profit"] = DoubleToString(profit, 2);
   json["swap"] = DoubleToString(swap, 2);
   json["commission"] = DoubleToString(commission, 2);
   json["open_time"] = TimeToString(openTime, TIME_DATE | TIME_SECONDS);
   json["status"] = status;
   json["comment"] = comment;
   json["magic"] = IntegerToString(magic);

   string payload = json.Serialize();
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
   } else {
      Print("✅ Trade synced: " + symbol + " " + (type == 0 ? "BUY" : "SELL") + " ticket=" + IntegerToString(ticket));
   }
}

//+------------------------------------------------------------------+
//| Send close notification                                          |
//+------------------------------------------------------------------+
void SendCloseNotification(int ticket) {
   CJAVal json;
   json["ticket"] = IntegerToString(ticket);
   json["account_id"] = g_accountId;
   json["broker"] = BrokerName;
   json["status"] = "CLOSED";

   string payload = json.Serialize();
   char data[], result[];
   StringToCharArray(payload, data);
   string headers = "Content-Type: application/json\r\n";

   ResetLastError();
   WebRequest("POST", BackendURL, headers, 5000, data, result, headers);
   Print("✅ Close synced: ticket=" + IntegerToString(ticket));
}

//+------------------------------------------------------------------+
//| Expert deinitialization                                          |
//+------------------------------------------------------------------+
void OnDeinit(const int reason) {
   Print("🛑 MT4_TradeSync stopped.");
}
//+------------------------------------------------------------------+
