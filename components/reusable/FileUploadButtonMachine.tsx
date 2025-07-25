import { useState } from "react";

const FileUploadButtonMachine = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/machines/uploadData", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      alert("File uploaded successfully!");
      console.log("Uploaded data:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("There was an error uploading the file.");
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Upload Excel File
      </button>
    </div>
  );
};

export default FileUploadButtonMachine;
