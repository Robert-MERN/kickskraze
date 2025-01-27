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
        required: [true, "Please enter the product price"]
    },
    cost_price: {
        type: Number,
        required: [true, "Please enter the product cost price"]
    },
    compare_price: {
        type: Number,
    },
    size: {
        type: Number,
        required: [true, "Please enter the product size"]
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
        required: [true, "Please enter the product stock quantity"],
        default: 1,
    },
    size_desc: {
        type: String,
        required: [true, "Please enter the product size description"]
    },
    shoes_desc: {
        type: String,
        required: [true, "Please enter the product description"]
    },
    featured: {
        type: Boolean,
        default: false,
    },
    media: [mediaSchema],
}, { timestamps: true })


const Db = connection.useDb("Kickskraze")
const Products = Db.models.Products || Db.model('Products', productSchema);
export default Products