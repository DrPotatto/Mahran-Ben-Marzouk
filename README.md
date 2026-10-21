# 7DCONSTRUCTION — Site 3D · Entreprise BTP (Tebourba, Tunisie)

Site vitrine premium pour **Entreprise BTP 7DCONSTRUCTION** (propriétaire : Mahran Ben Marzouk) :
héros cinématographique en Three.js, showroom 3D interactif, portfolio honnête, estimateur préliminaire
en TND, contact multi-canal, et interface en **français (défaut), arabe (RTL) et anglais**.

Stack : Next.js (App Router) · React · Tailwind CSS 3 · Three.js · React Three Fiber · Drei · Framer Motion · Lucide.
Aucun service payant, aucune clé d'API obligatoire, aucun asset distant requis.

---

## 1. Installation sous Windows

Prérequis : **Node.js 18.18 ou plus récent** (LTS 20/22 recommandé) — https://nodejs.org

### Méthode automatique (recommandée)

1. Placez `install.js` sur le Bureau.
2. Ouvrez **CMD** ou **PowerShell** dans le dossier du Bureau, puis :

```
node install.js
```

Le script crée le dossier `7dconstruction` sur votre Bureau (le Bureau redirigé vers OneDrive est
détecté automatiquement), génère tous les fichiers, installe les dépendances avec `npm`, lance les tests
logiques et propose de démarrer le site.

Options :

