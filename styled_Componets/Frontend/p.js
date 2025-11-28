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
import { File } from 'node:buffer'
export const formDataHandel = (data) => {
    const formData = new FormData();

    if (!data) return formData;


    // Append all fields
    for (const key in data) {

        // Only append image if file is selected
        if (data[key] instanceof File) {
            if (data[key] && data[key].length > 0) {
                formData.append("image", data[key][0]); // File object
            }
        }
      
        else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]); // Normal fields
        }
    }

    return formData;
};

const data = {
    email: "thechamp@gmail.com",
    fullName: "jkjkjk",
    password: "12345678",
    passwordConfirm: "12345678",
};

const formdata = formDataHandel(data)
console.log(formdata)