# 🗺️ Notate Bourbier

Application mobile pour garder une trace de vos sorties et activités avec vos amis.

---

## Fonctionnalités

### Sorties
- Ajouter, modifier et supprimer des sorties
- Renseigner le **nom**, la **catégorie**, le **lieu**, les **dates et horaires**, les **participants** et le **prix dépensé**
- Calcul automatique de la durée
- Recherche par nom de sortie, ami ou lieu
- Filtre par catégorie

**Catégories disponibles :** 🎬 Ciné · 🍕 Resto · ✈️ Voyage · 🎉 Soirée · ⚽ Sport · 🎵 Concert · 🎨 Culture · ☕ Café · 🛍️ Shopping · 🎮 Gaming

### Amis
- Gérer une liste d'amis avec une couleur personnalisée
- Consulter le **profil de chaque ami** : nombre de sorties ensemble, temps passé ensemble, argent dépensé
- Voir toutes les sorties partagées avec un ami

### Calendrier
- Vue mensuelle avec navigation mois par mois
- Aperçu des sorties jour par jour

### Stats
- Courbes d'évolution des sorties et des dépenses sur 6 mois
- Classement des catégories, lieux et amis les plus fréquents
- Highlights : sortie la plus chère, sortie la plus longue

---

## Stack technique

| Technologie | Usage |
|---|---|
| [React 19](https://react.dev) | Interface utilisateur |
| localStorage | Persistance des données (aucun serveur requis) |
| CSS pur | Styles, design mobile-first |

---

## Lancer le projet

```bash
npm install
npm start
```

L'application s'ouvre sur [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de production
npm test        # tests
```

---

## Structure

```
src/
├── App.js                  # Racine, gestion des vues et du state global
├── constants.js            # Liste des catégories
└── components/
    ├── AddOutingModal.js   # Formulaire ajout / modification de sortie
    ├── OutingCard.js       # Carte d'une sortie
    ├── FriendsPage.js      # Liste des amis
    ├── FriendProfile.js    # Profil d'un ami
    ├── CalendarPage.js     # Vue calendrier
    └── StatsPage.js        # Statistiques et graphiques
```

---

## Données

Tout est stocké dans le `localStorage` du navigateur — pas de compte, pas de serveur, pas de connexion internet requise. Les données restent sur l'appareil.
