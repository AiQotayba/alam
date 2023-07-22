import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import Head from 'next/head'
import 'nprogress/nprogress.css'; //styles of nprogress 

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

import '../styles/style.sass'
import '../styles/beta.sass'
import Layout from '@/theme/layout';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#fff" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <link rel="shortcut icon" href="/images/logo.png" />
      </Head>
      <Layout >

        <Component {...pageProps} />

      </Layout>
    </>
  )
}
