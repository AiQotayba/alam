import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  let title = ""
    , description = ""
    , image = "/images/logo.png"
    , site_name

  return (
    <Html lang="en">
      <Head>
        {/* ---------------  application  --------------- */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/assets/android-launchericon-144-144.png" />
        <link rel="icon" href="/assets/android-launchericon-144-144.png" />
        <meta name="theme-color" content="#fff" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
