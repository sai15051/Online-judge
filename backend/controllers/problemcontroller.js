import problem from "../models/problem.js";

export const createproblem = async (req, res, next) => {
    const { problemname, description, testcases, tags, difficulty } = req.body;
    const isexist = await problem.findOne({ problemname });
    if (isexist) {
        return res.json({ message: "problem already exist", success: false });
    }
    try {
        const Problem = await problem.create({
            problemname,
            description,
            testcases,
            tags,
            difficulty,
        });
        await Problem.save();
        return res.status(201).json({
            message: "problem created successfully",
            success: true,
            Problem
        });
    } catch (error) {
        res.status(500).send({ success: false, message: "Server error" });
    }
};
export const getallproblems = async (req, res) => {
    const { problemname } = req.query;
    try {
        let query = {};
        if (problemname) {
            query.problemname = { $regex: problemname, $options: "i" }; 
        }
        const problems = await problem.find(query);
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getproblembyid = async (req, res) => {
    const { id } = req.params;
    try {
        const Problem = await problem.findById(id);
        if (!Problem) {
            return res.json({ message: "problem not found" });
        }
        res.json(Problem);
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
};

export const deleteproblem = async (req, res) => {
    const { id } = req.params;
    try {
        const Problem = await problem.findByIdAndDelete(id);
        if (!Problem) {
            return res.json({ message: "problem not found", success: false });
        }
        res.json({ message: "problem deleted successfully", success: true });
    } catch (error) {
        console.log(error);
        res.json({ message: error.message, success: false });
    }
};