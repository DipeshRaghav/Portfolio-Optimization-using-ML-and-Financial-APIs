function PortfolioOptimization({ data }) {

  return (

    <div style={styles.container}>

      {/* Left side chart */}
      <div style={styles.chartBox}>

        <h3>Optimal Allocation</h3>

        <div style={styles.fakeChart}>
          Pie chart will appear here
        </div>

      </div>

      {/* Right side allocation list */}
      <div style={styles.detailsBox}>

        <h3>Allocation Details</h3>

        {data && Object.entries(data.weights).map(([stock, weight]) => (

          <div key={stock} style={styles.stockRow}>

            <div style={styles.stockHeader}>

              <span>{stock}</span>

              <span>{(weight * 100).toFixed(0)}%</span>

            </div>

            <div style={styles.progressBar}>

              <div
                style={{
                  ...styles.progressFill,
                  width: `${weight * 100}%`
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

const styles = {

  container: {

    display: "flex",
    gap: "30px",
    flexWrap: "wrap"

  },

  chartBox: {

    flex: 1,
    minWidth: "300px"

  },

  detailsBox: {

    flex: 1,
    minWidth: "300px"

  },

  fakeChart: {

    height: "220px",
    background: "#020617",
    border: "1px dashed #334155",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b"

  },

  stockRow: {

    marginBottom: "15px"

  },

  stockHeader: {

    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px"

  },

  progressBar: {

    height: "8px",
    background: "#1e293b",
    borderRadius: "6px"

  },

  progressFill: {

    height: "100%",
    background: "#3b82f6",
    borderRadius: "6px"

  }

};

export default PortfolioOptimization;