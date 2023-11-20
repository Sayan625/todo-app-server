import mongoose  from "mongoose";

//todo model
const todoSchema=mongoose.Schema({
    "text": {
        type: String,
        reqired: true
    },
    "index": {
        type: Number,
        default:0,
        reqired: true
    },
    "complete":{
        type: Boolean,
        default: false
    }

},{timestamps: true });

const todoData= mongoose.model("task-databases",todoSchema);
export default todoData;
