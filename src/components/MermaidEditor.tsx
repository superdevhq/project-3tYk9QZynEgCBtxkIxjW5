
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApiKey } from "@/hooks/use-api-key";

interface MermaidEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MermaidEditor = ({ value, onChange }: MermaidEditorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { apiKey } = useApiKey();
  const { toast } = useToast();

  const generateDiagram = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please add your OpenAI API key in settings",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a description for your diagram",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates Mermaid diagram code based on user descriptions. Only respond with valid Mermaid syntax without any explanations or markdown formatting."
            },
            {
              role: "user",
              content: `Generate a Mermaid diagram for: ${prompt}`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const generatedCode = data.choices[0].message.content.trim();
      
      // Remove markdown code blocks if present
      const cleanedCode = generatedCode.replace(/```mermaid\n|```/g, "").trim();
      onChange(cleanedCode);
      
      toast({
        title: "Diagram Generated",
        description: "Your Mermaid diagram has been created",
      });
    } catch (error) {
      console.error("Error generating diagram:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate diagram",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-sm font-medium">
          Describe your diagram
        </label>
        <div className="flex gap-2">
          <Textarea
            id="prompt"
            placeholder="E.g., Create a flowchart showing user authentication process"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 min-h-[80px] resize-none"
          />
          <Button 
            onClick={generateDiagram} 
            disabled={isGenerating || !prompt.trim()}
            className="self-end"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <label htmlFor="mermaid-code" className="text-sm font-medium">
          Mermaid Code
        </label>
        <Textarea
          id="mermaid-code"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-sm resize-none"
        />
      </div>
    </div>
  );
};

export default MermaidEditor;
