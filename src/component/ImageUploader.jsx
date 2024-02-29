import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const handleImageChange = async (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);

    const file = new FileReader();
    file.onload = function () {
      setPreview(file.result);
    };
    file.readAsDataURL(imageFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const imageFile = event.dataTransfer.files[0];
    setSelectedImage(imageFile);

    const file = new FileReader();
    file.onload = function () {
      setPreview(file.result);
    };
    file.readAsDataURL(imageFile);
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET); 
      formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY); 

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/djyycpc60/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        }
      );

      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <h1>Image Uploader</h1>
      <div
        style={{ border: "2px dashed #aaa", padding: "20px", margin: "20px 0" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag & drop your image here</p>
      </div>
      <div>
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleUpload} disabled={!selectedImage || uploading}>
          Upload
        </button>
      </div>
      {preview && (
        <div>
          <p>Preview:</p>
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        </div>
      )}
      {uploading && <p>Uploading... {uploadProgress}%</p>}
      {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
    </div>
  );
};

export default ImageUploader;
