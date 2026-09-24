# Supabase setup

1. Create a Supabase project.
2. In the Supabase SQL Editor, run `supabase-schema.sql`.
3. In Supabase Dashboard, open **Authentication → Providers → Anonymous** and enable anonymous sign-ins.
4. In Supabase Authentication, create the owner user with email and password.
5. Copy the owner user's UUID and run:

```sql
insert into public.admin_users (user_id)
values ('OWNER_USER_UUID');
```

6. Copy the project URL and anon key into `supabase-config.js`:

```js
window.SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

7. Serve the folder through a web server. Supabase authentication and database requests should not be tested by opening the HTML file directly with `file://`.

The app uses anonymous Supabase sessions for customers, so each customer can only read their own orders and bulk requests. The owner console uses the email/password account listed in `admin_users`.

The app keeps local storage as an offline fallback until both Supabase values are configured. Once configured, orders, bulk requests, artwork, shop settings, and realtime owner updates use Supabase.

## PHPMailer notifications

GitHub Pages cannot execute PHP. Deploy the `mailer` folder to a PHP host, then run:

```bash
cd mailer
composer install --no-dev
```

Set these server environment variables on that PHP host:

```text
SUPABASE_WEBHOOK_SECRET=use-a-long-random-secret
OWNER_EMAIL=owner@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-smtp-user
SMTP_PASSWORD=your-smtp-password
MAIL_FROM=orders@example.com
MAIL_FROM_NAME=PinMirror Studio
```

In Supabase, create a **Database Webhook** for `public.orders` on `INSERT` and `UPDATE`, targeting the HTTPS URL of `mailer/notify.php`. Add the custom header `x-webhook-secret` with the same value as `SUPABASE_WEBHOOK_SECRET`.

New orders email the owner. Order changes email the customer using the email saved in the order. Keep SMTP credentials only on the PHP server, never in the frontend or GitHub repository.
