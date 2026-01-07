export const stayDurations = [
    {
        numNights: 1,
    },
    {
        numNights: 2,
    },
    {
        numNights: 3,
    },
    {
        numNights: 4,
    },
    {
        numNights: 5,
    },
    {
        numNights: 6,
    },
    {
        numNights: 7,
    },
    {
        numNights: 8,
    },
    {
        numNights: 9,
    },
    {
        numNights: 10,
    },
    {
        numNights: 11,
    },
    {
        numNights: 12,
    },
    {
        numNights: 13,
    },
    {
        numNights: 22,
    },
];

const nights = stayDurations.map(d => d.numNights);
console.log(nights)
// const rules = [
//     { min: 1, max: 1, label: "1 night" },
//     { min: 2, max: 2, label: "2 nights" },
//     { min: 3, max: 3, label: "3 nights" },

//     { min: 4, max: 5, label: "4-5 nights" },
//     { min: 6, max: 7, label: "6-7 nights" },

//     { min: 8, max: 14, label: "8-14 nights" },
//     { min: 15, max: 21, label: "15-21 nights" },

//     { min: 22, max: Infinity, label: "21+ nights" },
// ];

// const nights = stayDurations.map(d => d.numNights);

// const stayDurationsValue = [];

// for (const { min, max, label } of rules) {
//     const found = nights.some(n => n >= min && n <= max);
//     if (found) stayDurationsValue.push(label);
// }

// console.log(stayDurationsValue);
