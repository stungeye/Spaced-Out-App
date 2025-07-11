import { useCallback } from "react";

interface UseFileUploadOptions {
  accept?: string;
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
  validator?: (data: unknown) => boolean;
}

/**
 * Reusable hook for handling file upload operations
 * Provides consistent file reading, parsing, and validation patterns
 */
export const useFileUpload = ({
  accept = ".json",
  onSuccess,
  onError,
  validator,
}: UseFileUploadOptions) => {
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (validator && !validator(data)) {
          throw new Error("Invalid file format or structure");
        }

        onSuccess(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to process file";
        onError(message);
      } finally {
        // Clear the input value so the same file can be selected again
        event.target.value = "";
      }
    },
    [onSuccess, onError, validator]
  );

  const createFileUploadProps = useCallback(
    () => ({
      type: "file" as const,
      accept,
      onChange: handleFileChange,
      className: "hidden",
    }),
    [accept, handleFileChange]
  );

  return {
    handleFileChange,
    createFileUploadProps,
    accept,
  };
};
