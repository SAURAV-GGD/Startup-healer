import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e6f7f1',
      100: '#c2ebd9',
      200: '#9adfc0',
      300: '#6fd3a5',
      400: '#5FAF46',
      500: '#2E9E8E',
      600: '#278a7c',
      700: '#1f7369',
      800: '#175c56',
      900: '#0f4543',
    },
    blue: {
      400: '#3db8e0',
      500: '#1CA3D6',
      600: '#178fbd',
      700: '#117a9f',
    },
    green: {
      400: '#7cc362',
      500: '#5FAF46',
      600: '#4e9139',
      700: '#3d7a2d',
    },
    teal: {
      400: '#46b5a5',
      500: '#2E9E8E',
      600: '#278a7c',
      700: '#1f7369',
    },
    navy: {
      500: '#1F2937',
      600: '#111827',
      700: '#0a0f1a',
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: '#F7FAFC',
        color: '#1F2937',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: '8px',
        fontWeight: '600',
      },
      variants: {
        gradient: {
          bg: 'linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)',
          color: 'white',
          _hover: {
            bg: 'linear-gradient(135deg, #4e9139 0%, #278a7c 50%, #178fbd 100%)',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            transform: 'translateY(0)',
          },
        },
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          bg: 'white',
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 3,
        py: 1,
        fontSize: 'xs',
        fontWeight: '600',
      },
    },
  },
})

export default theme
