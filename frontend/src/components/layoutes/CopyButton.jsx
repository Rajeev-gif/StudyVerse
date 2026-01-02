import React, { useState } from "react";
import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/outline";

/**
 * A button component that copies text to the clipboard with visual feedback.
 * @param {object} props - The component props.
 * @param {string} props.textToCopy - The text content to be copied to the clipboard.
 * @param {string} [props.className] - Optional additional Tailwind CSS classes for the button.
 */

const CopyButton = ({ textToCopy, className }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
        isCopied
          ? "bg-gray-600 text-white hover:bg-gray-700"
          : "bg-blue-500 text-white hover:bg-blue-600"
      } ${className || ""} `}
    >
      {isCopied ? (
        <CheckIcon className="w-4 h-4 md:w-5 md:h-5" />
      ) : (
        <DocumentDuplicateIcon className="w-4 h-4 md:w-5 md:h-5" />
      )}
      {isCopied ? "" : ""}
    </button>
  );
};

export default CopyButton;
