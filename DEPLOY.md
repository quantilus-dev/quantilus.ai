# Deploying quantilus.ai — Step by Step

## Your Setup

- **Domain**: `quantilus.ai` on AWS Route 53
- **Infrastructure**: S3, CloudFront, Route 53
- **Site type**: Static HTML/CSS/JS — no build step needed

---

## AWS Deployment (S3 + CloudFront + Route 53)

### Step 1: Create an S3 Bucket

1. Go to **AWS Console → S3 → Create bucket**
2. Bucket name: **`quantilus.ai`** (must match your domain name)
3. Region: **US East (N. Virginia) `us-east-1`** (required for CloudFront + ACM)
4. **Uncheck** "Block all public access" — check the acknowledgment box
5. Leave everything else as default
6. Click **Create bucket**

### Step 2: Enable Static Website Hosting on S3

1. Go to your **`quantilus.ai`** bucket → **Properties** tab
2. Scroll to **Static website hosting** → click **Edit**
3. Select **Enable**
4. Index document: **`index.html`**
5. Error document: **`index.html`** (for SPA-like behavior)
6. Click **Save changes**
7. Note the **Bucket website endpoint** URL (you'll need it later) — it looks like:
   `http://quantilus.ai.s3-website-us-east-1.amazonaws.com`

### Step 3: Set S3 Bucket Policy (Allow Public Read)

1. Go to your bucket → **Permissions** tab → **Bucket policy** → **Edit**
2. Paste this policy (replace the bucket name if different):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::quantilus.ai/*"
    }
  ]
}
```

3. Click **Save changes**

### Step 4: Upload Your Files to S3

**Option A — AWS Console (drag and drop):**

1. Go to your bucket → **Objects** tab → **Upload**
2. Drag the contents of the `quantilus_website/` folder (NOT the folder itself — the files inside it)
3. Make sure you see: `index.html`, `about.html`, `css/`, `js/`, `images/`, etc. at the root
4. Click **Upload**

**Option B — AWS CLI (faster for updates):**

```bash
# Install AWS CLI if needed, then configure
aws configure

# Sync all files to S3
aws s3 sync ./quantilus_website s3://quantilus.ai --delete

# Set correct content types for common files
aws s3 cp s3://quantilus.ai/ s3://quantilus.ai/ --recursive --exclude "*" --include "*.html" --content-type "text/html" --metadata-directive REPLACE
aws s3 cp s3://quantilus.ai/ s3://quantilus.ai/ --recursive --exclude "*" --include "*.css" --content-type "text/css" --metadata-directive REPLACE
aws s3 cp s3://quantilus.ai/ s3://quantilus.ai/ --recursive --exclude "*" --include "*.js" --content-type "application/javascript" --metadata-directive REPLACE
aws s3 cp s3://quantilus.ai/ s3://quantilus.ai/ --recursive --exclude "*" --include "*.xml" --content-type "application/xml" --metadata-directive REPLACE
aws s3 cp s3://quantilus.ai/ s3://quantilus.ai/ --recursive --exclude "*" --include "*.json" --content-type "application/json" --metadata-directive REPLACE
```

### Step 5: Request an SSL Certificate (ACM)

1. Go to **AWS Console → Certificate Manager (ACM)**
2. **IMPORTANT**: Make sure you're in **US East (N. Virginia) `us-east-1`** region (top-right dropdown)
3. Click **Request a certificate** → **Request a public certificate**
4. Domain names:
   - `quantilus.ai`
   - `*.quantilus.ai` (wildcard — covers `www.quantilus.ai` too)
5. Validation method: **DNS validation**
6. Click **Request**
7. On the certificate details page, click **Create records in Route 53**
   - AWS will automatically add the CNAME validation records to your Route 53 hosted zone
8. Wait for status to change to **Issued** (usually 5–15 minutes)

### Step 6: Create a CloudFront Distribution

1. Go to **AWS Console → CloudFront → Create distribution**
2. **Origin settings:**
   - Origin domain: **DO NOT select the S3 bucket from the dropdown**. Instead, paste your S3 website endpoint:
     `quantilus.ai.s3-website-us-east-1.amazonaws.com`
   - Protocol: **HTTP only** (S3 website endpoints don't support HTTPS)
3. **Default cache behavior:**
   - Viewer protocol policy: **Redirect HTTP to HTTPS**
   - Allowed HTTP methods: **GET, HEAD**
   - Cache policy: **CachingOptimized** (or create custom)
   - Compress objects automatically: **Yes**
4. **Settings:**
   - Price class: **Use all edge locations** (or choose based on budget)
   - Alternate domain names (CNAMEs): Add both:
     - `quantilus.ai`
     - `www.quantilus.ai`
   - Custom SSL certificate: Select the **ACM certificate** you created in Step 5
   - Default root object: **`index.html`**
5. Click **Create distribution**
6. Wait for status to change from "Deploying" to **Enabled** (takes 5–15 minutes)
7. Note the **Distribution domain name** (e.g., `d1234abcdef.cloudfront.net`)

### Step 7: Configure Route 53 DNS

1. Go to **AWS Console → Route 53 → Hosted zones → quantilus.ai**
2. Create an **A record** for the root domain:
   - Record name: *(leave empty for root)*
   - Record type: **A**
   - Toggle **Alias**: **Yes**
   - Route traffic to: **Alias to CloudFront distribution**
   - Choose distribution: Select your CloudFront distribution
   - Click **Create records**
3. Create an **A record** for www:
   - Record name: **www**
   - Record type: **A**
   - Toggle **Alias**: **Yes**
   - Route traffic to: **Alias to CloudFront distribution**
   - Choose distribution: Select your CloudFront distribution
   - Click **Create records**

### Step 8: Done!

Your site is now live at **https://quantilus.ai**

---

## Setting Up www → root Redirect (Optional)

To redirect `www.quantilus.ai` → `quantilus.ai`:

1. Create another S3 bucket named **`www.quantilus.ai`**
2. Go to **Properties → Static website hosting → Enable**
3. Select **Redirect requests for an object**
4. Target bucket: `quantilus.ai`
5. Protocol: `https`

Or simply point both `quantilus.ai` and `www.quantilus.ai` to the same CloudFront distribution (already done in Step 7).

---

## Updating the Site

After making changes locally:

**AWS CLI (recommended):**

```bash
# Sync files to S3
aws s3 sync . s3://quantilus.ai --delete

# Invalidate CloudFront cache so changes appear immediately
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

**AWS Console:**

1. Go to S3 bucket → upload new/changed files
2. Go to CloudFront → your distribution → **Invalidations** → **Create invalidation**
3. Enter `/*` to invalidate all cached files
4. Wait ~1 minute for global propagation

---

## Post-Deploy Checklist

- [ ] `https://quantilus.ai` loads correctly
- [ ] `https://www.quantilus.ai` loads (or redirects to root)
- [ ] All 8 pages render and navigation works
- [ ] HTTPS padlock is green (SSL working)
- [ ] Mobile navigation works
- [ ] Contact form shows success message
- [ ] Test with [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Submit sitemap: `https://quantilus.ai/sitemap.xml` to Google Search Console

---

## Cost Estimate

| Service | Monthly Cost |
|---|---|
| **S3** | ~$0.01–0.05 (storage + requests for a small static site) |
| **CloudFront** | Free tier: 1TB transfer + 10M requests/month. After: ~$0.085/GB |
| **Route 53** | $0.50/hosted zone + $0.40/1M queries |
| **ACM (SSL)** | Free |
| **Total** | **~$1–2/month** for a low-traffic static site |

---

## Before Going Live: Replace Formspree ID

In `contact.html`, update the form action with your real Formspree endpoint:

```html
<!-- Replace this: -->
<form action="https://formspree.io/f/your-form-id" ...>

<!-- With your actual Formspree form ID (sign up free at formspree.io): -->
<form action="https://formspree.io/f/xABcdEfG" ...>
```

Formspree free tier allows 50 submissions/month.
