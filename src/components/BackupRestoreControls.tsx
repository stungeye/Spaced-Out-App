import { useLearnerContext } from "@/context/LearnerContext";
import { actionCreators } from "@/lib/actionCreators";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

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
          dispatch(actionCreators.restoreState(restoredState));
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
        Save or restore progress to/from backup files.
      </p>
      <div className="flex gap-4">
        <Button onClick={handleBackup}>Backup</Button>
        <Button onClick={handleRestoreClick} variant="secondary">
          Restore
        </Button>
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
