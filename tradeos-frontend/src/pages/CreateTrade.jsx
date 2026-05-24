import {
  useState,
} from "react";

import {
  TrendingUp,
} from "lucide-react";

import API from "../services/api";

export default function CreateTrade() {

  const [formData, setFormData] =
    useState({

      symbol: "",

      tradeType: "BUY",

      entryPrice: "",

      stopLoss: "",

      takeProfit: "",

      pnl: "",

      status: "OPEN",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const createTrade =
    async () => {

      try {

        setLoading(true);

        await API.post(
          "/trades/create",
          {

            ...formData,

            entryPrice:
              Number(
                formData.entryPrice
              ),

            stopLoss:
              Number(
                formData.stopLoss
              ),

            takeProfit:
              Number(
                formData.takeProfit
              ),

            pnl:
              Number(
                formData.pnl
              ),
          }
        );

        alert(
          "Trade Created Successfully"
        );

        setFormData({

          symbol: "",

          tradeType: "BUY",

          entryPrice: "",

          stopLoss: "",

          takeProfit: "",

          pnl: "",

          status: "OPEN",
        });

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  const risk =
    Math.abs(
      formData.entryPrice -
      formData.stopLoss
    );

  const reward =
    Math.abs(
      formData.takeProfit -
      formData.entryPrice
    );

  const rr =
    risk > 0
      ? (
          reward / risk
        ).toFixed(2)
      : 0;

  return (

    <div>

      <div>

        <h1 className="page-title">
          Create Trade
        </h1>

        <p className="page-subtitle">
          Execute and track your positions
        </p>

      </div>

      <div
        className="panel glow-blue"
        style={{
          marginTop: "20px",

          padding: "24px",

          maxWidth: "760px",
        }}
      >

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "1fr 1fr",

            gap: "14px",
          }}
        >

          <Input
            label="Symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="BTCUSD"
          />

          <Select
            label="Trade Type"
            name="tradeType"
            value={
              formData.tradeType
            }
            onChange={handleChange}
          />

          <Input
            label="Entry Price"
            name="entryPrice"
            value={
              formData.entryPrice
            }
            onChange={handleChange}
            placeholder="65000"
          />

          <Input
            label="Stop Loss"
            name="stopLoss"
            value={
              formData.stopLoss
            }
            onChange={handleChange}
            placeholder="64000"
          />

          <Input
            label="Take Profit"
            name="takeProfit"
            value={
              formData.takeProfit
            }
            onChange={handleChange}
            placeholder="68000"
          />

          <Input
            label="Current PNL"
            name="pnl"
            value={formData.pnl}
            onChange={handleChange}
            placeholder="420"
          />

        </div>

        <div
          className="panel"
          style={{
            marginTop: "20px",

            padding: "18px",

            background:
              "rgba(15,23,42,0.8)",
          }}
        >

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "10px",

              marginBottom: "16px",
            }}
          >

            <TrendingUp
              size={18}
              color="#22C55E"
            />

            <h3
              style={{
                fontSize: "16px",

                fontWeight: "700",
              }}
            >
              Risk Analysis
            </h3>

          </div>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(3,1fr)",

              gap: "14px",
            }}
          >

            <Metric
              title="Risk"
              value={risk}
            />

            <Metric
              title="Reward"
              value={reward}
            />

            <Metric
              title="R:R Ratio"
              value={`1:${rr}`}
              green
            />

          </div>

        </div>

        <button
          onClick={createTrade}

          disabled={loading}

          style={{
            width: "100%",

            height: "52px",

            marginTop: "20px",

            border: "none",

            borderRadius: "16px",

            background:
              "linear-gradient(135deg,#2563EB,#3B82F6)",

            color: "white",

            fontWeight: "700",

            cursor: "pointer",

            fontSize: "14px",

            boxShadow:
              "0 0 25px rgba(37,99,235,0.18)",
          }}
        >
          {
            loading

              ? "Creating Trade..."

              : "Create Trade"
          }
        </button>

      </div>

    </div>
  );
}

function Input({
  label,
  ...props
}) {

  return (

    <div>

      <p
        className="metric-title"
        style={{
          marginBottom: "10px",
        }}
      >
        {label}
      </p>

      <input
        {...props}

        style={{
          width: "100%",

          height: "48px",

          border: "none",

          outline: "none",

          borderRadius: "14px",

          background: "#0F172A",

          padding: "0 14px",

          color: "white",

          fontSize: "13px",
        }}
      />

    </div>
  );
}

function Select(props) {

  return (

    <div>

      <p
        className="metric-title"
        style={{
          marginBottom: "10px",
        }}
      >
        Trade Type
      </p>

      <select
        {...props}

        style={{
          width: "100%",

          height: "48px",

          border: "none",

          outline: "none",

          borderRadius: "14px",

          background: "#0F172A",

          padding: "0 14px",

          color: "white",

          fontSize: "13px",
        }}
      >

        <option value="BUY">
          BUY
        </option>

        <option value="SELL">
          SELL
        </option>

      </select>

    </div>
  );
}

function Metric({
  title,
  value,
  green,
}) {

  return (

    <div>

      <p className="metric-title">
        {title}
      </p>

      <h2
        style={{
          marginTop: "8px",

          fontSize: "24px",

          fontWeight: "700",

          color:
            green
              ? "#22C55E"
              : "white",
        }}
      >
        {value}
      </h2>

    </div>
  );
}