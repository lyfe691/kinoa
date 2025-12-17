"use client";

import { useEffect, useRef, useState } from "react";

const AD_HTML = `<!DOCTYPE html>
<html style="background:transparent;color-scheme:light dark">
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
html,body{margin:0;padding:0;background:transparent!important;font-family:'Noto Sans',system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;color-scheme:light dark}
*{box-sizing:border-box}
</style>
</head>
<body style="background:transparent">
<script async data-cfasync="false" src="https://pl28244055.effectivegatecpm.com/8c4c708ff7ed4f992b7fa7d8c0ef5dc1/invoke.js"></script>
<div id="container-8c4c708ff7ed4f992b7fa7d8c0ef5dc1"></div>
</body>
</html>`;

export function NativeBanner() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || initialized.current) return;
    initialized.current = true;

    const doc = iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(AD_HTML);
      doc.close();
    }
    let attempts = 0;
    const maxAttempts = 50;
    const interval = setInterval(() => {
      const body = iframe.contentDocument?.body;
      if (body) {
        const newHeight = body.scrollHeight;
        if (newHeight > 0) setHeight(newHeight);
      }
      attempts++;
      if (attempts >= maxAttempts) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <iframe
        ref={iframeRef}
        title="Advertisement"
        style={{ height: height || undefined, background: "transparent" }}
        className={`w-full max-w-6xl border-none transition-all duration-300 ${
          height === 0 ? "h-0 opacity-0" : "opacity-100"
        }`}
        scrolling="no"
        // @ts-expect-error
        allowtransparency="true"
      />
    </div>
  );
}
