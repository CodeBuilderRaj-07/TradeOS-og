let socket = null;

let reconnectTimeout =
  null;

let reconnectAttempts = 0;

const MAX_RECONNECTS = 5;

const RECONNECT_DELAY =
  3000;

let currentStream = "";

/* Connect Socket */
export const connectMarketSocket =
  (
    onCandleUpdate,
    streamSymbol = "btcusdt",
    interval = "1m"
  ) => {

    const stream = `${streamSymbol}@kline_${interval}`;

    // Reuse if already connected to same stream
    if (
      socket &&
      socket.readyState ===
        WebSocket.OPEN &&
      currentStream === stream
    ) {
      return;
    }

    // Close existing if different stream
    if (socket) {
      socket.close();
      socket = null;
    }

    currentStream = stream;

    socket =
      new WebSocket(
        `wss://stream.binance.com:9443/ws/${stream}`
      );

    socket.onopen =
      () => {

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

        }
      };

    socket.onerror =
      (error) => {

      };

    socket.onclose =
      () => {

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