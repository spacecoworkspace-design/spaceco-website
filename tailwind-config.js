tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: '#14120F',
        paper: '#F7F3EA',
        papercard: '#FCFAF3',
        brass: '#B8843A',
        brassdeep: '#8C6425',
        graphite: '#6B655A'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      maxWidth: {
        wrap: '1180px'
      },
      transitionTimingFunction: {
        focus: 'cubic-bezier(.2,.8,.2,1)'
      }
    }
  }
};
