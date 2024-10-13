import Script from "next/script";

export default function Adsense() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6668731572199276"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    ></Script>
  );
}
