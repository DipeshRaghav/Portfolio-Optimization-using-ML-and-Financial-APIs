import { useState } from "react";

function StockInput({ setPortfolioData }) {

  const [stocks, setStocks] = useState("");

  const handleAnalyze = () => {

    const dummyData = {
      stocks: stocks,
      weights: {
        AAPL: 0.3,
        MSFT: 0.3,
        TSLA: 0.4
      }
    };

    setPortfolioData(dummyData);
  };

  return (

    <div
      style={{
        background: "#111827",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "20px",
        maxWidth: "600px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
      }}
    >

      <h3 style={{ marginBottom: "15px" }}>
        Select Stocks
      </h3>

      <p style={{ color: "#9ca3af", fontSize: "14px" }}>
        Enter stock tickers separated by comma
      </p>

      <div style={{ display: "flex", marginTop: "15px" }}>

        <input
          type="text"
          placeholder="Example: AAPL, TSLA, MSFT"
          value={stocks}
          onChange={(e) => setStocks(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #374151",
            background: "#020617",
            color: "white",
            outline: "none"
          }}
        />

        <button
          onClick={handleAnalyze}
          style={{
            marginLeft: "10px",
            padding: "12px 18px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Analyze
        </button>

      </div>

    </div>

  );
}

export default StockInput;