import React, { useEffect, useState } from "react";
import { ApiResponse } from "./types";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string | undefined>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async (): Promise<void> => {
    try {
      const response = await fetch(API_URL);
      const jsonData: ApiResponse = await response.json();
      setData(jsonData.data);
    } catch (error) {
      console.error("Error fetching data");
    }
  };

  const updateData = async (): Promise<void> => {
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      await getData();
    } catch (error) {
      console.error("Error updating data");
    }
  };

  const verifyData = async (): Promise<void> => {
    throw new Error("Not implemented");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
