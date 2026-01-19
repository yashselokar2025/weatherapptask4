import React from 'react';
import { Wind, Droplets, Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';

const ForecastCard = ({ weather, forecast, weatherUtils }) => {
  const getWeatherIcon = (condition, size = 'w-6 h-6') => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className={size} />;
    if (cond.includes('snow')) return <CloudSnow className={size} />;
    if (cond.includes('cloud') || cond.includes('overcast')) return <Cloud className={size} />;
    if (cond.includes('sunny') || cond.includes('clear')) return <Sun className={size} />;
    return <Cloud className={size} />;
  };

  if (!weather) return null;

  return (
    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-white/70 text-sm mb-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        <div className="text-white/70 text-sm">
          {new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-8xl font-light text-white mb-2 animate-fade-in">
          {weather.current.temp_c}°
        </div>
        <div className="flex items-center justify-center gap-2 text-white/70">
          <Wind className="w-4 h-4" />
          <span>{weather.current.wind_dir}, {weather.current.wind_kph} km/h</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/70 mt-2">
          <Droplets className="w-4 h-4" />
          <span>Humidity: {weather.current.humidity}%</span>
        </div>
      </div>

      <div className="border-t border-white/20 pt-6">
        <div className="text-white/90 font-medium mb-4">The Next 7 Days</div>
        
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 bg-white/20 rounded-full text-white text-sm">
            7 days
          </button>
          <button className="px-4 py-2 hover:bg-white/10 rounded-full text-white/70 text-sm">
            14 days
          </button>
          <button className="px-4 py-2 hover:bg-white/10 rounded-full text-white/70 text-sm">
            30 days
          </button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {forecast?.forecastday?.slice(1, 7).map((day, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between text-white/90 py-2 hover:bg-white/10 rounded-lg px-2 transition-all"
            >
              <div className="flex items-center gap-3 flex-1">
                {getWeatherIcon(day.day.condition.text)}
                <div>
                  <div className="text-sm font-medium">
                    {weatherUtils.getDayName(day.date).split(',')[0]}
                  </div>
                  <div className="text-xs text-white/60">
                    {day.day.condition.text}
                  </div>
                </div>
              </div>
              <div className="text-lg font-medium">{day.day.avgtemp_c}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;