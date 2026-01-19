import React from 'react';
import { MapPin, Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';

// Weather Animation Component (inline)
const WeatherAnimations = ({ condition, temp }) => {
  const cond = condition?.toLowerCase() || '';
  const isHot = temp > 30;
  const isCold = temp < 15;

  if (cond.includes('rain')) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 bg-blue-300 animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              height: `${Math.random() * 30 + 20}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 0.5 + 0.5}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (cond.includes('cloud') || cond.includes('overcast')) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-float-cloud"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${Math.random() * 150 + 100}px`,
              height: `${Math.random() * 60 + 40}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (cond.includes('clear') || cond.includes('sunny') || isHot) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 animate-pulse-sun">
          <div className="relative">
            <div className="w-32 h-32 bg-yellow-300/40 rounded-full blur-xl"></div>
            <div className="absolute inset-0 w-32 h-32 bg-yellow-400/60 rounded-full animate-spin-slow">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-16 bg-yellow-400/40 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-100%)`,
                    transformOrigin: 'center'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {isHot && (
          <>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-1 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent animate-heat-wave"
                style={{
                  top: `${20 + i * 15}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </>
        )}
      </div>
    );
  }

  if (cond.includes('snow') || isCold) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 3}s`
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

const WeatherCard = ({ weather, loading, weatherUtils }) => {
  const getWeatherIcon = (condition, size = 'w-32 h-32') => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className={size} />;
    if (cond.includes('snow')) return <CloudSnow className={size} />;
    if (cond.includes('cloud') || cond.includes('overcast')) return <Cloud className={size} />;
    if (cond.includes('sunny') || cond.includes('clear')) return <Sun className={size} />;
    return <Cloud className={size} />;
  };

  return (
    <div className="col-span-2 bg-gradient-to-br from-blue-400/40 to-blue-600/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative">
      {weather && (
        <>
          <WeatherAnimations 
            condition={weather.current.condition.text} 
            temp={weather.current.temp_c} 
          />

          <div className="absolute inset-0 opacity-20">
            <img 
              src={`https://source.unsplash.com/1200x800/?${weather.location.name},${weather.location.region},india,landscape`}
              alt="weather background"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://source.unsplash.com/1200x800/?maharashtra,india,landscape';
              }}
            />
          </div>

          <div className="relative z-10 p-8 h-full flex flex-col">
            <div className="flex items-center gap-2 text-white/90 mb-6">
              <MapPin className="w-5 h-5" />
              <span className="text-lg font-medium">
                {weather.location.name}, {weather.location.region}, {weather.location.country}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-between">
              <div>
                <div className="text-sm text-white/80 mb-2">Weather Forecast</div>
                <h2 className="text-6xl font-light text-white mb-3">
                  {weather.current.condition.text}
                </h2>
                <p className="text-lg text-white/80 max-w-md">
                  {weatherUtils.getConditionDescription(
                    weather.current.condition.text, 
                    weather.current.temp_c
                  )}
                </p>
              </div>
              <div className="text-white/90 animate-bounce-slow">
                {getWeatherIcon(weather.current.condition.text)}
              </div>
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-400/20 backdrop-blur-sm">
          <div className="text-white text-2xl animate-pulse">Loading weather data...</div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;