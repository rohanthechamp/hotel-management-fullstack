/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// /* eslint-disable no-unused-vars */
// const obj = {};
// const columnName = ["status", "isPaid"];
// for (let index; index < columnName; index++) {

// import { formDataHandel } from "./src/utils/he///lpers";

//     console.log(columnName[index])
// }

// const fruits = ["apple", "banana"];
// let value = fruits.includes("appl");
// if (!value) console.log("it has no word breakfast ");
// else console.log("it has word breakfast");
// import { File } from 'node:buffer'
// export const formDataHandel = (data) => {
//     const formData = new FormData();

//     if (!data) return formData;

//     // Append all fields
//     for (const key in data) {

//         // Only append image if file is selected
//         if (data[key] instanceof File) {
//             if (data[key] && data[key].length > 0) {
//                 formData.append("image", data[key][0]); // File object
//             }
//         }

//         else if (data[key] !== null && data[key] !== undefined) {
//             formData.append(key, data[key]); // Normal fields
//         }
//     }

//     return formData;
// };

// const data = {
//     email: "thechamp@gmail.com",
//     fullName: "jkjkjk",
//     password: "12345678",
//     passwordConfirm: "12345678",
// };

// const formdata = formDataHandel(data)
// console.log(formdata)

// const data = stays
//     .reduce((arr, cur) => {
//         const num = cur.numNights;
//         if (num === 1) return incArrayValue(arr, "1 night");
//         if (num === 2) return incArrayValue(arr, "2 nights");
//         if (num === 3) return incArrayValue(arr, "3 nights");
//         if ([4, 5].includes(num)) return incArrayValue(arr, "4-5 nights");
//         if ([6, 7].includes(num)) return incArrayValue(arr, "6-7 nights");
//         if (num >= 8 && num <= 14) return incArrayValue(arr, "8-14 nights");
//         if (num >= 15 && num <= 21) return incArrayValue(arr, "15-21 nights");
//         if (num >= 21) return incArrayValue(arr, "21+ nights");
//         return arr;
//     }, startData)
//     .filter((obj) => obj.value > 0);

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

// if (stayDurations.numNights.get()===5)
//     console.log('YES')
// else
//     console.log('NO')
// console.log(stayDurations.numNights)

// console.log(stayDurations.some(x => x.numNights == 1))
// const doIt = (num) => {
//     return stayDurations.some(x => x.numNights == 4)
// }

// console.log(doIt(1))

// const searchIt = (value,index,array) => {

//     const isValue = Boolean(value >= 8 && value <= 14)
//     return "8-14 nights"

// }

// const val = stayDurations.find(
//     (el) =>
//         el.numNights >= data.firstSetGS[0] && el.numNights <= data.firstSetGS[1]
// );
// console.log(val !== undefined ? stayDurationsValue.push(`${data.firstSetGS[0]}-${data.firstSetGS[1]} nights`) : "");

// // console.log(data.firstSetGS[0])
// console.log(stayDurationsValue)

// Object.values(data).forEach(value => {
//     console.log(value[0]);
// });
// for (const key of Object.keys(data)) {
//     const value = data[key];
//     const val = stayDurations.find(
//         (el) =>
//             el.numNights >= value[0] && el.numNights <= value[1]
//     );
//     if (val !== undefined)
//         stayDurationsValue.push(`${data[0]}-${data[1]} nights`)
// }
// console.log(stayDurationsValue)const stayDurationsValue = [];

// for (const val of data0) {
//     const found = stayDurations.some((el) => el.numNights == val);

//     if (found) {
//         stayDurationsValue.push(`${val} nights`);
//     }
// }
// for (const [key, range] of Object.entries(data1)) {
//     const [min, max] = range;
//     console.log(min, max);
//     const found = stayDurations.some((el) => el.numNights == min);
//     const found1 = stayDurations.some((el) => el.numNights == max);

//     if (found && found1) {
//         stayDurationsValue.push(`${min}-${max} nights`);
//     }
// }

// for (const [key, range] of Object.entries(data)) {
//     const [min, max] = range;

//     const found = stayDurations.some(
//         (el) => el.numNights >= min && el.numNights <= max
//     );

//     if (found) {
//         stayDurationsValue.push(`${min}-${max} nights`);
//     }
// }

// if (stayDurations.some((el) => el.numNights > 21)) {
//     stayDurationsValue.push("21+ nights");
// }



// console.log(stayDurationsValue);

const numbers = [3, 4, 1, 8, 4, 9, 5, 3, 9, 5, 4]
const check = {

};
const unique = []
// console.log('before loop', numbers)


// for (const element of numbers) {
//     let arrayElement = element
//     check.numbers = arrayElement
//     if (check.numbers !== arrayElement){



//     // if (!check.numbers.includes(arrayElement)) {
//     //     console.log('yes')
//         unique.push(arrayElement)
//     }
// }
// console.log(check);
// console.log(unique)


// for (let num of numbers) {
//     if (!check[num]) {
//         check[num] = true;
//         numbers.pop(num);
//     }
// }

// arr.forEach((ele, ind) => {
//     check.arrVal = [ele]
//     if (ele == check.arrVal) {
//         arr.pop(ele)
//     }
// });


// for (const element of numbers) {
//     let val = element

//     if (!unique.includes(val)) {
//         unique.push(val)
//     }

// }

// console.log('after loop', numbers)
// // console.log('objects',check)
// for (let num of numbers) {
//     if (check[num]) {
//         check[num] += 1;      // already exists → increase count
//     } else {
//         check[num] = 1;       // first time → set to 1
//     }
// }

// console.log(check);
// console.log(check[0])
// console.log(unique)

// console.log(check);
// console.log(unique)

const startDataDark = [
    {
        duration: "1 night",
        value: 0,
        color: "#b91c1c",
    },
    {
        duration: "2 nights",
        value: 0,
        color: "#c2410c",
    },
]
const backendData = { label: "1 night", count: 130 };
for (const [index,value] of startDataDark.entries()) {
    console.log(value.color)
}
for (const {color} of startDataDark) {
    console.log(color)
}
const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

console.log(startDataDark[Math.floor(Math.random() * startDataDark.length)].color)
console.log(startDataDark[backendData.label]);

console.log(startDataDark[backendData['label']]);
console.log(startDataDark.find((item)=>item.duration===backendData.label).color);
const color = startDataDark.find((item) => item.duration === backendData.label).color
console.log(color);
