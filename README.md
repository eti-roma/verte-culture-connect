
# 🌱 HydroFourrage Pro - Application de Production Hydroponique Intelligente

![HydroFourrage Pro](https://img.shields.io/badge/Version-2.0-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

Une application complète de gestion de production de fourrage hydroponique avec intelligence artificielle, suivi en temps réel et communauté d'utilisateurs.

## ✨ Fonctionnalités

### 🎯 Fonctionnalités Principales
- **Tableau de bord intelligent** avec graphiques dynamiques interactifs
- **Mode sombre/clair** avec thème automatique selon le système
- **Support multilingue** (60+ langues supportées)
- **Fonctionnement offline/online** avec synchronisation automatique
- **Suivi des erreurs** intégré pour une meilleure maintenance
- **Design fluide** avec animations et transitions

### 🔧 Modules Spécialisés
- **Analyse IA des photos** de cultures avec recommandations
- **Formation interactive** avec quiz et progression
- **Diagnostic automatique** des maladies et parasites
- **Communauté d'utilisateurs** avec partage d'expériences
- **Cartographie des producteurs** avec géolocalisation
- **Suivi des paramètres** (pH, température, humidité, etc.)

### 🌐 Technologies
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Base de données, Authentification, Storage)
- **Charts**: Recharts avec interactivité avancée
- **UI**: Shadcn/ui avec design system cohérent
- **État**: TanStack Query pour la gestion des données
- **Routing**: React Router v6

## 🚀 Installation

### Prérequis
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- Un compte **Supabase** (gratuit)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-nom/hydrofourrage-pro.git
cd hydrofourrage-pro
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configuration Supabase

#### a) Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **URL du projet** et **clé anon**

#### b) Configurer les variables d'environnement
Créez un fichier `.env.local` à la racine du projet :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

#### c) Configurer la base de données
Les migrations SQL sont dans le dossier `supabase/migrations/`. 
Elles sont automatiquement appliquées si vous utilisez Supabase CLI :

```bash
# Installer Supabase CLI
npm install -g @supabase/cli

# Se connecter à votre projet
supabase login
supabase link --project-ref votre-project-ref

# Appliquer les migrations
supabase db push
```

### 4. Lancer l'application

#### Mode développement
```bash
npm run dev
# ou
yarn dev
```

L'application sera disponible sur `http://localhost:5173`

#### Mode production
```bash
# Build
npm run build
# ou
yarn build

# Prévisualiser
npm run preview
# ou
yarn preview
```

## 📱 Configuration Mobile (Optionnelle)

Pour utiliser l'application sur mobile avec Capacitor :

```bash
# Installer Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# Initialiser Capacitor
npx cap init

# Ajouter les plateformes
npx cap add ios
npx cap add android

# Build et sync
npm run build
npx cap sync

# Lancer sur mobile
npx cap run ios
npx cap run android
```

## 🎨 Personnalisation

### Thèmes
Les thèmes sont configurés dans `src/index.css`. Vous pouvez :
- Modifier les couleurs CSS variables
- Ajouter de nouveaux thèmes
- Personnaliser les animations

### Langues
Pour ajouter une nouvelle langue :
1. Ajoutez la langue dans `src/hooks/useLanguage.ts`
2. Créez les traductions dans `src/hooks/useTranslations.ts`
3. Testez avec le sélecteur de langue

### Composants UI
Tous les composants UI sont dans `src/components/ui/` et suivent le design system Shadcn/ui.

## 🔧 Configuration Avancée

### Service Worker (PWA)
Pour activer le mode PWA :
```bash
npm install -D vite-plugin-pwa
```

Puis ajoutez dans `vite.config.ts` :
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // ... autres plugins
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

### Variables d'environnement
Toutes les variables doivent commencer par `VITE_` :

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=production
```

## 🐛 Débogage

### Logs d'erreurs
Les erreurs sont automatiquement trackées et stockées dans `localStorage`. 
Pour les consulter :
```javascript
// Dans la console du navigateur
JSON.parse(localStorage.getItem('app-errors') || '[]')
```

### Mode développement
- Ouvrez les DevTools (F12)
- Onglet Console pour les logs
- Onglet Network pour les requêtes API
- Onglet Application pour le localStorage/indexedDB

### Tests
```bash
# Tests unitaires
npm run test

# Tests e2e (si configurés)
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📦 Déploiement

### Netlify
```bash
# Build
npm run build

# Déployer
npx netlify deploy --prod --dir=dist
```

### Vercel
```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
```

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation**: [docs.hydrofourrage.pro](https://docs.hydrofourrage.pro)
- **Discord**: [Communauté HydroFourrage](https://discord.gg/hydrofourrage)
- **Email**: support@hydrofourrage.pro
- **Issues**: [GitHub Issues](https://github.com/votre-nom/hydrofourrage-pro/issues)

## 🎉 Remerciements

- **Équipe de développement** pour leur travail acharné
- **Communauté open-source** pour les outils fantastiques
- **Utilisateurs beta** pour leurs retours précieux

---

Fait avec ❤️ par l'équipe GREEN PULSE 
