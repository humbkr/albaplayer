/* eslint-disable max-len */

// @ts-ignore
const fr: Translation = {
  common: {
    forms: {
      requiredField: 'Ce champ est obligatoire.',
    },
    title: 'Titre',
    edit: 'Modifier',
    create: 'Créer',
    cancel: 'Annuler',
    space: 'Espace',
    enter: 'Entrer',
    press: 'Presser',
    search: 'Rechercher',
    clear: 'Réinitialiser',
    validate: 'Valider',
    unknown: 'Inconnu',
    errors: {
      unknown:
        "Une erreur inconnue s'est produite. Veuillez réesayer ultérieurement.",
    },
  },
  sidebar: {
    navigation: {
      nowPlaying: 'Liste de lecture',
      libraryBrowser: 'Librairie',
      playlists: 'Playlists',
      inspiration: 'Inspiration',
      settings: 'Réglages',
    },
  },
  player: {
    actions: {
      playNow: 'Jouer maintenant',
      playAfter: 'Jouer après',
      addToQueue: 'Jouer en dernier',
    },
    noTrackPlaying: 'Pas de titre en train de jouer.',
    queue: 'Liste de lecture',
    queueHeader: {
      track: 'chanson',
      artist: 'artiste',
    },
    queueActions: {
      playTrack: 'Jouer la chanson',
      removeTrack: 'Supprimer la chanson de la liste',
    },
  },
  playlists: {
    form: {
      title: 'Titre',
    },
    actions: {
      addToPlaylist: 'Ajouter à la playlist...',
      createNewPlaylist: '+ Créer une nouvelle playlist',
      createANewPlaylist: 'Créer une nouvelle playlist',
      duplicatePlaylist: '+ Dupliquer la playlist',
      editPlaylist: 'Modifier la playlist',
      deletePlaylist: 'Supprimer la playlist',
      removeFromPlaylist: 'Supprimer de la playlist',
      cancel: 'annuler',
    },
    defaultPlaylistName: 'Nouvelle playlist',
    deleteConfirm: 'Etes-vous sûr(e) de vouloir supprimer cette playlist ?',
    care: {
      fixDeadTracks: 'Corriger les chansons manquantes...',
      notFound: 'non trouvé',
      found: 'trouvé',
      experimental: 'Expérimental',
      description:
        "Corriger une playlist qui s'est désynchronisée de la librairie, par exemple suite à une suppression et re-scan de celle-ci. Cette fonctionnalité va tenter de retrouver les chansons et de mettre à jour la playlist.",
      start: 'Commencer',
    },
    title: 'Playlists',
  },
  browser: {
    actions: {
      findAllByArtist: 'Trouver tout par cet artiste',
      findAllOnAlbum: 'Trouver toutes les chansons de cet album',
      pressToAddToPlaylist:
        'une fois de plus pour ajouter à la liste de lecture courante',
      pressToReplacePlaylist:
        'pour remplacer la liste de lecture courante par la sélection',
    },
    albums: {
      title: 'Albums',
      sort: {
        title: 'titre',
        year: 'année',
        artist: 'artiste',
      },
    },
    artists: {
      title: 'Artistes',
      sort: {
        name: 'nom',
      },
    },
    tracks: {
      title: 'Chansons',
      selectAnArtistOrAlbum: 'Sélectionner un artiste ou album',
      sort: {
        title: 'titre',
        artist: 'artiste',
        album: 'album',
        number: 'numéro de chanson',
      },
    },
  },
  dashboard: {
    noAlbumsFound: 'Aucun album trouvé dans la librairie.',
    scanLibrary: 'Scanner la librairie',
    randomAlbums: 'Albums random',
    recentlyAdded: 'Ajouté récemment',
  },
  library: {
    unknownArtist: 'Artiste inconnu',
    unknownAlbum: 'Album inconnu',
    unknownTitle: 'Chanson inconnue',
    initializing: 'Initialisation de la librairie...',
    initialisationFailed:
      "L'initialisation a échouée, veuillez vérifier que votre serveur est accessible.",
  },
  settings: {
    administration: {
      title: 'Administration',
    },
    preferences: {
      title: 'Préférences',
    },
    title: 'Réglages',
    library: {
      title: 'Librairie',
      stats:
        'Il y a actuellement {{nbArtists}} artistes, {{nbAlbums}} albums, et {{nbTracks}} chansons dans la librairie.',
      updateButton: 'Scanner la librairie',
      updateInProgress:
        'La librairie est en train de se mettre à jour. Cela peut prendre quelques minutes.',
      clearButton: 'Vider la librairie',
      clearConfirm:
        'Etes-vous sûr(e) de vouloir vider la librairie ? Cette action ne peut pas être annulée.',
    },
    appearance: {
      title: 'Apparence',
      theme: 'Thème',
    },
    libraryBrowser: {
      title: 'Librairie',
      clickBehavior: {
        label: "Lors d'un double-click sur un item:",
        play: "Remplacer la liste de lecture courante et jouer l'item",
        add: "Ajouter l'item à la liste de lecture courante",
        none: 'Ne rien faire',
      },
    },
    about: {
      title: 'A propos',
      version: 'Version: {{version}}',
    },
  },
  user: {
    login: {
      username: "Nom d'utilisateur",
      password: 'Mot de passe',
      title: 'Connexion',
      login: 'Se connecter',
      errors: {
        invalidCredentials: 'Information invalide',
      },
    },
    createRoot: {
      username: "Nom d'utilisateur",
      password: 'Mot de passe',
      confirmPassword: 'Confirmer mot de passe',
      title: 'Créer un utilisateur principal',
      description:
        "Ceci est votre première ustilisation de l'application. Veuiller créer un utilisateur admin.",
      description_noauth:
        "Cet utilisateur sera utilisé en cas d'activation ultérieure de la fonctionnalité d'authentification.",
      create: "Créer l'utilisateur",
      errors: {
        generic: 'Une erreur est survenue',
        passwordConfirm: 'Les mots de passe ne correspondent pas',
      },
    },
    profile: {
      title: 'Profil',
      roles: 'Rôle(s)',
      username: "Nom d'utilisateur",
      changePassword: 'Changez le mot de passe',
      keepPassword: 'Garder le mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      submit: 'Mettre à jour',
      errors: {
        passwordMinLength:
          'Le mot de passe doit contenir au moins {{count}} caractères',
        currentPassword: 'Mot de passe actuel invalide',
        noWhitespace: "Le nom d'utilisateur ne doit pas contenir d'espace",
      },
      profileUpdated: 'Profil mis à jour',
    },
    logout: {
      label: 'Déconnexion',
      errors: {
        generic: 'Une erreur est survenue',
      },
    },
    usersManagement: {
      title: 'Utilisateurs',
      newUser: 'Nouvel utilisateur',
      columns: {
        id: 'ID',
        name: 'Nom',
        roles: 'Rôles',
        created: 'Créé',
      },
      confirmDeleteUser: 'Etes-vous sûr de vouloir supprimer cet utilisateur ?',
      userCreated: 'Utilisateur créé',
      userDeleted: 'Utilisateur supprimé',
      userUpdated: 'Utilisateur mis à jour',
      you: 'vous',
      form: {
        editUser: "Modifier l'utilisateur",
        editUserCancel: 'annuler',
        addUser: 'Ajouter un nouvel utilisateur',
        username: "Nom d'utilisateur",
        password: 'Mot de passe',
        newPassword: 'Nouveau mot de passe',
        roles: 'Rôle(s)',
      },
      errors: {
        passwordMinLength:
          'Le mot de passe doit contenir au moins {{count}} caractères',
      },
    },
    roles: {
      owner: {
        label: 'Propriétaire',
        description: "A le controle total sur l'application",
      },
      admin: {
        label: 'Admin',
        description: 'Peut gérer les utilisateurs et rescanner la librairie',
      },
      listener: {
        label: 'Auditeur',
        description: "Peut utiliser l'application et modifier son profil",
      },
    },
  },
}

export default fr
