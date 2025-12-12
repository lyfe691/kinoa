"use client";

import { useEffect, useRef } from "react";

const AD_HTML = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; padding: 0; background: transparent; }
</style>
</head>
<body>
<script async="async" data-cfasync="false" src="https://pl28244055.effectivegatecpm.com/8c4c708ff7ed4f992b7fa7d8c0ef5dc1/invoke.js"></script>
<div id="container-8c4c708ff7ed4f992b7fa7d8c0ef5dc1"></div>
</body>
</html>
`;

export function NativeBanner() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const d = iframe.contentWindow?.document;
    if (d) {
      d.open();
      d.write(AD_HTML);
      d.close();
    }
  }, []);

  return (
    <div className="w-full flex justify-center">
      <iframe
        ref={iframeRef}
        title="Advertisement"
        className="w-full max-w-6xl border-none"
        scrolling="no"
      />
    </div>
  );
}
