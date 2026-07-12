//+------------------------------------------------------------------+
//|                                          MT5_TradeSync.mq5       |
//|     Real-time bidirectional trade sync MT5 ↔ TradeOS backend    |
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
input string BrokerName   = "MT5";

//+------------------------------------------------------------------+
//| Globals                                                          |
//+------------------------------------------------------------------+
string g_accountId;
string g_tradeEndpoint;
string g_pendingEndpoint;
string g_ackEndpoint;
int    g_lastTotalTrades = -1;
string g_lastTradeIds[];

//+------------------------------------------------------------------+
//| Expert initialization                                            |
//+------------------------------------------------------------------+
int OnInit() {
   g_accountId = (AccountID == "") ? IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)) : AccountID;
   g_tradeEndpoint = BackendURL + "/api/broker/trade-update";
   g_pendingEndpoint = BackendURL + "/api/broker/commands/pending?accountId=" + g_accountId;
   g_ackEndpoint = BackendURL + "/api/broker/commands/";

   Print("✅ MT5_TradeSync v2 initialized. Account: " + g_accountId);
   Print("   Broker: " + BrokerName);
   Print("   Backend: " + BackendURL);
   Print("➡ Ensure " + BackendURL + " is whitelisted in Tools → Options → Expert Advisors");

   SnapshotTrades();
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Build request headers with API token                              |
//+------------------------------------------------------------------+
string AuthHeaders() {
   string h = "Content-Type: application/json\r\n";
   if (StringLen(APIToken) > 0) {
      h += "X-API-Token: " + APIToken + "\r\n";
   }
   return h;
}

//+------------------------------------------------------------------+
//| OnTick - poll for changes and pending commands                   |
//+------------------------------------------------------------------+
void OnTick() {
   static datetime lastCheck = 0;
   if (TimeCurrent() - lastCheck < 2) return;
   lastCheck = TimeCurrent();

   SyncTradesToBackend();
   PollAndExecuteCommands();
}

//+------------------------------------------------------------------+
//| OnTrade - immediate trigger on trade change                      |
//+------------------------------------------------------------------+
void OnTrade() {
   SyncTradesToBackend();
}

//+------------------------------------------------------------------+
//| Push open trades to backend                                      |
//+------------------------------------------------------------------+
void SyncTradesToBackend() {
   int total = PositionsTotal();
   if (total == g_lastTotalTrades) return;

   for (int i = 0; i < total; i++) {
      ulong ticket = PositionGetTicket(i);
      if (ticket > 0 && PositionSelectByTicket(ticket)) {
         string tid = IntegerToString(ticket);
         if (!IsKnownTrade(tid)) {
            SendTradeData(ticket, "OPEN");
            AddKnownTrade(tid);
         }
      }
   }

   CheckForClosedTrades();
   SyncOrders();
   g_lastTotalTrades = total;
}

//+------------------------------------------------------------------+
//| Poll for pending commands and execute them                       |
//+------------------------------------------------------------------+
void PollAndExecuteCommands() {
   string responseHeaders = "";
   string responseData = "";

   ResetLastError();
   string pollHeaders = AuthHeaders();
   int res = WebRequest("GET", g_pendingEndpoint, pollHeaders, 5000, responseData, responseHeaders);

   if (res == -1) {
      int err = GetLastError();
      if (err != 0) Print("⚠ Poll commands WebRequest error: " + IntegerToString(err));
      return;
   }

   if (responseData == "" || responseData == "[]") return;

   // Parse JSON array manually or with JSON lib
   // {"id":1,"accountId":"...","command":"CLOSE","ticket":"...","params":"{...}","status":"PENDING"}
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
         double sl = StringToDouble(GetJSONValue(cmdParams, "\"sl\""));
         double tp = StringToDouble(GetJSONValue(cmdParams, "\"tp\""));
         success = ExecuteModifySLTP(cmdTicket, sl, tp, errorMsg);
      } else if (cmdType == "MOVE_BE") {
         double bePrice = StringToDouble(GetJSONValue(cmdParams, "\"sl\""));
         success = ExecuteMoveBE(cmdTicket, bePrice, errorMsg);
      } else if (cmdType == "PLACE_ORDER") {
         string sym   = GetJSONValue(cmdParams, "\"symbol\"");
         string typ   = GetJSONValue(cmdParams, "\"type\"");
         double vol   = StringToDouble(GetJSONValue(cmdParams, "\"volume\""));
         double price = StringToDouble(GetJSONValue(cmdParams, "\"price\""));
         double sl    = StringToDouble(GetJSONValue(cmdParams, "\"sl\""));
         double tp    = StringToDouble(GetJSONValue(cmdParams, "\"tp\""));
         success = ExecutePlaceOrder(sym, typ, vol, price, sl, tp, errorMsg);
      }

      // Send ack
      string ackPayload = "{\"status\":\"" + (success ? "DONE" : "FAILED") + "\"";
      if (!success && errorMsg != "") ackPayload += ",\"error\":\"" + errorMsg + "\"";
      ackPayload += "}";

      string ackURL = g_ackEndpoint + cmdId + "/ack";
      char ackData[], ackResult[];
      StringToCharArray(ackPayload, ackData);
      string ackHeaders = AuthHeaders();

      ResetLastError();
      WebRequest("POST", ackURL, ackHeaders, 5000, ackData, ackResult, ackHeaders);
   }
}

