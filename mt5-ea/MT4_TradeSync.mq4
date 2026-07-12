//+------------------------------------------------------------------+
//|                                          MT4_TradeSync.mq4       |
//|     Real-time bidirectional trade sync MT4 ↔ TradeOS backend    |
//+------------------------------------------------------------------+
#property copyright "TradeOS"
#property version   "2.00"
#property description "Syncs trades to TradeOS + executes broker commands (close, SL/TP, BE)"
#property strict

//+------------------------------------------------------------------+
//| Configuration                                                    |
//+------------------------------------------------------------------+
input string BackendURL   = "https://tradeos-backend-twuw.onrender.com";
input string APIToken     = "";  // Paste from Settings > API Token
input string AccountID    = "";  // Leave empty to auto-detect
input string BrokerName   = "MT4";

//+------------------------------------------------------------------+
//| Globals                                                          |
//+------------------------------------------------------------------+
string g_accountId;
string g_tradeEndpoint;
string g_pendingEndpoint;
string g_ackEndpoint;
int    g_lastTotalTrades = -1;

//+------------------------------------------------------------------+
//| Expert initialization                                            |
//+------------------------------------------------------------------+
int OnInit() {
   g_accountId = (AccountID == "") ? IntegerToString(AccountNumber()) : AccountID;
   string tokenParam = (StringLen(APIToken) > 0) ? "&token=" + APIToken : "";
   g_tradeEndpoint = BackendURL + "/api/broker/trade-update" + (StringLen(APIToken) > 0 ? "?token=" + APIToken : "");
   g_pendingEndpoint = BackendURL + "/api/broker/commands/pending?accountId=" + g_accountId + tokenParam;
   g_ackEndpoint = BackendURL + "/api/broker/commands/";

   Print("MT4_TradeSync v2 initialized. Account: " + g_accountId);
   Print("Broker: " + BrokerName + " | Backend: " + BackendURL);
   Print("Ensure " + BackendURL + " is whitelisted in Tools > Options > Expert Advisors");
   return INIT_SUCCEEDED;
}



//+------------------------------------------------------------------+
//| OnTick                                                           |
//+------------------------------------------------------------------+
void OnTick() {
   static datetime lastCheck = 0;
   if (TimeCurrent() - lastCheck < 2) return;
   lastCheck = TimeCurrent();

   SyncTradesToBackend();
   PollAndExecuteCommands();
}

//+------------------------------------------------------------------+
//| Push open trades to backend                                      |
//+------------------------------------------------------------------+
void SyncTradesToBackend() {
   int total = OrdersTotal();
   if (total == g_lastTotalTrades) return;

   for (int i = 0; i < total; i++) {
      if (OrderSelect(i, SELECT_BY_POS, MODE_TRADES)) {
         if (OrderType() <= OP_SELL) {
            SendTradeData(OrderTicket(), "OPEN");
         }
      }
   }

   g_lastTotalTrades = total;
}

//+------------------------------------------------------------------+
//| Poll and execute pending commands                                |
//+------------------------------------------------------------------+
void PollAndExecuteCommands() {
   char emptyData[], resultData[];
   string responseHeaders = "";

   ResetLastError();
   int res = WebRequest("GET", g_pendingEndpoint, "", "", 5000, emptyData, resultData, responseHeaders);

   if (res == -1) return;
   string responseData = CharArrayToString(resultData);
   if (responseData == "" || responseData == "[]") return;

   string entries[];
   int entryCount = ParseJSONArray(responseData, entries);

   for (int e = 0; e < entryCount; e++) {
      string cmdId     = GetJSONValue(entries[e], "\"id\"");
      string cmdType   = GetJSONValue(entries[e], "\"command\"");
      string cmdTicket = GetJSONValue(entries[e], "\"ticket\"");
      string cmdParams = GetJSONValue(entries[e], "\"params\"");

      if (cmdId == "") continue;

      bool success = false;
      string errorMsg = "";

      if (cmdType == "CLOSE" && cmdTicket != "") {
         success = ExecuteClose(cmdTicket, errorMsg);
      } else if (cmdType == "MODIFY_SL" || cmdType == "MODIFY_TP" || cmdType == "MODIFY_SL_TP") {
         double sl = StrToDouble(GetJSONValue(cmdParams, "\"sl\""));
         double tp = StrToDouble(GetJSONValue(cmdParams, "\"tp\""));
         success = ExecuteModifySLTP(cmdTicket, sl, tp, errorMsg);
      } else if (cmdType == "MOVE_BE") {
         double bePrice = StrToDouble(GetJSONValue(cmdParams, "\"sl\""));
         success = ExecuteMoveBE(cmdTicket, bePrice, errorMsg);
      } else if (cmdType == "PLACE_ORDER") {
         string sym = GetJSONValue(cmdParams, "\"symbol\"");
         string typ = GetJSONValue(cmdParams, "\"type\"");
         double vol = StrToDouble(GetJSONValue(cmdParams, "\"volume\""));
         double sl  = StrToDouble(GetJSONValue(cmdParams, "\"sl\""));
         double tp  = StrToDouble(GetJSONValue(cmdParams, "\"tp\""));
         success = ExecutePlaceOrder(sym, typ, vol, sl, tp, errorMsg);
      }

      string ackPayload = "{\"status\":\"" + (success ? "DONE" : "FAILED") + "\"";
      if (!success && errorMsg != "") ackPayload += ",\"error\":\"" + errorMsg + "\"";
      ackPayload += "}";

      string ackURL = g_ackEndpoint + cmdId + "/ack";
      char ackData[], ackResult[];
      string ackRespHeaders = "";
      StringToCharArray(ackPayload, ackData);

      ResetLastError();
      WebRequest("POST", ackURL, "", "", 5000, ackData, ackResult, ackRespHeaders);
   }
}

