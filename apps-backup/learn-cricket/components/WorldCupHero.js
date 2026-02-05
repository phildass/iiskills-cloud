/**
 * WorldCupHero Component
 * 
 * Reusable hero section for World Cup pages
 * Features:
 * - Consistent height (520px desktop, 300px mobile)
 * - Dark gradient overlay
 * - Optional background image
 */

export default function WorldCupHero({ title, subtitle, backgroundImage }) {
  return (
    <div 
      className="relative flex items-center justify-center text-white h-[300px] md:h-[520px]"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #1e3a8a 0%, #0e7490 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-2xl text-gray-100 drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>
    </div>
  );
}