//+------------------------------------------------------------------+
//| Execute CLOSE command                                            |
//+------------------------------------------------------------------+
bool ExecuteClose(string ticketStr, string &error) {
   ulong ticket = StringToInteger(ticketStr);
   if (ticket <= 0) { error = "Invalid ticket"; return false; }

   if (!PositionSelectByTicket(ticket)) { error = "Position not found"; return false; }

   MqlTradeRequest req = {};
   MqlTradeResult res = {};
   req.action = TRADE_ACTION_DEAL;
   req.position = ticket;
   req.symbol = PositionGetString(POSITION_SYMBOL);
   req.volume = PositionGetDouble(POSITION_VOLUME);
   req.deviation = 50;
   req.type = (PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY) ? ORDER_TYPE_SELL : ORDER_TYPE_BUY;
   req.magic = (int)PositionGetInteger(POSITION_MAGIC);

   ResetLastError();
   if (!OrderSend(req, res)) {
      error = "OrderSend failed: " + IntegerToString(GetLastError());
      return false;
   }
   if (res.retcode != TRADE_RETCODE_DONE) {
      error = "Close rejected: " + IntegerToString(res.retcode);
      return false;
   }
   Print("✅ Executed CLOSE ticket=" + ticketStr);
   return true;
}

//+------------------------------------------------------------------+
//| Execute MODIFY SL/TP command                                     |
//+------------------------------------------------------------------+
bool ExecuteModifySLTP(string ticketStr, double sl, double tp, string &error) {
   ulong ticket = StringToInteger(ticketStr);
   if (ticket <= 0) { error = "Invalid ticket"; return false; }
   if (!PositionSelectByTicket(ticket)) { error = "Position not found"; return false; }

   MqlTradeRequest req = {};
   MqlTradeResult res = {};
   req.action = TRADE_ACTION_SLTP;
   req.position = ticket;
   req.symbol = PositionGetString(POSITION_SYMBOL);
   req.sl = (sl > 0) ? sl : PositionGetDouble(POSITION_SL);
   req.tp = (tp > 0) ? tp : PositionGetDouble(POSITION_TP);
   req.magic = (int)PositionGetInteger(POSITION_MAGIC);

   ResetLastError();
   if (!OrderSend(req, res)) {
      error = "OrderSend failed: " + IntegerToString(GetLastError());
      return false;
   }
   if (res.retcode != TRADE_RETCODE_DONE) {
      error = "Modify rejected: " + IntegerToString(res.retcode);
      return false;
   }
   Print("✅ Modified SL/TP ticket=" + ticketStr + " sl=" + DoubleToString(sl) + " tp=" + DoubleToString(tp));
   return true;
}

//+------------------------------------------------------------------+
//| Execute MOVE_BE command                                          |
//+------------------------------------------------------------------+
bool ExecuteMoveBE(string ticketStr, double bePrice, string &error) {
   ulong ticket = StringToInteger(ticketStr);
   if (ticket <= 0) { error = "Invalid ticket"; return false; }
   if (!PositionSelectByTicket(ticket)) { error = "Position not found"; return false; }

   MqlTradeRequest req = {};
   MqlTradeResult res = {};
   req.action = TRADE_ACTION_SLTP;
   req.position = ticket;
   req.symbol = PositionGetString(POSITION_SYMBOL);
   req.sl = bePrice;
   req.tp = PositionGetDouble(POSITION_TP);
   req.magic = (int)PositionGetInteger(POSITION_MAGIC);

   ResetLastError();
   if (!OrderSend(req, res)) {
      error = "OrderSend failed: " + IntegerToString(GetLastError());
      return false;
   }
   if (res.retcode != TRADE_RETCODE_DONE) {
      error = "Move BE rejected: " + IntegerToString(res.retcode);
      return false;
   }
   Print("✅ Moved to BE ticket=" + ticketStr);
   return true;
}

