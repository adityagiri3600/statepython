import React, { useState, useEffect } from "react";
import axios from "axios";

const PythonExecutor = () => {
  const [pythonCode, setPythonCode] = useState("");
  const [variables, setVariables] = useState({
    runButtonStyle: {
      border: "none",
      fontSize: "3rem",
      padding: "none",
    },
    runButtonText: "▶️",
  });
  const [error, setError] = useState(null);

  const handleCodeChange = (e) => {
    setPythonCode(e.target.value);
  };

  const runPythonCode = async () => {
    try {
      const response = await axios.post("/run-python", {
        variables,
        code: pythonCode,
      });

      const newVariables = response.data;

      // Update the React state with the variable values
      setVariables(newVariables);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error executing Python code", err);
      setError(
        "Error executing Python code: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        runPythonCode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pythonCode]);

  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        width: "fit-content",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        padding: "20px",
      }}
    >
      <textarea
        value={pythonCode}
        onChange={handleCodeChange}
        placeholder="Enter Python code"
        rows="10"
        cols="50"
        style={{
          fontFamily: "monospace",
          fontSize: "16px",
        }}
      />
      <button
        onClick={runPythonCode}
        style={variables.runButtonStyle}
      >
        {variables.runButtonText}
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        <h3>Variables:</h3>
        <pre>{JSON.stringify(variables, null, 2)}</pre>
      </div>
    </div>
  );
};

export default PythonExecutor;
