// import React from 'react'

import Select from "./Select";
import { useSearchParams } from "react-router-dom";

const Sort = ({ options }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get("sort") || "";

    const handleChange = (selected) => {
        console.log("SORT->", selected.target.value);

        searchParams.set("sort", selected.target.value);
        setSearchParams(searchParams);
    };

    return (
        <div>
            Sort
            <Select
                options={options}
                type="white"
                value={sortBy}
                onChange={handleChange}
            />
        </div>
    );
};

export default Sort;
