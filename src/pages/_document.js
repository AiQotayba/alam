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
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
