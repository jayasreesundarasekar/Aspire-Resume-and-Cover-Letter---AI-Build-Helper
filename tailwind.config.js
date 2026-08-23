/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#FBF3E1',
        surface: '#FFFDF7',
        surface2: '#F6E8C4',
        line: '#E3CA92',
        ink: '#2E2113',
        muted: '#8A7658',
        amber: {
          DEFAULT: '#C9971F',
          dim: '#A67C1B'
        },
        signal: {
          DEFAULT: '#9C6B1E',
          dim: '#7A5216'
        },
        danger: '#C4483A',
        success: '#4E8A4E'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)'
      }
    }
  },
  plugins: []
}
