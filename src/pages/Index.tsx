
import { useState } from "react";
import MermaidEditor from "@/components/MermaidEditor";
import MermaidPreview from "@/components/MermaidPreview";
import SettingsDialog from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Index = () => {
  const [mermaidCode, setMermaidCode] = useState<string>(
    "graph TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Do Something]\n  B -->|No| D[Do Nothing]\n  C --> E[End]\n  D --> E"
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mermaid Editor</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <MermaidEditor 
          value={mermaidCode} 
          onChange={setMermaidCode} 
        />
        <MermaidPreview code={mermaidCode} />
      </main>

      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </div>
  );
};

export default Index;
