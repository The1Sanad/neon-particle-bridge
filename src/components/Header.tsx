
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <div className="absolute top-0 left-0 w-full p-6 text-center z-10">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-red via-white to-cosmic-green mb-4">
        Neon Particle Bridge
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6">
        Interactive visualization of energy transfer between two cosmic spheres
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        <Badge variant="outline" className="bg-cosmic-red/20 text-cosmic-red border-cosmic-red/50">
          WebGL
        </Badge>
        <Badge variant="outline" className="bg-cosmic-green/20 text-cosmic-green border-cosmic-green/50">
          Three.js
        </Badge>
        <Badge variant="outline" className="bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/50">
          React
        </Badge>
        <Badge variant="outline" className="bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/50">
          Tailwind CSS
        </Badge>
      </div>
    </div>
  );
}
