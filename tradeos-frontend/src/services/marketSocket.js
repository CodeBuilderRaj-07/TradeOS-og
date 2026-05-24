let socket = null;

let reconnectTimeout =
  null;

let reconnectAttempts = 0;

const MAX_RECONNECTS = 5;

const RECONNECT_DELAY =
  3000;

const SOCKET_URL =
  "wss://stream.binance.com:9443/ws/btcusdt@kline_1m";

/* Connect Socket */
export const connectMarketSocket =
  (
    onCandleUpdate
  ) => {

    // Prevent Duplicate Connections
    if (
      socket &&
      socket.readyState ===
        WebSocket.OPEN
    ) {

      return;
    }

    socket =
      new WebSocket(
        SOCKET_URL
      );

    socket.onopen =
      () => {

        console.log(
          "✅ Binance WebSocket Connected"
        );

        reconnectAttempts = 0;
      };

    socket.onmessage =
      (event) => {

        try {

          const message =
            JSON.parse(
              event.data
            );

          const candle =
            message.k;

          if (!candle)
            return;

          onCandleUpdate({

            time:
              candle.t /
              1000,

            open:
              parseFloat(
                candle.o
              ),

            high:
              parseFloat(
                candle.h
              ),

            low:
              parseFloat(
                candle.l
              ),

            close:
              parseFloat(
                candle.c
              ),
          });

        } catch (error) {

          console.error(
            "❌ WebSocket Parse Error:",
            error
          );
        }
      };

    socket.onerror =
      (error) => {

        console.error(
          "❌ WebSocket Error:",
          error
        );
      };

    socket.onclose =
      () => {

        console.warn(
          "⚠️ WebSocket Closed"
        );

        socket = null;

        // Reconnect Strategy
        if (
          reconnectAttempts <
          MAX_RECONNECTS
        ) {

          reconnectAttempts++;

          reconnectTimeout =
            setTimeout(
              () => {

                console.log(

                  `🔄 Reconnecting WebSocket (${reconnectAttempts}/${MAX_RECONNECTS})`
                );

                connectMarketSocket(
                  onCandleUpdate
                );

              },

              RECONNECT_DELAY
            );
        }
      };
  };

/* Disconnect Socket */
export const disconnectMarketSocket =
  () => {

    if (
      reconnectTimeout
    ) {

      clearTimeout(
        reconnectTimeout
      );
    }

    if (socket) {

      socket.close();

      socket = null;
    }
  };