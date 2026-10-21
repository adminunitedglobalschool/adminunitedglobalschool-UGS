# Render Deployment Guide - United Global School

Aap is project ko **Render (render.com)** par do tareeqo se host kar sakte hain:

---

## Tareeqa 1: Render Web Service (Recommended - Production Node Server)

Repository me already `render.yaml` aur production `server.js` optimized set hai.

1. **GitHub par push karein**: Code ko apne GitHub repository me push karein.
2. **Render Dashboard** par jayein: [dashboard.render.com](https://dashboard.render.com).
3. **New +** button click karke **Web Service** select karein.
4. Apna GitHub repository connect karein.
5. Render settings me ye exact values enter karein:
   - **Name**: `united-global-school`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (ya `node server.js`)
   - **Health Check Path**: `/health`
   - **Instance Type**: `Free`
6. **Environment Variables**:
   - `NODE_VERSION` = `20`
7. **Deploy Web Service** par click karein.

---

## Tareeqa 2: Render Static Site (100% Free - Fast CDN)

Agar aap Express server nahi chalana chahte aur direct static frontend host karna chahte hain:

1. Render me **New +** -> **Static Site** select karein.
2. Repository connect karein.
3. Configure karein:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Redirects/Rewrites (Important for Single Page Application)**:
   - Render dashboard me **Redirects/Rewrites** tab par jayein:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`
5. **Create Static Site** par click karein.

---

## Common Render Errors & Solutions (Troubleshooting)

### 1. Error: "sh: 1: vite: not found" ya "tailwindcss: not found"
- **Wajah**: Render me `NODE_ENV=production` set hone par npm devDependencies skip kar deta hai.
- **Solution**: Hamne `package.json` me sabhi build tools (`vite`, `tailwindcss`, `typescript`) ko `dependencies` me move kar diya hai, jisse ye error aana band ho gaya hai.

### 2. Error: "Timed out waiting for port" ya "Port binding error"
- **Wajah**: Render automatic dynamic port provide karta hai (`process.env.PORT`, jaise 10000).
- **Solution**: `server.js` me `PORT = Number(process.env.PORT) || 3000` aur `0.0.0.0` par listen set hai, saath me `/health` check route configured hai.

### 3. Error: "dist folder not found" ya "dist/index.html missing"
- **Wajah**: Build command run nahi hui ya fail ho gayi.
- **Solution**: Render settings me verify karein ki **Build Command** `npm install && npm run build` set hai.

### 4. Blank Page / 404 on refresh (Static Site pe)
- **Solution**: Render Static Site settings me **Redirects/Rewrites** me `/*` -> `/index.html` (Action: `Rewrite`) add karein.
