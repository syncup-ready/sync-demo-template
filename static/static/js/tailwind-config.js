tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: "#1e40af",
          secondary: "#ea580c",
          accent: "#0f766e",
          dark: "#1e293b",
          light: "#f8fafc"
        },
        keyframes: {
          'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
          'bounce-in': {
            '0%': { transform: 'scale(0.9)', opacity: '0' },
            '50%': { transform: 'scale(1.05)', opacity: '1' },
            '100%': { transform: 'scale(1)', opacity: '1' }
          },
          'zoom-slow': {
            '0%': { transform: 'scale(1)' },
            '100%': { transform: 'scale(1.05)' }
          }
        },
        animation: {
          'fade-in': 'fade-in 1s ease-out forwards',
          'bounce-in': 'bounce-in 0.8s ease-out forwards',
          'zoom-slow': 'zoom-slow 6s ease-in-out infinite'
        }
      }
    }
  };  