
import { Scene } from "@/components/Scene";
import { Header } from "@/components/Header";
import { Controls } from "@/components/Controls";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* 3D Scene */}
      <Scene />
      
      {/* Content overlay */}
      <div className="content">
        <Header />
        <Controls />
      </div>
    </div>
  );
};

export default Index;
