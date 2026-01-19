import React from 'react';
import { Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';

const HourlyStats = ({ weather }) => {
  const getWeatherIcon = (condition, size = 'w-5 h-5') => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className={size} />;
    if (cond.includes('snow')) return <CloudSnow className={size} />;
    if (cond.includes('cloud') || cond.includes('overcast')) return <Cloud className={size} />;
    if (cond.includes('sunny') || cond.includes('clear')) return <Sun className={size} />;
    return <Cloud className={size} />;
  };

  const getHourlyData = () => {
    if (!weather?.hourly) return [];
    const currentHour = new Date().getHours();
    return weather.hourly.slice(currentHour, currentHour + 6);
  };

  if (!weather) return null;

  return (
    <div className="col-span-3 bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
      <div className="text-white/90 font-medium mb-6">Today's Hourly Forecast</div>
      <div className="grid grid-cols-6 gap-6">
        {getHourlyData().map((hour, index) => (
          <div 
            key={index} 
            className="text-center transform hover:scale-110 transition-all"
          >
            <div className="text-3xl font-light text-white mb-2">
              {hour.temp_c}°
            </div>
            <div className="text-xs text-white/60 mb-3">
              {new Date(hour.time).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="flex items-center justify-center gap-1 text-white/70 text-xs">
              {getWeatherIcon(hour.condition.text)}
              <span className="truncate">{hour.condition.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Wave graph */}
      <div className="mt-6 h-24 relative">
        <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
              <stop offset="50%" stopColor="rgba(147, 51, 234, 0.5)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.5)" />
            </linearGradient>
          </defs>
          <path
            d="M 0 50 Q 83 30, 166 50 T 333 50 T 500 50 T 666 50 T 833 50 T 1000 50"
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="3"
            className="animate-dash"
          />
        </svg>
      </div>
    </div>
  );
};

export default HourlyStats;