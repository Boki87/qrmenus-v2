import { useCallback, useEffect, useMemo, useState } from "react";

export default function useImageWidget() {
  const [image, setImage] = useState(null);

  const openWidget = useCallback((cb?: (url: string) => void) => {
    //@ts-ignore
    const widget = window.cloudinary?.createUploadWidget(
      {
        cloudName: "dgwhzqt43",
        uploadPreset: "p74kqu68",
        sources: ["local", "camera", "url"],
        maxImageFileSize: 5000000,
        // cropping: true,
      },
      (err: any, result: any) => {
        if (result.event === "success") {
          cb && cb(result.info.url);
        }
      }
    );
    widget.open();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return { openWidget };
}
