import React from "react";

const AllocationChart = ({ data }) => {

  return (

    <div>

      <h2>Allocation</h2>

      {Object.entries(data.weights).map(([stock, weight]) => (

        <p key={stock}>
          {stock}: {(weight * 100).toFixed(1)}%
        </p>

      ))}

    </div>

  );

};

export default AllocationChart;