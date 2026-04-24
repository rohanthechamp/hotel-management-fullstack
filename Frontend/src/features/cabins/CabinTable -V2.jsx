// /* CabinTable.jsx */
// import { useQuery } from "@tanstack/react-query";
// import styled from "styled-components";
// import { getCabins } from "../../services/apiCabins";
// import Spinner from "../../ui/Spinner";
// import CabinRow from "./CabinRow";

// const Table = styled.div`
//   border: 1px solid var(--color-grey-200);
//   font-size: 1.9rem;
//   background-color: var(--color-grey-0);
//   border-radius: 7px;
//   overflow: hidden;
// `;

// const TableHeader = styled.header`
//   display: grid;
//   /* 7 columns total: id, name, capacity, price, discount, photo, ops */
//   grid-template-columns: 0.6fr 2fr 1fr 1fr 1fr 8rem 1.4fr;
//   column-gap: 2.7rem;
//   align-items: center;
//   background-color: var(--color-grey-50);
//   border-bottom: 1px solid var(--color-grey-100);
//   text-transform: uppercase;
//   letter-spacing: 0.4px;
//   font-weight: 600;
//   color: var(--color-grey-600);
//   padding: 1.6rem 2.4rem;
// `;

// const CabinTable = () => {


//   if (isLoading) return <Spinner />;
//   if (error) return <p>Error: {error.message}</p>;

//   const cabins = data || [];

//   return (
//     <Table role="table">
//       <TableHeader role="row">
//         <div role="columnheader">Id</div>
//         <div role="columnheader">Name</div>
//         <div role="columnheader">Capacity</div>
//         <div role="columnheader">Price</div>
//         <div role="columnheader">Discount</div>
//         <div role="columnheader">Photo</div>
//         <div role="columnheader">Operation</div>
//       </TableHeader>

//       {cabins.map((cabin) => (
//         <CabinRow key={cabin.id} cabin={cabin} />
//       ))}
//     </Table>
//   );
// };

// export default CabinTable;
