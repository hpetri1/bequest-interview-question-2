import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { InputData } from "./types";
import { validationSchema } from "./utils/validation.ts";
import { decryptData, encryptData, generateHash } from "./utils/security.ts";
import VerifyModal from "./components/VerifyModal.tsx";
import { Flex, Input, Button, Text, useDisclosure } from "@chakra-ui/react";

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
  const [changed, setChanged] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getData();
  }, []);

  const getData = async (): Promise<void> => {
    try {
      const response = await fetch(API_URL);
      const jsonData: InputData = await response.json();

      // Decrypt the data received from the server
      const decryptedData = decryptData(jsonData.data);
      // Sanitize the decrypted data
      const sanitizedData = DOMPurify.sanitize(decryptedData || "");

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

    const encryptedData = encryptData(sanitizedData);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          data: encryptedData,
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
      setChanged(false);
      onOpen();
    } else {
      setChanged(true);
      onOpen();
    }
  };

  const undoUpdate = () => {
    setData(initialData);
    onClose();
  };

  return (
    <Flex
      w="100vw"
      h="100vh"
      position="absolute"
      p={0}
      justify="center"
      align="center"
      flexDirection="column"
      gap="20px"
      fontSize="30px"
    >
      <Text fontSize="30px">Saved Data</Text>
      <Flex>
        <Input
          borderColor="black"
          id="data-input"
          fontSize="30px"
          value={data.data}
          onChange={(e) => {
            setData({
              data: e.target.value,
              hash: "",
            });
            setError(null);
          }}
        />
      </Flex>
      {error && (
        <Text color="red" fontSize="16px">
          {error}
        </Text>
      )}
      <Flex gap="10px">
        <Button
          fontSize="20px"
          colorScheme="blue"
          variant="outline"
          onClick={updateData}
        >
          Update Data
        </Button>
        <Button
          fontSize="20px"
          colorScheme="blue"
          variant="outline"
          onClick={verifyData}
        >
          Verify Data
        </Button>
        <VerifyModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={undoUpdate}
          isChanged={changed}
        />
      </Flex>
    </Flex>
  );
}

export default App;
