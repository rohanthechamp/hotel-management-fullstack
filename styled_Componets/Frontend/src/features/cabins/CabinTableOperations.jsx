// import React from 'react'

import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import Sort from "../../ui/Sort";
const CabinTableOperations = () => {
  return (
    <TableOperations>
      <Filter
        filterField={"discount"}
        options={[
          {
            value: "all",
            label: "All",
          },
          {
            value: "no-discount",
            label: "No-Discount",
          },
          {
            value: "with-discount",
            label: "With-Discount",
          },
        ]}
      />

      <Sort
        options={[
          { value: "name-asc", label: "Sort by Name (A-Z)" },
          { value: "name-desc", label: "Sort by Name (Z-A)" },
          { value: "regularPrice-low", label: "Sort by price (low first)" },
          { value: "regularPrice-high", label: "Sort by price (high first)" },
          {
            value: "maxCapacityCabins-max",
            label: "Sort by Capacity (Max)",
          },
          {
            value: "minCapacityCabins-min",
            label: "Sort by Capacity (Min)",
          },
        ]}
      />
    </TableOperations>
  );
};

export default CabinTableOperations;
