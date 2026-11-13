# LINK-SMART Website

Official website and customer platform for LINK-SMART business systems. The app includes marketing pages, five tenant solution pages, a bilingual pricing and purchase flow, a customer portal, a training center with 59 lessons, and a complete admin console.

## Stack

- React 18 + Vite
- Tailwind CSS 3
- React Router 6
- Firebase Auth, Firestore, Storage, and Analytics (modular SDK)
- framer-motion and lucide-react
- Netlify or Firebase Hosting for deployment

## Local development

```bash
npm install
copy .env.example .env
npm run dev
```

The checked-in `.env.example` is preconfigured for the LINK-SMART Firebase project. Copy it to `.env` before starting. Until valid configuration is present the app shows a setup screen.

## Environment variables

Browser build (`VITE_*`):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_ADMIN_EMAILS` (informational; admin access is controlled by the Firestore `role` field)

Server-side only (never exposed to the browser):

- `FIREBASE_PROJECT_ID`
- `GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT_JSON`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`
- `PROVISIONING_WEBHOOK_URL`, `PROVISIONING_WEBHOOK_SECRET`

## Seeding Firestore

```bash
npm run seed
npm run seed -- --set-admin admin@yourcompany.com
npm run seed -- --service-account C:\path\to\service-account.json --project your-project-id
npm run seed -- --no-seed --set-admin admin@yourcompany.com
npm run seed -- --dry-run
```

The script uses the Firebase Admin SDK and writes default website content, the five tenant products, 20 pricing plans, FAQs, testimonials, five training courses, and all 59 lessons. Existing documents are merged, so rerunning is safe.

You can also seed from the admin console (Settings > Seed data) or grant admin access from the Firestore console:

```
users/{uid}.role = "admin"
```

## Admin access

A new registration always receives `role: "customer"`. Admin access cannot be granted from the client app.

### Primary website super admin

The global website super admin is **ishanews7@gmail.com**. It is identified by the Firebase custom claim `superAdmin: true` and `role: "superadmin"`, not by a hardcoded email check in the React app.

Provision or update the account with the Admin SDK:

```bash
npm run super-admin -- create
npm run super-admin -- grant
npm run super-admin -- verify
```

`create` creates the Firebase Authentication account if it does not exist, sets the custom claims, creates the `users/{uid}` profile with `role: "superadmin"`, and revokes old sessions. If no password is provided, the script prompts for one without echoing it; in a non-interactive terminal it generates a random password and prints a single-use password reset link instead.

Never place the password in React code, Firestore, `VITE_*` variables, or committed files. An optional temporary `SUPER_ADMIN_PASSWORD` environment variable is supported for automation, but the hidden prompt is preferred.

After provisioning, the account signs in at `/login` and is redirected straight to `/admin`. Super admin access is enforced in Firestore and Storage rules through the custom claim, so it does not depend on tenant selection or approval.

### Other administrators

The super admin can grant or revoke website admin access from **Users & admins** (`/admin/users`). Those accounts receive `role: "admin"` in Firestore and can use the admin console, but they do not receive the super admin custom claim.

These website administrators are separate from business tenant administrators inside the LINK-SMART application. Customer accounts never receive website admin or super admin permissions automatically.

Deploy the rules after provisioning:

```bash
npx firebase-tools deploy --only firestore:rules,storage
```

Existing sessions need to sign in again to receive updated custom claims.

## Data model

- `users`, `customers`: profiles and customer directory
- `websiteContent/home`, `websiteSettings/main`: editable marketing content and settings
- `tenantProducts`: the five business systems
- `pricingPlans`: 20 plans (four per tenant)
- `purchases`, `payments`: checkout records, approved or rejected by an admin
- `subscriptions`, `invoices`: activated access and billing documents
- `trainingCourses`, `trainingLessons`, `trainingProgress`: 59 lessons with per-user completion
- `posts`: published news articles shown on `/news`
- `media`: uploaded website images, videos, audio and documents
- `announcements`: broadcast history for customer and admin notifications
- `supportTickets`, `notifications`, `mail`, `tenantProvisioning`: support, messaging, and activation tasks

Queries use at most one `where` equality and sort client-side, so no composite indexes are required.

## Purchase and activation flow

1. A signed-in customer completes the purchase wizard.
2. `purchases` and `payments` are created as `pending`; an optional payment proof is uploaded to Storage.
3. An admin approves the purchase in Admin > Payments.
4. Approval verifies the payment, creates or extends the subscription, issues an invoice, queues a notification and email, and writes a `tenantProvisioning` task.
5. Training access unlocks while the tenant subscription is active.

## Security rules

Deploy the included rules:

```bash
npx firebase-tools deploy --only firestore:rules,storage
```

- Marketing content and published posts are publicly readable and admin-writable.
- The media library is publicly readable and admin-writable; uploads are capped at 100 MB.
- Customers can read only their own purchases, payments, subscriptions, invoices, notifications, progress, and tickets.
- Payment proof uploads are limited to the owner, 5 MB, and image or PDF content types.
- Support tickets may be created by visitors but are readable only by the owner or an admin.

## Cloud Functions

`functions/index.js` provides:

- `sendMail`: sends queued documents from the `mail` collection through SMTP and records the delivery status.
- `prepareTenant`: marks `tenantProvisioning` tasks ready, or forwards them to an optional webhook.

Install and deploy:

```bash
cd functions
npm install
firebase deploy --only functions
```

Set SMTP and webhook values with Firebase environment configuration or Secret Manager before relying on them. Without SMTP, queued mail is marked `skipped` rather than lost.

## Build and deploy

```bash
npm run build
npm run preview
```

Netlify settings are already in `netlify.toml` (build `npm run build`, publish `dist`, SPA redirect). For Firebase Hosting run `firebase deploy --only hosting`.

## Internationalization

English and Somali dictionaries live in `src/i18n/en.js` and `src/i18n/so.js`. Both contain 920 matching keys. Firestore content uses `{ en, so }` fields, resolved through `bl(field)`; interface strings use `t(key)`.

## Project structure

```
src/
  components/   UI, layout, and shared components
  contexts/     auth, toast, and content providers
  data/seed/    default content, plans, courses, and lessons
  i18n/         English and Somali dictionaries
  lib/          Firebase data access, admin actions, helpers
  pages/        public, auth, purchase, portal, training, admin
functions/      mail sender and tenant provisioning triggers
scripts/        Admin SDK seed and admin grants
```
