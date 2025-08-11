import { useEffect, useState } from "react";
import API from "../../../services/api";

const ImageUploader = ({
  productId,
  myProducts,
  setIsCreating,
  loadProducts,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      selectedFiles.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const product = myProducts.find((p) => p._id === productId);
    const existingImages = product?.images || [];

    const existingCount = existingImages.length;
    const totalCount = existingCount + selectedFiles.length + files.length;

    if (totalCount > 10) {
      alert(
        `You can only upload up to 10 images total. You already have ${existingCount} uploaded.`
      );
      return;
    }

    const newFiles = files
      .filter((file) => {
        const fileKey = file.name + file.size;

        const isAlreadySelected = selectedFiles.some(
          (f) => f.file.name + f.file.size === fileKey
        );

        const isAlreadyUploaded = existingImages.some(
          (img) => img.originalName === file.name && img.size === file.size
        );

        return !isAlreadySelected && !isAlreadyUploaded;
      })
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeSelectedFile = (index) => {
    const { url } = selectedFiles[index];
    URL.revokeObjectURL(url);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async () => {
    if (!productId || selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach(({ file }) => {
      formData.append("images", file);
    });

    setUploading(true);

    try {
      const res = await API.post(`products/${productId}/images`, formData);
      alert(res.data.message);
      setIsCreating(true);
      selectedFiles.forEach(({ url }) => URL.revokeObjectURL(url));
      setSelectedFiles([]);

      await loadProducts();
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-section">
      <label htmlFor="image-upload" className="upload-btn">
        Upload Images (up to 10)
      </label>
      <input
        key={selectedFiles.length}
        id="image-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={uploading}
      />
      <div className="image-preview">
        {selectedFiles.map(({ url }, idx) => (
          <div key={idx} className="preview-wrapper">
            <img src={url} alt="preview" />
            <button
              type="button"
              className="remove-preview-btn"
              onClick={() => removeSelectedFile(idx)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {selectedFiles.length > 0 && (
        <button
          onClick={handleImageUpload}
          disabled={uploading}
          className="submit-product-btn uploading-btn"
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
