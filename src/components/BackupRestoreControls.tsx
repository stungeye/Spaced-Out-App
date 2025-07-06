import { useLearnerContext } from "@/context/LearnerContext";
import { useRef } from "react";

const BackupRestoreControls = () => {
  const { state: appState, dispatch } = useLearnerContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `spaced-out-backup-${new Date().toISOString()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === "string") {
          const restoredState = JSON.parse(text);
          // TODO: Add validation to ensure the restored state is valid
          dispatch({ type: "RESTORE_STATE", payload: restoredState });
          alert("State restored successfully!");
        }
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        alert("Failed to restore state. The file might be corrupted.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Backup & Restore</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Save your current progress to a file or restore from a backup.
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleBackup}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Backup
        </button>
        <button
          onClick={handleRestoreClick}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Restore
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".json"
        />
      </div>
    </div>
  );
};

export default BackupRestoreControls;
