import React from "react";

const PortfolioSummary = ({ data }) => {

  return (

    <div>

      <h2>Portfolio Summary</h2>

      <p>Expected Return: {data.expected_return}</p>

      <p>Volatility: {data.volatility}</p>

    </div>

  );

};

export default PortfolioSummary;