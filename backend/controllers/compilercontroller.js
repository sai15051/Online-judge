import problem from "../models/problem.js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import axios from "axios";

const ensureCodesDirectory = () => {
    const codesDir = "./codes";
    if (!fs.existsSync(codesDir)) {
        fs.mkdirSync(codesDir, { recursive: true });
        console.log("Created 'codes' directory.");
    }
};


const generateFilePaths = (language) => {
    const baseDir = "./codes";
    const timestamp = Date.now();
    const extensionMap = { cpp: "cpp", java: "java", python: "py" };
    const extension = extensionMap[language];
    const fileName = language === "java" ? "Main.java" : `${timestamp}.${extension}`;
    const codePath = path.join(baseDir, fileName);
    const inputPath = path.join(baseDir, `${timestamp}.in`);
    const outputPath = path.join(baseDir, `${timestamp}.out`);
    return { codePath, inputPath, outputPath };
};


const executeCode = (language, codePath, inputPath, outputPath, hasInput, callback) => {
    const commands = {
        cpp: {
            compile: `g++ ${codePath} -o ${codePath}.out`,
            run: `${codePath}.out ${hasInput ? `< ${inputPath}` : ""} > ${outputPath}`,
        },
        java: {
            compile: `javac ${codePath}`,
            run: `java -cp ${path.dirname(codePath)} Main ${hasInput ? `< ${inputPath}` : ""} > ${outputPath}`,
        },
        python: {
            compile: null, 
            run: `python ${codePath} ${hasInput ? `< ${inputPath}` : ""} > ${outputPath}`,
        },
    };

    const { compile, run } = commands[language];
    const command = compile ? `${compile} && ${run}` : run;

    exec(command, callback);
};


export const runcode = async (req, res) => {
    const { language = "cpp", code, input } = req.body;
    console.log(input)
    if (!code) return res.status(400).json({ error: "Code is required" });

    ensureCodesDirectory(); 
    const { codePath, inputPath, outputPath } = generateFilePaths(language);
    const hasInput = Boolean(input);

    try {
        
        fs.writeFileSync(codePath, code);
        fs.writeFileSync(inputPath, input || "");
    } catch (error) {
        console.error("Error writing files:", error.message);
        return res.status(500).json({ error: "File write error" });
    }

    
    executeCode(language, codePath, inputPath, outputPath, hasInput, (error, stdout, stderr) => {
        if (error) {
            console.error("Execution error:", stderr || error.message);
            return res.status(500).json({ error: stderr || "Execution error" });
        }

        try {
            const output = fs.readFileSync(outputPath, "utf-8");
            res.json({ output });
        } catch (err) {
            console.error("Error reading output file:", err.message);
            res.status(500).json({ error: "Output read error" });
        }
    });
};


export const judge = async (req, res) => {
    const { language = "cpp", code, id, userid } = req.body;
    const Problem = await problem.findById(id);
    const testcase = Problem.testcases;
    
    try {
        let test = [];
        for (var i = 0; i < testcase.length; i++) {
            const input = testcase[i].input;
            const result = await axios.post(`${process.env.backend_url}/run`, {
                code,
                language,
                input,
            });
            const isCorrect = compareOutputs(
                result.data.output,
                testcase[i].expectedoutput
            );
            if (!isCorrect) {
                test.push({ testcase: i + 1, success: false });
                console.log("testcase failed");
                return res.send({
                    success: false,
                    message: `Testcase ${i + 1} failed`,
                    test: test,
                });
            } else {
                test.push({ testcase: i + 1, success: true });
            }
        }
        console.log("passed");
        
        return res.json({
            success: true,
            message: "testcases passed",
            test: test,
        });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

const normalizeOutput = (output) => {
    return output
        .replace(/\r\n/g, "\n") 
        .replace(/\r/g, "\n") 
        .replace(/\s+\n/g, "\n") 
        .replace(/\n\s+/g, "\n") 
        .trim(); 
};

const compareOutputs = (generatedOutput, expectedOutput) => {
    const normalizedGeneratedOutput = normalizeOutput(generatedOutput);
    const normalizedExpectedOutput = normalizeOutput(expectedOutput);
    return normalizedGeneratedOutput === normalizedExpectedOutput;
};
