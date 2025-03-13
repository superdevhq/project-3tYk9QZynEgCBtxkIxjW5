
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MermaidPreviewProps {
  code: string;
}

declare global {
  interface Window {
    mermaid: {
      initialize: (config: any) => void;
      render: (
        id: string,
        graphDefinition: string,
        callback: (svgCode: string) => void,
        container?: Element
      ) => void;
    };
  }
}

const MermaidPreview = ({ code }: MermaidPreviewProps) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load Mermaid script if not already loaded
    if (!window.mermaid) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
      script.async = true;
      script.onload = () => {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
        });
        renderDiagram();
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else {
      renderDiagram();
    }
  }, [code]);

  const renderDiagram = () => {
    if (!window.mermaid || !code.trim()) return;

    try {
      const id = "mermaid-diagram";
      window.mermaid.render(
        id,
        code,
        (svgCode) => {
          setSvg(svgCode);
          setError(null);
        },
        previewRef.current
      );
    } catch (err) {
      console.error("Mermaid rendering error:", err);
      setError("Invalid diagram syntax. Please check your code.");
      setSvg(null);
    }
  };

  const downloadSvg = () => {
    if (!svg) return;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Your diagram has been downloaded as SVG",
    });
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">Preview</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadSvg}
          disabled={!svg}
        >
          <Download className="h-4 w-4 mr-2" />
          Download SVG
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {error ? (
          <div className="flex-1 flex items-center justify-center text-destructive text-sm p-4 border border-destructive/20 rounded-md bg-destructive/10">
            {error}
          </div>
        ) : (
          <div 
            ref={previewRef}
            className="flex-1 flex items-center justify-center overflow-auto p-4 bg-white rounded-md"
            dangerouslySetInnerHTML={{ __html: svg || "" }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MermaidPreview;
