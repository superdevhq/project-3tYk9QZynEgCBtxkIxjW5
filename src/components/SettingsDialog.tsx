
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApiKey } from "@/hooks/use-api-key";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { apiKey, setApiKey } = useApiKey();
  const [inputKey, setInputKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open && apiKey) {
      setInputKey("•".repeat(apiKey.length));
    } else if (!open) {
      setInputKey("");
    }
  }, [open, apiKey]);

  const handleSave = () => {
    // If the input is all dots, it means the user didn't change it
    if (inputKey && !inputKey.match(/^•+$/)) {
      setApiKey(inputKey);
      toast({
        title: "Settings Saved",
        description: "Your OpenAI API key has been saved",
      });
      onOpenChange(false);
    } else if (!inputKey) {
      // If the input is empty, clear the API key
      setApiKey("");
      toast({
        title: "API Key Cleared",
        description: "Your OpenAI API key has been removed",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your OpenAI API key to generate diagrams with GPT-4o-mini.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
