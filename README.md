# SystemBetLab (TipCredit) - Deployment Guide

This project is a React application built with Vite and Tailwind CSS. It includes all necessary components for Stripe compliance verification.

## 🚀 How to Publish (Deploy)

The easiest way to publish this website for free and get a URL for Stripe is using **Vercel**.

### Option 1: Deploy via GitHub (Recommended)

1.  **Download the Code**: Save all project files to a folder on your computer.
2.  **Create a Repository**: Go to [GitHub.com](https://github.com), create a new repository. **Important: Name it in lowercase**, e.g., `systembetlab-web`.
3.  **Upload Files**: Upload your project files to GitHub.
4.  **Connect to Vercel**:
    *   Go to [Vercel.com](https://vercel.com) and sign up/login.
    *   Click **"Add New Project"**.
    *   Select "Continue with GitHub" and choose your repository.
    *   **PROJECT NAME ERROR?** If Vercel complains about the name, ensure the **Project Name** field contains **only lowercase letters** (a-z), numbers, and hyphens. 
        *   ❌ Bad: `SystemBetLab` or `TipCredit`
        *   ✅ Good: `systembetlab-app` or `tipcredit-web`
    *   Click **Deploy**.
5.  **Get URL**: Once finished, Vercel gives you a domain (e.g., `https://systembetlab-app.vercel.app`).

### Option 2: Drag & Drop (Netlify)

If you don't want to use GitHub:
1.  Run `npm install` and `npm run build` on your computer (requires Node.js).
2.  This creates a `dist` folder.
3.  Go to [Netlify Drop](https://app.netlify.com/drop).
4.  Drag the `dist` folder onto the page.
5.  Netlify will give you a live URL instantly.

---

## ✅ Stripe Verification Steps

1.  **Public URL**: Use the URL you got from Vercel/Netlify.
2.  **Business Details**:
    *   Website: Enter your Vercel URL.
    *   Industry: Software / Digital Goods / Membership.
    *   Description: "We provide sports data analysis and performance insights via a credit-based dashboard."
3.  **Compliance Pages**: The app already includes:
    *   `/legal` (Impressum, Terms, Privacy)
    *   Pricing on Landing Page
    *   Contact Info in Footer

## 🛠 Project Structure

*   `src/`: Main source code
    *   `pages/`: Application views (Landing, Dashboard, Admin, Legal)
    *   `components/`: Reusable UI parts
    *   `store.tsx`: State management
*   `index.html`: Entry point
*   `vite.config.ts`: Build configuration

## 🔐 Admin Access

*   **Login**: `/auth`
*   **Admin Email**: `Kenan.akcay@yahoo.com`
*   **Admin Password**: `naqhic-2jyzpy-wuntuQ`

## 💳 Payments

Currently configured for Stripe Test Mode.
Update the `STRIPE_PAYMENT_LINK` in `store.tsx` with your real Stripe Payment Link once your account is verified.