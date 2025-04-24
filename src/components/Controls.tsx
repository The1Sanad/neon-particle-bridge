
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Github } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function Controls() {
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();
  
  const handleToggle = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Connection disabled" : "Connection enabled",
      description: isActive ? "Energy bridge is cooling down" : "Particles are flowing between spheres",
      duration: 2000,
    });
  };
  
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
      <Button 
        variant="outline" 
        className={`bg-secondary/20 backdrop-blur-md border-cosmic-glow px-8 hover:bg-secondary/40 ${
          isActive ? "border-cosmic-green text-cosmic-green" : "text-white"
        }`}
        onClick={handleToggle}
      >
        {isActive ? "Disable Connection" : "Enable Connection"}
      </Button>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="bg-secondary/20 backdrop-blur-md border-cosmic-glow">
              <Info className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Neon Particle Bridge<br />Interactive 3D visualization</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="bg-secondary/20 backdrop-blur-md border-cosmic-glow" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View source code</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