| Option | Effet |
| --- | --- |
| `node install.js "D:\Sites"` | Destination personnalisée (un sous-dossier `7dconstruction` est créé si le dossier n'est pas vide) |
| `--yes` | Mode non interactif : ne remplace **jamais** un fichier existant |
| `--overwrite` | Remplace les fichiers modifiés, après sauvegarde dans `.installer-backup/` |
| `--no-install` | Génère les fichiers sans lancer `npm install` |
| `--build` | Lance aussi `npm run build` pour vérifier la compilation de production |
| `--start` | Démarre le serveur de développement à la fin |

Si `npm install` échoue (réseau, proxy…), **les fichiers générés sont conservés**. Reprenez simplement :

```
cd "%USERPROFILE%\Desktop\7dconstruction"
npm install
```

### Méthode manuelle

```
cd 7dconstruction
npm install
npm run dev
```

---

## 2. Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement — http://localhost:3000 |
| `npm run build` | Build de production |
| `npm start` | Sert le build de production (après `npm run build`) |
| `npm test` | Tests logiques (estimateur, validation, contact), parité FR/AR/EN, imports, données 3D |

---

## 3. Configurer les coordonnées (important)

Aucune coordonnée n'est inventée : tant que rien n'est configuré, le site l'indique clairement.

1. Copiez `.env.example` vers **`.env.local`**.
2. Renseignez uniquement les valeurs **vérifiées** :

```
NEXT_PUBLIC_WHATSAPP_NUMBER=216XXXXXXXX     # chiffres uniquement ; 8 chiffres => préfixe 216 ajouté
NEXT_PUBLIC_CONTACT_EMAIL=contact@exemple.tn
NEXT_PUBLIC_CONTACT_PHONE=+216 XX XXX XXX
```

3. Redémarrez `npm run dev`.

Les boutons **WhatsApp** et **E-mail** n'apparaissent que si le canal est configuré. Le message généré contient les
choix du visiteur et l'estimation. Le site ne prétend jamais qu'un message a été envoyé s'il ne l'a pas été.

Vous pouvez aussi renseigner ces valeurs directement dans `data/site.js`.

### Stockage persistant des demandes (Supabase, optionnel)

Sans Supabase, le formulaire indique « envoi en ligne non activé » et propose WhatsApp / e-mail / copie du message.
Pour enregistrer les demandes :

1. Créez un projet Supabase gratuit, puis exécutez dans l'éditeur SQL :

```sql
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (char_length(phone) between 6 and 40),
  email text,
  preferred_contact text not null check (preferred_contact in ('whatsapp','phone','email')),
  message text check (char_length(message) <= 6000),
  estimate jsonb,
  lang text
);

alter table public.inquiries enable row level security;

-- Le public peut UNIQUEMENT insérer. Personne ne peut lire/modifier/supprimer avec la clé publique.
create policy "public can insert inquiries"
  on public.inquiries for insert to anon with check (true);
```

2. Dans `.env.local`, renseignez **l'URL du projet** et la clé **anon** (publique) :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

3. Consultez les demandes dans le tableau de bord Supabase (Table Editor).

**Sécurité :** n'utilisez jamais la clé `service_role` dans une variable `NEXT_PUBLIC_*`. Le code refuse
explicitement une clé dont le rôle JWT est `service_role`. Pour limiter le spam, ajoutez une limitation de débit
côté Supabase ou un CAPTCHA avant une mise en production à fort trafic.

---

## 4. Estimateur : tarifs à valider par le propriétaire

`components/estimator/estimatorConfig.js` contient des **taux de démonstration** (ce ne sont pas les prix de
7DCONSTRUCTION). Choisissez le mode avec `NEXT_PUBLIC_ESTIMATOR_MODE` :

* `demo` (défaut) — montants affichés avec un bandeau « taux de démonstration » ;
* `verified` — après avoir remplacé **tous** les taux par des tarifs approuvés ;
* `disabled` — aucun montant n'est affiché (résumé du périmètre + contact seulement).

Formule : `surface × taux de base × multiplicateur d'étages` + `surface × taux du lot × coefficient du type de projet × multiplicateur d'étages`
pour chaque lot coché + coûts annexes cochés + imprévus ; fourchette indicative autour du total. L'outil est une aide à la
planification, ni un devis ni un calcul d'ingénierie certifié.

---

## 5. Ajouter de vraies réalisations

1. Placez les photos dans `public/images/projects/<id-projet>/` (voir `public/images/projects/README.txt`).
2. Ajoutez un objet dans `data/projects.js` (modèle commenté en tête du fichier). Aucun composant à modifier.
3. Supprimez les 5 projets « concept » quand vous n'en avez plus besoin.

Les comparaisons avant/après n'apparaissent que si les deux vraies photos sont déclarées.

Les services (`data/services.js`) et les étapes de méthode sont marqués « À confirmer » jusqu'à validation :
mettez `verified: true` ou `showVerificationBadges: false` dans `data/site.js` une fois confirmés.

---

## 6. Structure

```
app/                 layout, page, loading, error, not-found, globals.css
components/
  layout/            Navbar, Footer, LanguageSwitcher, SkipLink
  sections/          Hero, About, Showroom, Services, Portfolio (+ProjectDetail), Process, Quality, Estimator, Contact
  three/             HeroScene, ThreeViewer, ArchitecturalScene, models.js (villa, immeuble, ossature, commercial),
                     materials.js, ModelParts, CameraController, ViewerControls, MaterialSelector, WebGLFallback…
  estimator/         QuoteEstimator, QuoteSummary, estimatorConfig.js, estimatorUtils.js
  forms/             ContactForm, Field
  ui/                Button, Reveal, SectionHeading, ProjectCard, ErrorBoundary, LoadingIndicator…
data/                site.js, projects.js, services.js, navigation.js
lib/                 contact.js, supabase.js, validation.js, formatters.js, content.js, hooks.js, webgl.js
locales/             fr.js, ar.js, en.js (+ index.js)
scripts/             tests (npm test)
```

Traductions : toutes les chaînes sont dans `locales/*.js`. `npm test` vérifie que les trois fichiers ont exactement les
mêmes clés.

---

## 7. Notes 3D et performances

* Modèles procéduraux, géométries unitaires partagées, un jeu de matériaux partagé, une seule ombre directionnelle.
* Environnement de réflexion procédural (Lightformers) : aucun fichier HDR téléchargé.
* Rendu à la demande dans le showroom (aucune boucle permanente) ; le héros ne tourne que lorsqu'il est visible.
* Résolution de pixels bornée ; mode « qualité réduite » automatique sur mobiles / appareils modestes (activable à la main).
* Sur écran tactile et à la souris, le viewer ne capture pas le défilement tant qu'on ne l'a pas activé (clic / toucher / Entrée) ; Échap ou clic à l'extérieur le désactive.
* Sans WebGL ou en cas d'erreur, un schéma illustré remplace la 3D et le reste du site fonctionne.
* Les modèles sont des **concepts illustratifs** ; la vue éclatée n'est pas un modèle d'ingénierie certifié.
* Polices : piles système locales (aucune dépendance à Google Fonts). Pour une police auto-hébergée, ajoutez-la avec `next/font/local`.

Pas d'occlusion ambiante en post-traitement (volontairement, pour éviter une dépendance et un coût GPU) : l'ancrage visuel
vient des ombres douces et de l'éclairage.