//+------------------------------------------------------------------+
//| Execute PLACE_ORDER command                                      |
//+------------------------------------------------------------------+
bool ExecutePlaceOrder(string symbol, string type, double volume, double price, double sl, double tp, string &error) {
   MqlTradeRequest req = {};
   MqlTradeResult res = {};
   req.action = TRADE_ACTION_DEAL;
   req.symbol = symbol;
   req.volume = volume;
   req.deviation = 50;
   req.type = (type == "BUY") ? ORDER_TYPE_BUY : ORDER_TYPE_SELL;
   req.sl = (sl > 0) ? sl : 0;
   req.tp = (tp > 0) ? tp : 0;
   req.magic = 123456;

   ResetLastError();
   if (!OrderSend(req, res)) {
      error = "OrderSend failed: " + IntegerToString(GetLastError());
      return false;
   }
   if (res.retcode != TRADE_RETCODE_DONE) {
      error = "Order rejected: " + IntegerToString(res.retcode);
      return false;
   }
   Print("✅ Placed order " + symbol + " " + type + " vol=" + DoubleToString(volume));
   return true;
}

//+------------------------------------------------------------------+
//| Send trade data to backend                                        |
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
   long type = PositionGetInteger(POSITION_TYPE);
   string comment = PositionGetString(POSITION_COMMENT);
   ulong magic = PositionGetInteger(POSITION_MAGIC);

   string payload = "{";
   payload += "\"ticket\":\"" + IntegerToString(ticket) + "\",";
   payload += "\"account_id\":\"" + g_accountId + "\",";
   payload += "\"broker\":\"" + BrokerName + "\",";
   payload += "\"symbol\":\"" + symbol + "\",";
   payload += "\"type\":\"" + (type == 0 ? "BUY" : "SELL") + "\",";
   payload += "\"volume\":\"" + DoubleToString(volume, 2) + "\",";
   payload += "\"open_price\":\"" + DoubleToString(openPrice, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS)) + "\",";
   payload += "\"stop_loss\":\"" + (sl == 0 ? "" : DoubleToString(sl, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS))) + "\",";
   payload += "\"take_profit\":\"" + (tp == 0 ? "" : DoubleToString(tp, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS))) + "\",";
   payload += "\"profit\":\"" + DoubleToString(profit, 2) + "\",";
   payload += "\"swap\":\"" + DoubleToString(swap, 2) + "\",";
   payload += "\"commission\":\"" + DoubleToString(commission, 2) + "\",";
   payload += "\"open_time\":\"" + TimeToString(openTime, TIME_DATE | TIME_SECONDS) + "\",";
   payload += "\"status\":\"" + status + "\",";
   payload += "\"comment\":\"" + comment + "\",";
   payload += "\"magic\":\"" + IntegerToString(magic) + "\"";
   payload += "}";

   char data[], result[];
   StringToCharArray(payload, data);
   string headers = AuthHeaders();

   ResetLastError();
   int res = WebRequest("POST", g_tradeEndpoint, headers, 5000, data, result, headers);
   if (res == -1) {
      Print("⚠ Trade sync WebRequest error: " + IntegerToString(GetLastError()));
   }
}

