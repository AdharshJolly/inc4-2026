import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import sitemap from "vite-plugin-sitemap";

const committeeCategories = [
  "chief-patron",
  "patrons",
  "honorary-chairs",
  "advisory-board",
  "organizing-committee",
  "program-committee",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    sitemap({
      hostname: "https://ic4.co.in",
      exclude: ["/404"],
      dynamicRoutes: [
        "/",
        "/about",
        "/committee",
        ...committeeCategories.map((cat) => `/committee/${cat}`),
        "/call-for-papers",
        "/registration",
        "/important-dates",
        "/schedule",
        "/speakers",
        "/contact",
      ],
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date(),
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
