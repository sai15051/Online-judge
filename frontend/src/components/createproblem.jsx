import React, { useState } from "react";
import axios from "axios";
const host = import.meta.env.VITE_BACKEND_URL;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Createproblem = () => {
    const [problemData, setProblemData] = useState({
        problemname: "",
        description: {
            statement: "",
            inputformat: "",
            outputformat: "",
        },
        tags: "",
        difficulty: "Easy",
        testcases: [{ input: "", expectedoutput: "" }],
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("description.")) {
            const key = name.split(".")[1];
            setProblemData((prev) => ({
                ...prev,
                description: { ...prev.description, [key]: value },
            }));
        } else if (name === "tags") {
            setProblemData((prev) => ({ ...prev, tags: value.split(",").map(tag => tag.trim()) }));
        } else if (name.startsWith("testcase")) {
            const index = parseInt(name.split(".")[1]);
            const key = name.split(".")[2];
            const updatedTestcases = [...problemData.testcases];
            updatedTestcases[index][key] = value;
            setProblemData((prev) => ({ ...prev, testcases: updatedTestcases }));
        } else {
            setProblemData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const addTestCase = () => {
        setProblemData((prev) => ({
            ...prev,
            testcases: [...prev.testcases, { input: "", expectedoutput: "" }],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${host}/createproblem`, problemData);
            setSuccess("Problem created successfully!");
            const { success, message } = response.data;
            if (success) toast.success(message, { position: "bottom-right" });
            else toast.error(message, { position: "bottom-left" });
            setError("");
        } catch (err) {
            setSuccess("");
            setError(err.response?.data?.message || "Error creating problem.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create a New Problem</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Problem Name:</label>
                    <input
                        type="text"
                        name="problemname"
                        value={problemData.problemname}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Statement:</label>
                    <textarea
                        name="description.statement"
                        value={problemData.description.statement}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    ></textarea>
                </div>

                <div>
                    <label className="block font-medium">Input Format:</label>
                    <textarea
                        name="description.inputformat"
                        value={problemData.description.inputformat}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    ></textarea>
                </div>

                <div>
                    <label className="block font-medium">Output Format:</label>
                    <textarea
                        name="description.outputformat"
                        value={problemData.description.outputformat}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    ></textarea>
                </div>

                <div>
                    <label className="block font-medium">Tags (comma-separated):</label>
                    <input
                        type="text"
                        name="tags"
                        value={problemData.tags}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium">Difficulty:</label>
                    <select
                        name="difficulty"
                        value={problemData.difficulty}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Test Cases:</label>
                    {problemData.testcases.map((testcase, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="text"
                                name={`testcase.${index}.input`}
                                placeholder="Input"
                                value={testcase.input}
                                onChange={handleChange}
                                className="mr-2 p-2 border rounded"
                            />
                            <input
                                type="text"
                                name={`testcase.${index}.expectedoutput`}
                                placeholder="Expected Output"
                                value={testcase.expectedoutput}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addTestCase}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Add Test Case
                    </button>
                </div>

                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                    Create Problem
                </button>
            </form>

            {success && <p className="text-green-500 mt-4">{success}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default Createproblem;
