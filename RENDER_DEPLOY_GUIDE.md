# Render Deployment Guide - United Global School

Aap is project ko **Render (render.com)** par do tareeqo se host kar sakte hain:

---

## Tareeqa 1: Render Web Service (Recommended - Zero Configuration)

Repository me already `render.yaml` aur production `server.js` set kar diya gaya hai.

1. **GitHub par push karein**: Code ko apne GitHub repository me push karein.
2. **Render Dashboard** par jayein: [dashboard.render.com](https://dashboard.render.com).
3. **New +** button click karke **Web Service** select karein.
4. Apna GitHub repository connect karein.
5. Render settings me ye details enter karein:
   - **Name**: `united-global-school`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
   - **Instance Type**: `Free`
6. **Deploy Web Service** par click karein.

---

## Tareeqa 2: Render Static Site (100% Free - No Sleeping Server)

Agar aap Express server nahi chalana chahte aur static frontend host karna chahte hain:

1. Render me **New +** -> **Static Site** select karein.
2. Repository connect karein.
3. Configure karein:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Redirects/Rewrites (Important for SPA)**:
   - Render dashboard me **Redirects/Rewrites** tab par jayein:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`
5. **Create Static Site** par click karein.

---

## Environment Variables & Firebase
- Firebase configuration (`firebase-applet-config.json`) already project ke andar bundle ho kar build hoti hai, isliye live database queries bina kisi additional setup ke direct chalenge.
