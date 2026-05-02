import { getMoonPhase } from '../lib/astronomy';

export default function MoonViewer({ currentDate }: { currentDate: Date }) {
  // calculate physical moon phase 0.0 - 1.0
  const phase = getMoonPhase(currentDate);
  
  // A simple way to simulate moon phase using CSS drop-shadow and rotation
  // This isn't perfect 3D but gives a nice dynamic effect.
  // 0.0 = New Moon (shadow covers), 0.5 = Full Moon (no shadow)
  
  return (
    <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] mx-auto mt-[45vh] -translate-y-1/2 flex items-center justify-center rounded-full overflow-hidden">
       {/* Background space/darkness within the moon bounding box if needed */}
       <div className="absolute inset-0 bg-black rounded-full" />
       
       <img 
          src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg"
          alt="The Moon"
          className="relative z-10 w-full h-full object-cover rounded-full select-none"
          style={{
             filter: 'grayscale(100%) contrast(1.1) brightness(0.9)',
          }}
          draggable="false"
       />

       {/* Overlay shadow to simulate moon phases */}
       <div 
          className="absolute inset-0 z-20 rounded-full"
          style={{
            background: phase < 0.5 
              ? `linear-gradient(to right, rgba(0,0,0,0.95) ${100 - (phase * 200)}%, transparent)`
              : `linear-gradient(to left, rgba(0,0,0,0.95) ${(phase - 0.5) * 200}%, transparent)`,
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
            mixBlendMode: 'multiply'
          }}
       />
       
       {/* Ambient glow */}
       <div 
          className="absolute inset-0 z-30 rounded-full pointer-events-none"
          style={{
            boxShadow: '0 0 60px rgba(255, 255, 255, 0.05), inset 0 0 20px rgba(0,0,0,0.5)'
          }}
       />
    </div>
  );
}
