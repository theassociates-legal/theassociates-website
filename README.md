# The Associates — website

Five pages (Home, What We Do, Who We Are, Our Clients, Work With Us) plus Privacy and Disclaimer.
All wording, photos, team members, offices and countries live in the `content/` folder.
The design (colours, fonts, logo) is in `assets/` and never needs touching to change content.

## Going live (one-time, ~30 minutes)

### 1. Put the files on GitHub (free)
1. Sign in or sign up at https://github.com.
2. Top right **+** → **New repository** → name it `theassociates-website` → **Public** → **Create repository**.
3. On the new page click **uploading an existing file**. Unzip `theassociates-website.zip` and drag **everything inside the folder** into the browser. Click **Commit changes**.
4. Check that `.pages.yml` appears in the file list. If it doesn't (Windows sometimes skips files starting with a dot), click **Add file → Create new file**, name it `.pages.yml`, paste the content of that file from the zip, and commit.

### 2. Switch on hosting
1. In the repository: **Settings → Pages**.
2. **Source:** Deploy from a branch → **Branch:** `main`, folder `/ (root)` → **Save**.
3. **Custom domain:** `www.theassociates.me` → **Save**. (It may show a DNS warning until step 3 is done.)

### 3. Point the domain at it (GoDaddy → My Products → theassociates.me → DNS)
Change **only** these records. **Do not touch the MX, TXT (SPF/DKIM/DMARC) or any other email records.**

| Type | Name | Value |
|---|---|---|
| CNAME | www | `YOUR-GITHUB-USERNAME.github.io` |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Delete any other existing **A record for @** and any **domain forwarding** to the old site.
DNS takes from 15 minutes up to a few hours. Then go back to **Settings → Pages** and tick **Enforce HTTPS**.

### 4. Activate the contact form
Send one test message from the **Work With Us** page. FormSubmit emails info@theassociates.me an activation link — click it once. After that, every enquiry arrives in that mailbox.

## Editing the website yourself (no code)
1. Go to https://app.pagescms.org and **Sign in with GitHub**.
2. Allow it access to the `theassociates-website` repository.
3. You'll see forms: **Home page, What We Do, Who We Are & Team, Our Clients, Work With Us, Offices & contact details, Privacy & Disclaimer**.
4. Change any text, add/remove/reorder team members, services, countries or offices, upload photos → **Save**. The live site updates in about a minute.

Tips:
- **Team photos:** open *Who We Are & Team* → the person → *Photo* → upload. Square photos look best. Leave empty to show initials.
- **Client notes from CEOs:** *Our Clients* → *Testimonials* → add one (quote, name, role, company, logo). The section appears on the site once the first one is added. Only publish logos and quotes with the client's written permission.
- **New paragraph:** leave an empty line between paragraphs in the bigger text boxes.
- Every change is saved in GitHub's history, so nothing is ever lost.