//+------------------------------------------------------------------+
//| Execute CLOSE                                                    |
//+------------------------------------------------------------------+
bool ExecuteClose(string ticketStr, string &error) {
   int ticket = StrToInteger(ticketStr);
   if (ticket <= 0) { error = "Invalid ticket"; return false; }
   if (!OrderSelect(ticket, SELECT_BY_TICKET)) { error = "Order not found"; return false; }

   color arrowColor = (OrderType() == OP_BUY) ? Red : Lime;
   ResetLastError();
   if (!OrderClose(ticket, OrderLots(), OrderClosePrice(), 50, arrowColor)) {
      error = "OrderClose failed: " + IntegerToString(GetLastError());
      return false;
   }
   Print("Closed ticket=" + ticketStr);
   return true;
}

//+------------------------------------------------------------------+
//| Execute MODIFY SL/TP                                             |
//+------------------------------------------------------------------+
bool ExecuteModifySLTP(string ticketStr, double sl, double tp, string &error) {
   int ticket = StrToInteger(ticketStr);
   if (ticket <= 0) { error = "Invalid ticket"; return false; }
   if (!OrderSelect(ticket, SELECT_BY_TICKET)) { error = "Order not found"; return false; }

   double newSL = (sl > 0) ? sl : OrderStopLoss();
   double newTP = (tp > 0) ? tp : OrderTakeProfit();

   ResetLastError();
   if (!OrderModify(ticket, OrderOpenPrice(), newSL, newTP, 0)) {
      error = "OrderModify failed: " + IntegerToString(GetLastError());
      return false;
   }
   Print("Modified ticket=" + ticketStr + " sl=" + DoubleToStr(sl) + " tp=" + DoubleToStr(tp));
   return true;
}

//+------------------------------------------------------------------+
//| Execute MOVE_BE                                                  |
//+------------------------------------------------------------------+
bool ExecuteMoveBE(string ticketStr, double bePrice, string &error) {
   int ticket = StrToInteger(ticketStr);
   if (ticket <= 0) { error = "Invalid ticket"; return false; }
   if (!OrderSelect(ticket, SELECT_BY_TICKET)) { error = "Order not found"; return false; }

   ResetLastError();
   if (!OrderModify(ticket, OrderOpenPrice(), bePrice, OrderTakeProfit(), 0)) {
      error = "OrderModify failed: " + IntegerToString(GetLastError());
      return false;
   }
   Print("Moved to BE ticket=" + ticketStr);
   return true;
}

//+------------------------------------------------------------------+
//| Execute PLACE_ORDER                                              |
//+------------------------------------------------------------------+
bool ExecutePlaceOrder(string symbol, string type, double volume, double sl, double tp, string &error) {
   int cmd = (type == "BUY") ? OP_BUY : OP_SELL;
   double price = (cmd == OP_BUY) ? Ask : Bid;

   ResetLastError();
   int ticket = OrderSend(symbol, cmd, volume, price, 50, (sl > 0 ? sl : 0), (tp > 0 ? tp : 0), "TradeOS", 123456, 0, (cmd == OP_BUY) ? Green : Red);
   if (ticket < 0) {
      error = "OrderSend failed: " + IntegerToString(GetLastError());
      return false;
   }
   Print("Placed order " + symbol + " " + type + " vol=" + DoubleToStr(volume));
   return true;
}

