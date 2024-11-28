import mongoose from "mongoose";


const testCaseSchema = new mongoose.Schema(
    {
        input: { type: String },
        expectedoutput: { type: String },
    },
    { _id: false }
);

const problemSchema = new mongoose.Schema({
    problemname: { type: String, required: true, unique: true },
    description: {
        statement: { type: String, required: true },
        inputformat: { type: String, required: true },
        outputformat: { type: String, required: true },
    },
    tags: [String],
    testcases: [testCaseSchema],
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true,
    },
});

const problem = mongoose.model("problem", problemSchema);

export default problem;
