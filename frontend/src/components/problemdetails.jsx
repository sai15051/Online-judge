import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const host = import.meta.env.VITE_BACKEND_URL;

const Problemdetails = () => {
    const { id } = useParams(); 
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("cpp");
    const [activeTab, setActiveTab] = useState("input");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [verdict, setVerdict] = useState("");

    useEffect(() => {
        const fetchProblemDetails = async () => {
            try {
                const response = await axios.get(`${host}/getproblembyid/${id}`);
                setProblem(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchProblemDetails();
    }, [id]);

    const handleRun = async () => {
        try {
            const response = await axios.post(`${host}/run`, {
                code,
                language,
                input,
            });
            setOutput(response.data.output);
            setVerdict("");
        } catch (err) {
            setOutput("Error during execution");
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${host}/submit`, {
                code,
                id,
                language,
                input,
            });
            setVerdict(response.data.message);
            setOutput("");
        } catch (err) {
            setVerdict("Error during submission");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-gray-50 shadow-md rounded-lg p-6">
                    <h5 className="text-xl font-bold mb-4">{problem.problemname}</h5>
                    <p className="mb-2">
                        <strong>Statement:</strong> {problem.description.statement}
                    </p>
                    <h4 className="text-xl font-bold mb-4">Input Format:</h4>
                    <p className="mb-2">{problem.description.inputformat}</p>
                    <h4 className="text-xl font-bold mb-4">Output Format:</h4>
                    <p className="mb-2">{problem.description.outputformat}</p>
                    <h4 className="text-xl font-bold mb-4">Sample Input:</h4>
                    <p className="mb-2">{problem.testcases[0].input}</p>
                    <h4 className="text-xl font-bold mb-4">Sample Output:</h4>
                    <p className="mb-2">{problem.testcases[0].expectedoutput}</p>
                </div>

                
                <div className="bg-gray-50 shadow-md rounded-lg p-6">
                    <div className="text-center mb-6">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-4 py-2 border rounded-md"
                        >
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                        </select>
                    </div>

                    
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Write your code here..."
                        className="w-full h-80 p-2 border rounded-md mb-4"
                    ></textarea>

                    
                    <div className="flex justify-around mb-4">
                        <button
                            onClick={() => setActiveTab("input")}
                            className={`px-4 py-2 ${activeTab === "input" ? "bg-blue-500 text-white" : "bg-gray-200"
                                } rounded`}
                        >
                            Input
                        </button>
                        <button
                            onClick={() => setActiveTab("output")}
                            className={`px-4 py-2 ${activeTab === "output" ? "bg-blue-500 text-white" : "bg-gray-200"
                                } rounded`}
                        >
                            Output
                        </button>
                        <button
                            onClick={() => setActiveTab("verdict")}
                            className={`px-4 py-2 ${activeTab === "verdict" ? "bg-blue-500 text-white" : "bg-gray-200"
                                } rounded`}
                        >
                            Verdict
                        </button>
                    </div>

                    
                    <div>
                        {activeTab === "input" && (
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter inputs here..."
                                className="w-full h-20 p-2 border rounded-md"
                            ></textarea>
                        )}
                        {activeTab === "output" && (
                            <div className="p-2 border rounded-md">{output || "No output yet."}</div>
                        )}
                        {activeTab === "verdict" && (
                            <div className="p-2 border rounded-md ">{<p className="text-green-500 mt-4">{verdict}</p> || "No verdict yet."}</div>
                            
                        )}
                    </div>

                    
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handleRun}
                            className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Run
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problemdetails;
