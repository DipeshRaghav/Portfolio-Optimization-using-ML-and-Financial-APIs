import { useState } from "react";
import StockInput from "../stock/StockInput";
import PortfolioOptimization from "../portfolio/PortfolioOptimization";

function Dashboard() {

  const [portfolioData, setPortfolioData] = useState(null);

  return (

    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          AI Portfolio Optimization
        </h1>

        <p style={styles.subtitle}>
          Build smart portfolios using Machine Learning, Risk Analysis & Financial Data
        </p>
      </div>

      {/* Stock Selection */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          Stock Selection
        </h2>

        <StockInput setPortfolioData={setPortfolioData} />
      </div>

      {/* Placeholder sections (layout ready) */}

      <div style={styles.card}>

  <h2 style={styles.sectionTitle}>
    Portfolio Optimization
  </h2>

  <PortfolioOptimization data={portfolioData} />

        <p style={styles.placeholder}>
          Allocation chart will appear here
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          Risk Analysis
        </h2>

        <p style={styles.placeholder}>
          Risk metrics will appear here
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          Efficient Frontier
        </h2>

        <p style={styles.placeholder}>
          Risk vs Return graph will appear here
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          Investment Simulation
        </h2>

        <p style={styles.placeholder}>
          Growth projection graph will appear here
        </p>
      </div>

    </div>

  );

}

const styles = {

  page: {

    minHeight: "100vh",
    background: "#020617",
    padding: "40px",
    fontFamily: "system-ui",
    color: "white"

  },

  header: {

    marginBottom: "40px"

  },

  title: {

    fontSize: "34px",
    fontWeight: "700",
    marginBottom: "10px"

  },

  subtitle: {

    color: "#94a3b8",
    fontSize: "16px",
    maxWidth: "600px"

  },

  card: {

    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"

  },

  sectionTitle: {

    fontSize: "20px",
    marginBottom: "15px"

  },

  placeholder: {

    color: "#64748b"

  }

};

export default Dashboard;