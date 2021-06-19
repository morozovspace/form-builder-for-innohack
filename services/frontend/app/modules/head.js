export default { 
  title: process.env.PWA_OG_TITLE,
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'msapplication-TileColor',
      content: '#2b2b2b'
    },
    {
      name: 'theme-color',
      content: '#2b2b2b'
    },
  ],
  link: [
    { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
    { rel: "icon", type: 'image/png', sizes: "16x16", href: "/favicon-16x16.png" },
    { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#2b2b2b"},  
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Heebo:100,300,400,500,700,800,900" },
  ],
}