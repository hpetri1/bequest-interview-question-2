import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { ApiResponse } from "./types";
import { validationSchema } from "./utils/validationSchema.ts";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (): Promise<void> => {
    try {
      const response = await fetch(API_URL);
      const jsonData: ApiResponse = await response.json();
      setData(DOMPurify.sanitize(jsonData.data || ""));
    } catch (error) {
      console.error("Error fetching data");
    }
  };

  const validateData = async (value: string): Promise<boolean> => {
    try {
      await validationSchema.validate({ data: value });
      setError(null);
      return true;
    } catch (validationError: any) {
      setError(validationError.errors[0]);
      return false;
    }
  };

  const updateData = async (): Promise<void> => {
    const isValid = await validateData(data);
    if (!isValid) return;

    const sanitizedData = DOMPurify.sanitize(data);

    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data: sanitizedData }),
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

  const verifyData = async (): Promise<void> => {};

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
        onChange={(e) => {
          setData(e.target.value);
          setError(null);
        }}
      />
      {error && <div style={{ color: "red", fontSize: "16px" }}>{error}</div>}{" "}
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
