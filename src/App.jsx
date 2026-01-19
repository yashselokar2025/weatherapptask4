import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Sidebar from './components/Sidebar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import HourlyStats from './components/HourlyStats';

// Inline weatherService
const weatherService = {
  async getCoordinates(cityName) {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );
      
      if (!response.ok) {
        throw new Error('Location not found');
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error(`City "${cityName}" not found. Try another city name.`);
      }

      return data.results[0];
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }
  },

  async getWeatherData(latitude, longitude) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data from API');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  },

  async getCompleteWeather(cityName) {
    try {
      const geoData = await this.getCoordinates(cityName);
      const weatherData = await this.getWeatherData(geoData.latitude, geoData.longitude);
      
      return {
        location: {
          name: geoData.name,
          country: geoData.country,
          region: geoData.admin1 || '',
          latitude: geoData.latitude,
          longitude: geoData.longitude
        },
        weatherData
      };
    } catch (error) {
      console.error('Error getting complete weather:', error);
      throw error;
    }
  }
};

// Inline weatherUtils
const weatherUtils = {
  getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  },

  getWeatherDescription(code) {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with hail'
    };
    return weatherCodes[code] || 'Unknown';
  },

  processWeatherData(weatherData, location) {
    return {
      location,
      current: {
        temp_c: Math.round(weatherData.current.temperature_2m),
        feelslike_c: Math.round(weatherData.current.apparent_temperature),
        humidity: weatherData.current.relative_humidity_2m,
        wind_kph: Math.round(weatherData.current.wind_speed_10m * 3.6),
        wind_dir: this.getWindDirection(weatherData.current.wind_direction_10m),
        precip_mm: weatherData.current.precipitation || 0,
        cloud: weatherData.current.cloud_cover,
        condition: {
          text: this.getWeatherDescription(weatherData.current.weather_code),
          code: weatherData.current.weather_code
        }
      },
      hourly: weatherData.hourly.temperature_2m.slice(0, 24).map((temp, i) => ({
        time: new Date(weatherData.hourly.time[i]).toISOString(),
        temp_c: Math.round(temp),
        condition: {
          text: this.getWeatherDescription(weatherData.hourly.weather_code[i]),
          code: weatherData.hourly.weather_code[i]
        }
      })),
      daily: weatherData.daily.time.map((date, i) => ({
        date: date,
        day: {
          maxtemp_c: Math.round(weatherData.daily.temperature_2m_max[i]),
          mintemp_c: Math.round(weatherData.daily.temperature_2m_min[i]),
          avgtemp_c: Math.round((weatherData.daily.temperature_2m_max[i] + weatherData.daily.temperature_2m_min[i]) / 2),
          condition: {
            text: this.getWeatherDescription(weatherData.daily.weather_code[i]),
            code: weatherData.daily.weather_code[i]
          }
        }
      }))
    };
  },

  getDayName(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  },

  getConditionDescription(condition, temp) {
    const cond = condition?.toLowerCase() || '';
    
    if (cond.includes('cloud') || cond.includes('overcast')) {
      return 'Overcast sky with muted grey clouds — calm, soft, quiet.';
    } else if (cond.includes('rain')) {
      return 'Rainy weather with moderate precipitation expected.';
    } else if (temp > 30) {
      return 'Hot and sunny conditions. Stay hydrated and avoid direct sunlight.';
    } else if (cond.includes('clear') || cond.includes('sunny')) {
      return 'Clear skies with pleasant sunshine throughout the day.';
    } else {
      return 'Pleasant weather conditions throughout the day.';
    }
  }
};

function App() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const fetchWeather = async (city) => {
    if (!city.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Fetching weather for:', city);
      const { location, weatherData } = await weatherService.getCompleteWeather(city);
      const processedData = weatherUtils.processWeatherData(weatherData, location);
      
      console.log('✅ Weather data received for:', processedData.location.name);
      setWeather(processedData);
      setForecast({ forecastday: processedData.daily });
      setSearchOpen(false);
      setError('');
    } catch (err) {
      console.error('❌ Weather fetch error:', err);
      const errorMsg = err.message || 'Failed to fetch weather data';
      setError(errorMsg);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    fetchWeather(location);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    console.log('🚀 App starting - loading default weather...');
    // Try Nagpur first with fallback chain
    fetchWeather('Nagpur').catch(() => {
      console.log('⚠️ Nagpur failed, trying Mumbai...');
      fetchWeather('Mumbai').catch(() => {
        console.log('⚠️ Mumbai failed, trying Delhi...');
        fetchWeather('Delhi');
      });
    });
  }, []);

  const maharashtraCities = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative w-full max-w-7xl flex gap-6">
        <Sidebar onSearchOpen={() => setSearchOpen(!searchOpen)} />

        <div className="flex-1 grid grid-cols-3 gap-6">
          <WeatherCard weather={weather} loading={loading} weatherUtils={weatherUtils} />
          <ForecastCard weather={weather} forecast={forecast} weatherUtils={weatherUtils} />
          <HourlyStats weather={weather} />
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" 
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 max-w-md w-full mx-4 animate-scale-in" 
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Search Location</h3>
            <p className="text-sm text-gray-600 mb-4">
              Search for any city worldwide
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Nagpur, Tokyo, New York..."
                className="w-full bg-white/50 border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Searching...' : 'Search Weather'}
              </button>
              
              <div className="pt-3 border-t border-gray-300">
                <p className="text-xs text-gray-600 mb-2">Quick search Maharashtra cities:</p>
                <div className="flex flex-wrap gap-2">
                  {maharashtraCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setLocation(city);
                        fetchWeather(city);
                      }}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-all"
                    >
                      {city}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">💡 Tip: Just type the city name</p>
              </div>
            </div>
            {error && (
              <div className="mt-4 bg-red-100 border border-red-300 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading overlay for entire app */}
      {loading && !weather && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white/90 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-800 font-semibold">Loading weather data...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;