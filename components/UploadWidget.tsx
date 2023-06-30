import { ChangeEvent, useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";

interface UploadImageProps {
  onUploadComplete: (url: string) => void;
  isUploading?: (val: boolean) => void;
  imageName?: string;
  options?: {
    upload_preset?: string;
    folder?: string;
  };
}

export default function UploadWidget({
  onUploadComplete,
  isUploading,
  imageName,
  options,
}: UploadImageProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [prevImage, setPrevImage] = useState<File | null>(null);

  async function uploadImage() {
    if (!image) return;

    let reqBody = {};
    if (imageName) {
      reqBody = {
        public_id: imageName,
        ...options,
      };
    }
    const signResponse = await fetch("/api/sign-cloudinary-params", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    const signData = await signResponse.json();

    const data = new FormData();
    data.append("file", image);
    data.append("api_key", signData.apikey);
    data.append("timestamp", signData.timestamp);
    data.append("signature", signData.signature);

    if (options?.upload_preset) {
      data.append("upload_preset", options.upload_preset);
    }
    if (options?.folder) {
      data.append("folder", options.folder);
    }
    if (imageName) {
      data.append("public_id", imageName);
    }

    try {
      isUploading && isUploading(true);
      setIsUploadingImage(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dgwhzqt43/image/upload/`,
        {
          method: "POST",
          body: data,
        }
      );
      const resData = await res.json();
      isUploading && isUploading(false);
      setIsUploadingImage(false);
      onUploadComplete(resData.url);
    } catch (e) {
      isUploading && isUploading(false);
      setIsUploadingImage(false);
      console.log(e);
    }
  }

  useEffect(() => {
    if (prevImage !== image) {
      setPrevImage(image);
      uploadImage();
    }
  }, [image]);

  return (
    <>
      <input
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target && e.target?.files?.length) {
            setImage(e.target.files[0]);
          }
        }}
        style={{ display: "none" }}
        type="file"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className={`btn ${isUploadingImage ? "btn-disabled" : ""}`}
      >
        {isUploadingImage ? <span>Uploading</span> : <span>Upload Image</span>}
        {isUploadingImage ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <FaUpload />
        )}
      </label>
    </>
  );
}
