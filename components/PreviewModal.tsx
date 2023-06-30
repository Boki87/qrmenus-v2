import { AnimatePresence, motion } from "framer-motion";
import StoreMockup from "./StoreMockup";
import { useCallback, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
}

export default function PreviewModal({
  isOpen,
  storeId,
  onClose,
}: PreviewModalProps) {
  const listenForEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose && onClose();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keyup", listenForEscape);
    return () => window.removeEventListener("keyup", listenForEscape);
  }, []);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          className="w-full h-full fixed top-0 left-0 bg-black bg-opacity-30 z-50 overflow-y-auto flex items-center justify-center"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-1 right-1 btn btn-sm rounded-full w-8 h-8"
          >
            <FaTimes />
          </button>
          <StoreMockup storeId={storeId} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
