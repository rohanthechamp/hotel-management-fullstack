const cabinData1 = [
    {
        id: 1,
        name: "Mountain View Lodge",
        capacity: 4,
        regularPrice: 250,
        discount: 50,
        hasWiFi: true,
    },
    {
        id: 2,
        name: "Lakefront Retreat",
        capacity: 6,
        regularPrice: 320,
        discount: 0,
        hasWiFi: false,
    },
    {
        id: 3,
        name: "Forest Hideaway",
        capacity: 2,
        regularPrice: 180,
        discount: 20,
        hasWiFi: true,
    },
    {
        id: 4,
        name: "Desert Oasis Cabin",
        capacity: 5,
        regularPrice: 300,
        discount: 30,
        hasWiFi: false,
    },
    {
        id: 5,
        name: "Snowy Peak Chalet",
        capacity: 8,
        regularPrice: 500,
        discount: 100,
        hasWiFi: true,
    },
];

const cabinData = [
    { id: 1, name: "Ocean Breeze", maxCapacity: 2, regularPrice: 180, discount: 20 },
    { id: 2, name: "Mountain View", maxCapacity: 4, regularPrice: 300, discount: 0 },
    { id: 3, name: "Forest Retreat", maxCapacity: 3, regularPrice: 250, discount: 50 },
    { id: 4, name: "Lake House", maxCapacity: 6, regularPrice: 400, discount: 30 },
    { id: 5, name: "Desert Oasis", maxCapacity: 5, regularPrice: 350, discount: 0 },
    { id: 6, name: "Skyline Suite", maxCapacity: 8, regularPrice: 500, discount: 100 },
    { id: 7, name: "Cozy Cottage", maxCapacity: 2, regularPrice: 200, discount: 0 },
    { id: 8, name: "Island Paradise", maxCapacity: 10, regularPrice: 600, discount: 50 },
];



// ✅ Beginner Level

// Print all cabin names.

// Print all cabin prices(regularPrice).

// Show only cabins with a discount greater than 0.

// Show cabins where capacity ≥ 4.

// Create an array of just cabin IDs.



// cabinData.map((dt) => { console.log(dt.name, dt.regularPrice) });
// console.log(cabinData.filter((cb) => cb.discount > 0))
// console.log(cabinData.filter((cb) => cb.capacity >= 4))

// console.log([...cabinData])
// const idArr = [];

// cabinData.map((dt) => idArr.push(dt.id))
// console.log(idArr)


//*  🔹 Intermediate Level

// * Sort cabins by regularPrice(low → high).

//*  Sort cabins by capacity(high → low).

//*  Find the cheapest cabin(minimum regularPrice).

// * Find the most expensive cabin(maximum regularPrice).

//*  Count how many cabins have discounts.

// console.log([...cabinData].sort((a, b) => a.regularPrice - b.regularPrice))
// console.log([...cabinData].sort((a, b) => b.capacity - a.capacity))
// const cheapestCabinPrice = Math.min(...cabinData.map((dt) => dt.regularPrice));
// const cheapestCabin = cabinData.find((dt) => dt.regularPrice == cheapestCabinPrice)
// console.log(cheapestCabin, cheapestCabin.name);

// const expensiveCabin = cabinData.find((dt) => dt.regularPrice == Math.max(...cabinData.map((dt) => dt.regularPrice)))
// console.log(expensiveCabin)
// const num = cabinData.filter(dt => dt.discount > 0).length;
// console.log(num);

//*  🔹 Advanced Level(your turn to attempt)

//*  Return a list of cabin names with their final price after discount.
// (final price = regularPrice - discount)

//*  Find the average price of all cabins.

// * Create a new array of only the cabins that cost less than 300 after discount.

// * Group cabins into two arrays:

// * withDiscount

// * noDiscount

// * Find the cabin with the largest capacity and print its name

const finalPrices = cabinData.map(dt => ({
    name: dt.name,
    finalPrice: dt.regularPrice - dt.discount,
}));
console.log(finalPrices);

// const avgPrice = cabinData.reduce((acc, x) => acc + x.regularPrice, 0) / cabinData.length;
// console.log(avgPrice);
// Array.reduce()


// console.log([...cabinData].filter((dt) => (dt.regularPrice - dt.discount) < 300));
// console.log(cabinData.find((dt) => dt.capacity == Math.max(...cabinData.map((dt) => dt.capacity))).name)
// const withDiscount = cabinData.filter((dt) => dt.discount > 0);
// const noDiscount = cabinData.filter((dt) => dt.discount === 0);
// console.log(withDiscount)
// console.log("**")
// console.log(noDiscount)