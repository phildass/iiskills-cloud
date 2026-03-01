# nginx — Testing-Period Access Control

This directory contains nginx configuration files for the IISkills testing period
(through **2026-03-05**). All sites require HTTP Basic Authentication; the
`/testing` path on each site is publicly accessible without credentials.

## Deployment

Run on the production server as root:

```bash
sudo bash nginx/setup-testing.sh
```

The script:

1. Installs `apache2-utils` (provides `htpasswd`)
2. Creates `/etc/nginx/auth/iiskills-testing.htpasswd` with user `authorized`
3. Copies `static/testing.html` → `/var/www/iiskills-testing/testing.html`
4. Copies `snippets/iiskills-basic-auth.conf` → `/etc/nginx/snippets/`
5. Copies all configs → `/etc/nginx/sites-available/`
6. Creates symlinks in `/etc/nginx/sites-enabled/`
7. Runs `nginx -t` and `systemctl reload nginx`
8. Prints verification output (HTTP status codes)

## Directory layout

```
nginx/
├── setup-testing.sh                        ← deploy script
├── static/
│   └── testing.html                        ← dim "Testing Period" page
├── snippets/
│   └── iiskills-basic-auth.conf            ← Basic Auth include snippet
└── sites-available/
    ├── iiskills.cloud                       ← main site  (port 3000)
    ├── learn-ai.iiskills.cloud             ← learn-ai   (port 3024)
    ├── learn-apt.iiskills.cloud            ← learn-apt  (port 3002)
    ├── learn-chemistry.iiskills.cloud      ← learn-chemistry (port 3005)
    ├── learn-developer.iiskills.cloud      ← learn-developer (port 3007)
    ├── learn-geography.iiskills.cloud      ← learn-geography (port 3011)
    ├── learn-management.iiskills.cloud     ← learn-management (port 3016)
    ├── learn-math.iiskills.cloud           ← learn-math (port 3017)
    ├── learn-physics.iiskills.cloud        ← learn-physics (port 3020)
    ├── learn-pr.iiskills.cloud             ← learn-pr   (port 3021)
    ├── app.iiskills.cloud                  ← redirect → iiskills.cloud
    ├── app1.learn-ai.iiskills.cloud        ← redirect → learn-ai.iiskills.cloud
    └── app1.learn-developer.iiskills.cloud ← redirect → learn-developer.iiskills.cloud
```

## Site/port mapping

| Config file                         | Backend port | Notes                    |
|-------------------------------------|:------------:|--------------------------|
| `iiskills.cloud`                    | 3000         | main site + www          |
| `learn-ai.iiskills.cloud`           | 3024         |                          |
| `learn-apt.iiskills.cloud`          | 3002         |                          |
| `learn-chemistry.iiskills.cloud`    | 3005         |                          |
| `learn-developer.iiskills.cloud`    | 3007         |                          |
| `learn-geography.iiskills.cloud`    | 3011         |                          |
| `learn-management.iiskills.cloud`   | 3016         |                          |
| `learn-math.iiskills.cloud`         | 3017         |                          |
| `learn-physics.iiskills.cloud`      | 3020         |                          |
| `learn-pr.iiskills.cloud`           | 3021         |                          |
| `app.iiskills.cloud`                | —            | 301 → iiskills.cloud     |
| `app1.learn-ai.iiskills.cloud`      | —            | 301 → learn-ai           |
| `app1.learn-developer.iiskills.cloud` | —          | 301 → learn-developer    |

## TLS certificates

All configs reference:

```
/etc/ssl/iiskills/fullchain.pem
/etc/ssl/iiskills/privkey.pem
```

Ensure the wildcard certificate covering `*.iiskills.cloud` and `iiskills.cloud`
is installed at those paths before running the setup script.

## Access credentials

| Field    | Value            |
|----------|------------------|
| Username | `authorized`     |
| Password | `LizMon2610@4ever` |

> **Note:** The password hash is stored in
> `/etc/nginx/auth/iiskills-testing.htpasswd`. The plain-text password is
> only used during initial setup by `htpasswd`.

## Removing testing-period restrictions

When the testing period ends, replace these configs with the production configs
from `monorepobackup/nginx-configs/` (updated to use the correct SSL cert paths)
and reload nginx.
