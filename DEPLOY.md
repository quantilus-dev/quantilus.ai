# Deploying to Cloudflare Pages — Step by Step

## Prerequisites

- A **Cloudflare account** (free tier works) — sign up at [dash.cloudflare.com](https://dash.cloudflare.com)
- Your domain `quantilus.com` (optional — Cloudflare gives you a free `*.pages.dev` subdomain)

---

## Option A: Direct Upload (Easiest — No Git Required)

This is the fastest way. No GitHub, no CLI, just drag and drop.

### Step 1: Log into Cloudflare Dashboard

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Log in to your account

### Step 2: Navigate to Pages

1. In the left sidebar, click **"Workers & Pages"**
2. Click the **"Pages"** tab
3. Click **"Create application"**
4. Select **"Pages"** tab, then click **"Upload assets"**

### Step 3: Create Your Project

1. Enter a project name: `quantilus` (this gives you `quantilus.pages.dev`)
2. Click **"Create project"**

### Step 4: Upload Your Files

1. Click **"Upload"** or **drag and drop** the entire `quantilus_website` folder
2. Make sure all files are listed (index.html, about.html, css/, js/, etc.)
3. Click **"Deploy site"**

### Step 5: Done!

- Your site is live at `https://quantilus.pages.dev`
- Cloudflare gives you a unique deploy URL for each deployment
- Takes about 30 seconds to propagate globally

---

## Option B: Git Integration (Recommended for Ongoing Updates)

Connect a GitHub/GitLab repo so every push auto-deploys.

### Step 1: Push Code to GitHub

```bash
cd quantilus_website
git init
git add -A
git commit -m "Initial Quantilus website"
git remote add origin https://github.com/YOUR_USERNAME/quantilus-website.git
git branch -M main
git push -u origin main
```

### Step 2: Connect Repo in Cloudflare

1. Go to **Cloudflare Dashboard → Workers & Pages → Pages**
2. Click **"Create application"** → **"Connect to Git"**
3. Select **GitHub** and authorize Cloudflare
4. Choose the `quantilus-website` repository

### Step 3: Configure Build Settings

Since this is a static site with no build step:

| Setting | Value |
|---|---|
| **Production branch** | `main` |
| **Build command** | *(leave empty)* |
| **Build output directory** | `/` |
| **Root directory** | `/` |

5. Click **"Save and Deploy"**

### Step 4: Done!

- Site deploys automatically on every `git push`
- Preview URLs are generated for every branch/PR
- Live at `https://quantilus.pages.dev`

---

## Option C: Wrangler CLI (For Developers)

Deploy from your terminal using Cloudflare's CLI tool.

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Authenticate

```bash
wrangler login
```

This opens a browser window to authorize.

### Step 3: Deploy

```bash
cd quantilus_website
wrangler pages deploy . --project-name=quantilus
```

### Step 4: Done!

- Deploys in seconds
- Returns a live URL immediately
- Run the same command for every update

---

## Connecting Your Custom Domain (`quantilus.com`)

After deploying with any method above:

### Step 1: Add Custom Domain

1. Go to **Workers & Pages → your project → Custom domains**
2. Click **"Set up a custom domain"**
3. Enter `quantilus.com`
4. Click **"Activate domain"**

### Step 2: Update DNS (if domain is already on Cloudflare)

- Cloudflare automatically adds the required CNAME record
- SSL certificate is provisioned automatically (free)
- No configuration needed

### Step 3: Update DNS (if domain is elsewhere)

Add a CNAME record at your domain registrar:

| Type | Name | Target |
|---|---|---|
| CNAME | `@` | `quantilus.pages.dev` |
| CNAME | `www` | `quantilus.pages.dev` |

- SSL is handled automatically by Cloudflare
- Propagation takes up to 24 hours (usually minutes)

### Step 4: Add `www` redirect (optional)

1. In Custom domains, also add `www.quantilus.com`
2. Cloudflare handles the redirect automatically

---

## Post-Deploy Checklist

- [ ] Site loads at your Pages URL (`quantilus.pages.dev`)
- [ ] All pages render correctly (click through every nav link)
- [ ] Mobile navigation works (resize browser or test on phone)
- [ ] Contact form shows success message on submit
- [ ] Custom domain connected and SSL active (green padlock)
- [ ] Test with [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results) for structured data
- [ ] Submit sitemap to Google Search Console (`https://quantilus.com/sitemap.xml`)

---

## Updating the Site

| Method | How to Update |
|---|---|
| **Direct Upload** | Go to Pages → your project → click "Create new deployment" → upload files again |
| **Git Integration** | Just `git push` — auto-deploys in ~30 seconds |
| **Wrangler CLI** | Run `wrangler pages deploy .` again |

---

## Cost

**Free.** Cloudflare Pages free tier includes:

- 500 deploys per month
- Unlimited bandwidth
- Unlimited requests
- Global CDN (300+ edge locations)
- Free SSL
- Free `*.pages.dev` subdomain

No credit card required.

---

## Before Going Live: Replace Formspree ID

In `contact.html`, update the form action with your real Formspree endpoint:

```html
<!-- Replace this: -->
<form action="https://formspree.io/f/your-form-id" ...>

<!-- With your actual Formspree form ID (sign up free at formspree.io): -->
<form action="https://formspree.io/f/xABcdEfG" ...>
```

This enables the contact form to actually send emails. Formspree free tier allows 50 submissions/month.
