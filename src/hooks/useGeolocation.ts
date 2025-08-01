import { useState, useEffect } from 'react';

interface GeolocationState {
  country: string | null;
  countryCode: string | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    country: null,
    countryCode: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Try geolocation first
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Use a reverse geocoding service
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
                );
                const data = await response.json();
                setState({
                  country: data.countryName,
                  countryCode: data.countryCode?.toLowerCase(),
                  loading: false,
                  error: null,
                });
              } catch (error) {
                // Fallback to IP-based detection
                await detectByIP();
              }
            },
            async () => {
              // Geolocation denied, fallback to IP
              await detectByIP();
            },
            { timeout: 10000 }
          );
        } else {
          await detectByIP();
        }
      } catch (error) {
        await detectByIP();
      }
    };

    const detectByIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setState({
          country: data.country_name,
          countryCode: data.country_code?.toLowerCase(),
          loading: false,
          error: null,
        });
      } catch (error) {
        // Final fallback to browser language
        const browserLang = navigator.language;
        let countryCode = 'cm'; // Default to Cameroon
        
        if (browserLang.includes('fr')) countryCode = 'fr';
        else if (browserLang.includes('en')) countryCode = 'us';
        else if (browserLang.includes('es')) countryCode = 'es';
        else if (browserLang.includes('de')) countryCode = 'de';
        
        setState({
          country: null,
          countryCode,
          loading: false,
          error: 'Could not detect location',
        });
      }
    };

    detectCountry();
  }, []);

  return state;
};