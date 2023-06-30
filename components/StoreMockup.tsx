import { RefObject } from "react";

interface StoreMockupProps {
  storeId: string;
  iframeRef?: RefObject<HTMLIFrameElement>;
}

export default function StoreMockup({ iframeRef, storeId }: StoreMockupProps) {
  return (
    <div className="mockup-phone">
      <div className="camera"></div>
      <div className="display">
        <div className="artboard artboard-demo phone-1">
          <div className="h-full w-full">
            <iframe
              ref={iframeRef}
              src={`${process.env.NEXT_PUBLIC_APP_URL}/store/${storeId}`}
              style={{ height: "100%", width: "100%", border: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
