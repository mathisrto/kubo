// components/ThemeScript.tsx
"use client";

export default function ThemeScript() {
    const code = `
    (function() {
      try {
        let theme = localStorage.getItem("theme") || "system";

        if (theme === "system") {
          theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }

        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
      } catch(e) {
        console.error("ThemeScript error:", e);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add('light');
      }
    })();
  `;

    return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
