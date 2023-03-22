import mongoose from 'mongoose';
import orderModel from './models/order.model.js';

const main = async () =>{
    await mongoose.connect('mongodb://127.0.0.1:27017', {
        dbName: "pizzaCoder"
    })
    console.log("Connected to DB");

    // const result = await orderModel.insertMany([

    //     {name: "Pepperoni", size:"small", price: 19, qty: 10},
        // {name: "Pepperoni", size:"medium", price: 21, qty: 22},
    //     {name: "Pepperoni", size:"large", price: 23, qty: 30},
    //     {name: "Cheese", size:"small", price: 15, qty: 15},
    //     {name: "Cheese", size:"medium", price: 17, qty: 25},
    //     {name: "Cheese", size:"large", price: 19, qty: 35},
    //     {name: "Hawaian", size:"small", price: 18, qty: 10},
    //     {name: "Hawaian", size:"medium", price: 20, qty: 20},
    // ]);
    // console.log(result);

    const orders = await orderModel.aggregate([
        {$match: {size: "medium"}},
        {$group: {
            _id: "$name", 
            totalQty: {$sum: "$qty"}
                }
        },
        {$sort: {totalQty: -1}},
        {$group:{
            _id: 1,
            orders: {$push: "$$ROOT"}
            }
        },
        {$project: {
            "_id": 0,
            orders: '$orders'
            }
        },
        {$merge:{into:'reports'}}
    ])
    console.log(orders);
    process.exit();
}

main();