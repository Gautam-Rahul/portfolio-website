import React, { useCallback, useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useTheme } from '../context/ThemeContext';

export const ParticlesBackground = ({ mousePosition }) => {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);
  
  const getParticlesConfig = useCallback(() => {
    return {
      fullScreen: {
        enable: true,
        zIndex: -1
      },
      particles: {
        number: {
          value: 60,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: isDarkMode ? '#ffffff' : '#000000',
          animation: {
            enable: false,
            speed: 20,
            sync: true
          }
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: 0.3,
          random: false,
          animation: {
            enable: false,
            speed: 3,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          animation: {
            enable: false,
            speed: 20,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: isDarkMode ? '#ffffff' : '#000000',
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.5
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 0.8
          },
          repulse: {
            distance: 200
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    };
  }, [isDarkMode]);
  
  if (!mounted) return null;
  
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={getParticlesConfig()}
    />
  );
}; 