//+------------------------------------------------------------------+
//| Send trade data                                                  |
//+------------------------------------------------------------------+
void SendTradeData(int ticket, string status) {
   if (!OrderSelect(ticket, SELECT_BY_TICKET)) return;

   string symbol = OrderSymbol();
   double volume = OrderLots();
   double openPrice = OrderOpenPrice();
   double sl = OrderStopLoss();
   double tp = OrderTakeProfit();
   double profit = OrderProfit() + OrderSwap() + OrderCommission();
   datetime openTime = OrderOpenTime();
   int type = OrderType();
   string comment = OrderComment();
   int magic = OrderMagicNumber();

   string payload = "{";
   payload += "\"ticket\":\"" + IntegerToString(ticket) + "\",";
   payload += "\"account_id\":\"" + g_accountId + "\",";
   payload += "\"broker\":\"" + BrokerName + "\",";
   payload += "\"symbol\":\"" + symbol + "\",";
   payload += "\"type\":\"" + (type == 0 ? "BUY" : "SELL") + "\",";
   payload += "\"volume\":\"" + DoubleToStr(volume, 2) + "\",";
   payload += "\"open_price\":\"" + DoubleToStr(openPrice, (int)MarketInfo(symbol, MODE_DIGITS)) + "\",";
   payload += "\"stop_loss\":\"" + (sl == 0 ? "" : DoubleToStr(sl, (int)MarketInfo(symbol, MODE_DIGITS))) + "\",";
   payload += "\"take_profit\":\"" + (tp == 0 ? "" : DoubleToStr(tp, (int)MarketInfo(symbol, MODE_DIGITS))) + "\",";
   payload += "\"profit\":\"" + DoubleToStr(profit, 2) + "\",";
   payload += "\"open_time\":\"" + TimeToStr(openTime, TIME_DATE | TIME_SECONDS) + "\",";
   payload += "\"status\":\"" + status + "\",";
   payload += "\"comment\":\"" + comment + "\",";
   payload += "\"magic\":\"" + IntegerToString(magic) + "\"";
   payload += "}";

   char data[], result[];
   string respHeaders = "";
   StringToCharArray(payload, data);

   ResetLastError();
   WebRequest("POST", g_tradeEndpoint, "", "", 5000, data, result, respHeaders);
}

//+------------------------------------------------------------------+
//| JSON helpers                                                     |
//+------------------------------------------------------------------+
int ParseJSONArray(string json, string &entries[]) {
   ArrayResize(entries, 0);
   int len = StringLen(json);
   int depth = 0;
   string current = "";
   bool inString = false;
   int count = 0;

   for (int i = 0; i < len; i++) {
      int c = StringGetChar(json, i);
      if (c == '"' && (i == 0 || StringGetChar(json, i-1) != '\\')) inString = !inString;
      if (!inString) {
         if (c == '{') depth++;
         if (c == '}') depth--;
      }
      if (!inString && depth == 0 && c == ',') {
         if (current != "") {
            ArrayResize(entries, count + 1);
            entries[count] = current;
            count++;
         }
         current = "";
         continue;
      }
      current += ShortToString(c);
   }
   if (current != "") {
      ArrayResize(entries, count + 1);
      entries[count] = current;
      count++;
   }
   return count;
}

string GetJSONValue(string json, string key) {
   int pos = StringFind(json, key);
   if (pos < 0) return "";
   pos += StringLen(key) + 1;
   if (pos >= StringLen(json)) return "";
   while (pos < StringLen(json) && (StringGetChar(json, pos) == ' ' || StringGetChar(json, pos) == ':')) pos++;
   if (pos >= StringLen(json)) return "";
   int first = StringGetChar(json, pos);
   if (first == '"') {
      pos++;
      string result = "";
      for (int i = pos; i < StringLen(json); i++) {
         int c = StringGetChar(json, i);
         if (c == '"') break;
         if (c == '\\') { i++; if (i < StringLen(json)) result += ShortToString(StringGetChar(json, i)); }
         else result += ShortToString(c);
      }
      return result;
   }
   string result = "";
   for (int i = pos; i < StringLen(json); i++) {
      int c = StringGetChar(json, i);
      if (c == ',' || c == '}' || c == ']') break;
      result += ShortToString(c);
   }
   return result;
}

void OnDeinit(const int reason) {
   Print("MT4_TradeSync stopped.");
}
//+------------------------------------------------------------------+
