import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const host = import.meta.env.VITE_BACKEND_URL;

const EditProblem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [formData, setFormData] = useState({
        statement: '',
        inputformat: '',
        outputformat: '',
    });

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`${host}/getproblembyid/${id}`);
                setProblem(response.data);
                setFormData({
                    statement: response.data.description.statement,
                    inputformat: response.data.description.inputformat,
                    outputformat: response.data.description.outputformat,
                });
            } catch (error) {
                console.error('Error fetching problem:', error);
            }
        };
        fetchProblem();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            
            const response = await axios.put(`${host}/update/${id}`, formData);
            if (response.data.success) {
                alert('Problem updated successfully!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error updating problem:', error);
        }
    };

    if (!problem) return <div className="text-center text-gray-500 mt-20">Loading...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
            <form
                onSubmit={handleUpdate}
                className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6"
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Edit Problem
                </h2>

                <div className="mb-4">
                    <label
                        htmlFor="statement"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Problem Statement
                    </label>
                    <textarea
                        id="statement"
                        name="statement"
                        value={formData.statement}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows="5"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="inputFormat"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Input Format
                    </label>
                    <textarea
                        id="inputFormat"
                        name="inputformat"
                        value={formData.inputformat}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows="4"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="outputFormat"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Output Format
                    </label>
                    <textarea
                        id="outputFormat"
                        name="outputformat"
                        value={formData.outputformat}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows="4"
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-300 transition duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProblem;