//+------------------------------------------------------------------+
//| Helper: parse JSON array into string entries                     |
//+------------------------------------------------------------------+
int ParseJSONArray(string json, string &entries[]) {
   entries = {};
   int len = StringLen(json);
   int depth = 0;
   string current = "";
   bool inString = false;
   int count = 0;

   for (int i = 0; i < len; i++) {
      ushort c = StringGetCharacter(json, i);
      if (c == '"' && (i == 0 || StringGetCharacter(json, i-1) != '\\')) inString = !inString;
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

//+------------------------------------------------------------------+
//| Helper: extract value from JSON key                               |
//+------------------------------------------------------------------+
string GetJSONValue(string json, string key) {
   int pos = StringFind(json, key);
   if (pos < 0) return "";
   pos += StringLen(key) + 1;
   if (pos >= StringLen(json)) return "";

   // Skip whitespace and colon
   while (pos < StringLen(json) && (StringGetCharacter(json, pos) == ' ' || StringGetCharacter(json, pos) == ':')) pos++;

   if (pos >= StringLen(json)) return "";

   ushort first = StringGetCharacter(json, pos);
   if (first == '"') {
      pos++;
      string result = "";
      for (int i = pos; i < StringLen(json); i++) {
         ushort c = StringGetCharacter(json, i);
         if (c == '"') break;
         if (c == '\\') { i++; if (i < StringLen(json)) result += ShortToString(StringGetCharacter(json, i)); }
         else result += ShortToString(c);
      }
      return result;
   }
   // Number or boolean
   string result = "";
   for (int i = pos; i < StringLen(json); i++) {
      ushort c = StringGetCharacter(json, i);
      if (c == ',' || c == '}' || c == ']') break;
      result += ShortToString(c);
   }
   return result;
}

//+------------------------------------------------------------------+
//| Known trade tracking                                             |
//+------------------------------------------------------------------+
bool IsKnownTrade(string ticket) {
   for (int i = 0; i < ArraySize(g_lastTradeIds); i++)
      if (g_lastTradeIds[i] == ticket) return true;
   return false;
}

void AddKnownTrade(string ticket) {
   int size = ArraySize(g_lastTradeIds);
   ArrayResize(g_lastTradeIds, size + 1);
   g_lastTradeIds[size] = ticket;
}

void CheckForClosedTrades() {
   int totalNow = PositionsTotal();
   int knownSize = ArraySize(g_lastTradeIds);
   string currentTickets[];
   ArrayResize(currentTickets, totalNow);
   for (int i = 0; i < totalNow; i++) {
      ulong ticket = PositionGetTicket(i);
      currentTickets[i] = IntegerToString(ticket);
   }
   for (int i = knownSize - 1; i >= 0; i--) {
      bool found = false;
      for (int j = 0; j < totalNow; j++) {
         if (g_lastTradeIds[i] == currentTickets[j]) { found = true; break; }
      }
      if (!found) {
         string tid = g_lastTradeIds[i];
         SendCloseNotification(tid);
         for (int k = i; k < knownSize - 1; k++) g_lastTradeIds[k] = g_lastTradeIds[k+1];
         ArrayResize(g_lastTradeIds, knownSize - 1);
         knownSize--;
      }
   }
}

void SendCloseNotification(string ticket) {
   string payload = "{\"ticket\":\"" + ticket + "\",\"account_id\":\"" + g_accountId + "\",\"broker\":\"" + BrokerName + "\",\"status\":\"CLOSED\"}";
   char data[], result[];
   StringToCharArray(payload, data);
   string headers = AuthHeaders();
   ResetLastError();
   WebRequest("POST", g_tradeEndpoint, headers, 5000, data, result, headers);
}

void SyncOrders() {
   int total = OrdersTotal();
   for (int i = 0; i < total; i++) {
      ulong ticket = OrderGetTicket(i);
      if (ticket > 0 && OrderSelect(ticket)) {
         string payload = "{\"ticket\":\"" + IntegerToString(ticket) + "\",\"account_id\":\"" + g_accountId + "\",\"broker\":\"" + BrokerName + "\",\"symbol\":\"" + OrderGetString(ORDER_SYMBOL) + "\",\"type\":\"PENDING\",\"volume\":\"" + DoubleToString(OrderGetDouble(ORDER_VOLUME_CURRENT), 2) + "\",\"status\":\"PENDING\"}";
         char data[], result[];
         StringToCharArray(payload, data);
         string headers = AuthHeaders();
         ResetLastError();
         WebRequest("POST", g_tradeEndpoint, headers, 5000, data, result, headers);
      }
   }
}

void SnapshotTrades() {
   int total = PositionsTotal();
   for (int i = 0; i < total; i++) {
      ulong ticket = PositionGetTicket(i);
      if (ticket > 0) {
         AddKnownTrade(IntegerToString(ticket));
         SendTradeData(ticket, "OPEN");
      }
   }
}

void OnDeinit(const int reason) {
   Print("MT5_TradeSync stopped.");
}
//+------------------------------------------------------------------+
