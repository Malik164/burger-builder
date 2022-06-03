// let arr=[
//     [1,2],
//     [4],
//     [5],
//     [9]
// ]
// let n=0;
// let sum= arr.reduce((accumulator,currentValue)=>{
//     // console.log('Accumulator',accumulator)
//     // console.log('Current Value ',currentValue);
//     currentValue.map(_=>{
//         // console.log(_);
//         n=n+_
//     })
//     return accumulator.concat(currentValue)
// },[])
// // console.log('Sum: ',sum);
// // console.log('N: ',n);

// let obj={beef: '0', cheese: '2', lettuce: '0', onion: '0', tomato: '0'}

// let ans=Object.keys(obj).map(igKey=>{
//     return [...Array(parseInt(obj[igKey]))].map((_,i)=>{
//         return `Ingredient ${igKey} with quantity ${i+1}`
//     })
// }).reduce((arr,elm)=>{
//     console.log('Array',arr);
//     console.log('elm',elm);
//     return arr.concat(elm)
// },[])

// console.log(ans)

let obj={
    ist:true,
    sec:true,
    third:true
}

let valid=true
for (const key in obj) {
    console.log(valid);
    valid=obj[key] && valid
}
console.log(valid);