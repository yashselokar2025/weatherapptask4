import React from 'react';

const WeatherAnimations = ({ condition, temp }) => {
  const cond = condition?.toLowerCase() || '';
  const isHot = temp > 30;
  const isCold = temp < 15;

  // Rain Animation
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

  // Cloud Animation
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

  // Sunny/Hot Animation
  if (cond.includes('clear') || cond.includes('sunny') || isHot) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated sun */}
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
        {/* Heat waves */}
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

  // Snow Animation
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

export default WeatherAnimations;