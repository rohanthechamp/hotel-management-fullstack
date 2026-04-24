/* CabinTable.jsx */
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";

import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Menus from "../../ui/Menus";

import { ErrorIcon } from "react-hot-toast";


const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 2fr 1fr 1fr 1fr 8rem 1.4fr;
  column-gap: 2.7rem;
  align-items: center;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

const CabinTable = () => {
  const { isLoading, cabins, error } = useCabins();
  // const [searchParams] = useSearchParams();
  // const filterValue = searchParams.get("discount");
  // const sortValue = searchParams.get("sort");
  // console.log(filterValue || sortValue);
  // const [loadingFilter, setLoadingFilter] = useState(false);
  // const [filteredCabins, setFilteredCabins] = useState([]);

  // client Site Approach

  // const cabins = useMemo(() => {
  //   if (!Cabins) return [];
  //   if (filterValue === "with-discount")
  //     return Cabins.filter((cab) => cab.discount > 0);
  //   if (filterValue === "no-discount")
  //     return Cabins.filter((cab) => cab.discount <= 0);

  //   if (sortValue === "name-asc") {
  //     return [...Cabins].sort((a, b) => a.name - b.name);
  //   }

  //   if (sortValue === "name-desc") {
  //     return [...Cabins].sort((a, b) => b.name - a.name);
  //   }

  //   if (sortValue === "regularPrice-low") {
  //     return [...Cabins].sort((a, b) => a.regularPrice - b.regularPrice);
  //   }

  //   if (sortValue === "regularPrice-max") {
  //     return [...Cabins].sort((a, b) => b.regularPrice - a.regularPrice);
  //   }

  //   if (sortValue === "maxCapacityCabins") {
  //     return [...Cabins].sort((a, b) => b.maxCapacity - a.maxCapacity);
  //   }

  //   if (sortValue === "minCapacityCabins") {
  //     return [...Cabins].sort((a, b) => a.maxCapacity - b.maxCapacity);
  //   }

  //   return Cabins;
  // }, [Cabins, filterValue, sortValue]);

  //

  // // * Server Backend Db Approach
  // const [filteredCabins, setFilteredCabins] = useState([]);
  // const [loadingFilter, setLoadingFilter] = useState(false);

  // // Function for fetching filtered cabins
  // async function fetchFilterCabins(filterValue) {
  //   let query = supabase.from("cabins").select("*");
  //   // let query = supabase.from('cabins')

  //   if (filterValue === "with-discount") {
  //     query = query.gt("discount", 0);
  //   } else if (filterValue === "no-discount") {
  //     query = query.or("discount.eq.0,discount.is.null");
  //   }

  //   const { data: cabins, error } = await query;

  //   if (error) {
  //     console.error(error);
  //     throw new Error("Filter Cabins Data could not be loaded");
  //   }

  //   return cabins || [];
  // }

  // // Effect to re-fetch whenever filterValue changes
  // useEffect(() => {
  //   if (filterValue && filterValue !== "all") {
  //     setLoadingFilter(true);
  //     fetchFilterCabins(filterValue)
  //       .then((data) => setFilteredCabins(data))
  //       .catch((err) => console.error(err))
  //       .finally(() => setLoadingFilter(false));
  //   }
  // }, [filterValue]);

  if (isLoading ) return <Spinner />;

  if (error) return <ErrorIcon />;
  if (error) return <p>Error: {error.message}</p>;
  // { auth?.user ? <p>Hi {auth.user}</p> : null }

  // Decide which cabins to show
  // const cabins = filterValue === "all" || !filterValue ? Cabins || [] : filteredCabins;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 1fr 1fr 1fr 8rem 1.4fr">
        <Table.Header role="row">
      
          <div role="columnheader">Id</div>
          <div role="columnheader">Name</div>
          <div role="columnheader">Capacity</div>
          <div role="columnheader">Price</div>
          <div role="columnheader">Discount</div>
          <div role="columnheader">Photo</div>
          <div role="columnheader">Operation</div>
        </Table.Header>

        <Table.Body
          data={cabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  );
};

export default CabinTable;
