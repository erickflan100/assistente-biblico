import React, { ReactNode, Suspense, useEffect } from "react";

export function InArticleAd({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-6668731572199276"
        data-ad-slot="1573549156"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
type format = "auto" | "rectangle" | "vertical" | "horizontal";

export function DisplayAdUnit({
  className,
  format,
}: {
  className?: string;
  format?: format;
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-6668731572199276"
        data-ad-slot="1573549156"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
