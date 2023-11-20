// Import required libraries and modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import todoData from "./Model/todoModel.js"; // Import the model

const app = express();
app.use(express.json());
app.use(cors());

// Define the port for the server to listen on
const port = process.env.PORT || 2001;

// Connect to the MongoDB database
mongoose
    .connect(
        'mongodb+srv://Admin:1234@cluster0.gcivl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    )
    .then(console.log('DB connected'))
    .catch(console.error);


// Get all todos
app.get('/api/todos', async (req, res) => {
    // Find all todos in the database and sort them by createdAt in descending order
    try {
        const todos = await todoData.find().sort({ "index": 1 });
        res.json(todos); // Send the todos as a JSON response
    } catch (error) {
        res.status(400).send(error);
    }

})

// Create a new todo
app.post('/api/todos/new', async (req, res) => {
    const todo = new todoData(req.body)
    await todo.save()
    res.send('todo saved'); 
})

// Delete a todo by its ID
app.delete('/api/todos/delete/:id', async (req, res) => {
    await todoData.findByIdAndDelete(req.params.id);
    res.send('deleted');
})

// Update a todo by its ID
app.put('/api/todos/update/:id', async (req, res) => {
    const data = await todoData.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated"); 
})

app.put('/api/todos/sort', async (req, res) => {

    const index1 = req.query.index1;
    const index2 = req.query.index2; 

    if(index1===index2)
        return res.send(" same index")

    try {
        // Find and update todos with the specified indices
        const [todo1, todo2] = await Promise.all([
            todoData.findOne({ index: index1 }),
            todoData.findOne({ index: index2 })
        ]);

        if (!todo1 || !todo2) {
            res.status(404).send("One or both documents not found");
            return;
        }

        // Swap 
        const tempIndex = todo1.index;
        todo1.index = todo2.index;
        todo2.index = tempIndex;

        // Save updated todos
        await Promise.all([todo1.save(), todo2.save()]);
       

        res.send("updated"); // Send a response indicating the update
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log('server started on port:' + port); // Log a message when the server starts
})
