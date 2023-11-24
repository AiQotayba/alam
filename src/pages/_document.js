import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() { 
    return (
        <Html lang="ar">
            <Head>
                {/* ---------------  application  --------------- */}
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/assets/android-launchericon-144-144.png" />
                <meta name="theme-color" content="#fff" />
                {/* ios */}
                <link rel="apple-touch-icon" href="/assets/android-launchericon-144-144.png" />
                <link rel="apple-mobile-web-app-status-bar" content="#fff" />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
