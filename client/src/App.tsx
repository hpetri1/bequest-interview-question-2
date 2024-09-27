import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { InputData } from "./types";
import { validationSchema } from "./utils/validation.ts";
import { generateHash } from "./utils/generateHash.ts";

const API_URL = "http://localhost:8080";

function App() {
  const [initialData, setInitialData] = useState<InputData>({
    data: "",
    hash: "",
  });
  const [data, setData] = useState<InputData>({
    data: "",
    hash: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (): Promise<void> => {
    try {
      const response = await fetch(API_URL);
      const jsonData: InputData = await response.json();
      const sanitizedData = DOMPurify.sanitize(jsonData.data || "");
      setInitialData({
        data: sanitizedData,
        hash: jsonData.hash || "",
      });
      setData({
        data: sanitizedData,
        hash: jsonData.hash || "",
      });
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
    const isValid = await validateData(data.data);
    if (!isValid) return;

    const sanitizedData = DOMPurify.sanitize(data.data);
    const newHash = generateHash(sanitizedData);

    if (initialData.hash === newHash) {
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          data: sanitizedData,
          hash: newHash,
        } as InputData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error updating data");

      await getData();
    } catch (error) {
      console.error("Error updating data");
    }
  };

  const verifyData = async (): Promise<void> => {
    const isValid = await validateData(data.data);
    if (!isValid) return;

    const sanitizedData = DOMPurify.sanitize(data.data);
    const newHash = generateHash(sanitizedData);
    const expectedHash = initialData.hash;
    if (newHash === expectedHash) {
      alert("Data has NOT changed!");
    } else {
      alert("Data has changed!");
    }
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
        value={data.data}
        onChange={(e) => {
          setData({
            data: e.target.value,
            hash: "",
          });
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
