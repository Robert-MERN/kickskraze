import { Schema, connection } from "mongoose"


const mediaSchema = new Schema({
    type: {
        type: String,
        required: [true, "Please specify the media type"],
    },
    url: {
        type: String,
        required: [true, "Please specify the media URL"],
    },
    thumbnail: {
        type: Boolean,
        default: false,
    },
}, { _id: true });



const productSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please enter the product name"]
    },
    price: {
        type: Number,
        required: [true, "Please enter the product price"],
        set: (v) => { if (isNaN(v)) { return undefined; } return v; },// Ignore invalid values
    },
    cost_price: {
        type: Number,
        required: [true, "Please enter the product cost price"],
        set: (v) => { if (isNaN(v)) { return undefined; } return v; },// Ignore invalid values
    },
    compare_price: {
        type: Number,
        set: (v) => { if (isNaN(v)) { return undefined; } return v; },// Ignore invalid values
    },
    size: {
        type: Number,
        required: [true, "Please enter the product size"],
        set: (v) => { if (isNaN(v)) { return undefined; } return v; },// Ignore invalid values
    },
    brand: {
        type: String,
        required: [true, "Please enter the product brand"]
    },
    condition: {
        type: String,
        required: [true, "Please enter the product condtion"]
    },
    category: {
        type: String,
        required: [true, "Please enter the product category"]
    },
    stock: {
        type: Number,
        default: 1,
        set: (v) => { if (isNaN(v)) { return undefined; } return v; },// Ignore invalid values
    },
    size_desc: {
        type: String,
        // required: [true, "Please enter the product size description"]
    },
    shoes_desc: {
        type: String,
        // required: [true, "Please enter the product description"]
    },
    featured: {
        type: Boolean,
        default: false,
    },
    store_name: {
        type: String,
        required: [true, "Please enter the product store name"]

    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    media: [mediaSchema],
}, { timestamps: true })


// Use a global variable to prevent multiple instances of the DB
const Db = connection.useDb("Kickskraze");

const Products = Db.models.Products || Db.model("Products", productSchema);

export default Products;