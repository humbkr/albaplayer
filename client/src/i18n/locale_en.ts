/* eslint-disable max-len */

// @ts-ignore
const en: Translation = {
  common: {
    forms: {
      requiredField: 'This field is required.',
    },
    title: 'Title',
    edit: 'Edit',
    create: 'Create',
    cancel: 'Cancel',
    space: 'Space',
    enter: 'Enter',
    press: 'Press',
    search: 'Search',
    clear: 'Clear',
    validate: 'Validate',
    unknown: 'Unknown',
    errors: {
      unknown: 'An unknown error occurred, please try again later.',
    },
  },
  sidebar: {
    navigation: {
      nowPlaying: 'Now Playing',
      libraryBrowser: 'Library Browser',
      playlists: 'Playlists',
      inspiration: 'Inspiration',
      settings: 'Settings',
    },
  },
  player: {
    actions: {
      playNow: 'Play now',
      playAfter: 'Play after current track',
      addToQueue: 'Add to queue',
    },
    noTrackPlaying: 'No song currently playing',
    queue: 'Queue',
    queueHeader: {
      track: 'track',
      artist: 'artist',
    },
    queueActions: {
      playTrack: 'Play track',
      removeTrack: 'Remove track from queue',
    },
  },
  playlists: {
    form: {
      title: 'Title',
    },
    actions: {
      addToPlaylist: 'Add to playlist...',
      createNewPlaylist: '+ Create new playlist',
      createANewPlaylist: 'Create a new playlist',
      duplicatePlaylist: '+ Duplicate playlist',
      editPlaylist: 'Edit playlist',
      deletePlaylist: 'Delete playlist',
      removeFromPlaylist: 'Remove from playlist',
      cancel: 'cancel',
    },
    deleteConfirm: 'Are you sure you wish to delete this playlist?',
    care: {
      fixDeadTracks: 'Fix dead tracks...',
      notFound: 'not found',
      found: 'found',
      experimental: 'Experimental',
      description:
        'fix a playlist that has become desynchronised from the library, for example after having cleaned up the library an rebuilt it. This will try to find your tracks again and update the playlist.',
      start: 'Start',
    },
    title: 'Playlists',
  },
  browser: {
    actions: {
      findAllByArtist: 'Find all by the artist',
      findAllOnAlbum: 'Find all on album',
      pressToAddToPlaylist: 'again to add to the current playlist',
      pressToReplacePlaylist: 'to replace playlist with current selection',
    },
    albums: {
      title: 'Albums',
      sort: {
        title: 'title',
        year: 'year',
        artist: 'artist',
      },
    },
    artists: {
      title: 'Artists',
      sort: {
        name: 'name',
      },
    },
    tracks: {
      title: 'Tracks',
      selectAnArtistOrAlbum: 'Select an artist or album',
      sort: {
        title: 'title',
        artist: 'artist',
        album: 'album',
        number: 'track number',
      },
    },
  },
  dashboard: {
    noAlbumsFound: 'No album found in the library.',
    scanLibrary: 'Scan library',
    randomAlbums: 'Random albums',
    recentlyAdded: 'Recently added',
  },
  library: {
    unknownArtist: 'Unknown artist',
    unknownAlbum: 'Unknown album',
    unknownTitle: 'Unknown title',
    initializing: 'Initializing library...',
    initialisationFailed:
      'Initialization has failed, check your server is accessible.',
  },
  settings: {
    administration: {
      title: 'Administration',
    },
    preferences: {
      title: 'Preferences',
    },
    title: 'Settings',
    library: {
      title: 'Library',
      stats:
        'There are currently {{nbArtists}} artists, {{nbAlbums}} albums, and {{nbTracks}} tracks in the library.',
      updateButton: 'Update library',
      updateInProgress: 'Library is updating. This could take several minutes.',
      clearButton: 'Empty library',
      clearConfirm:
        'Are you sure you wish to empty the library? This cannot be undone.',
    },
    appearance: {
      title: 'Appearance',
      theme: 'Theme',
    },
    about: {
      title: 'About',
      version: 'Version: {{version}}',
    },
  },
  user: {
    login: {
      username: 'Username',
      password: 'Password',
      login: 'Login',
      errors: {
        invalidCredentials: 'Invalid credentials',
      },
    },
    profile: {
      title: 'Profile',
      roles: 'Role(s)',
      username: 'Username',
      changePassword: 'Change password',
      keepPassword: 'Keep password',
      currentPassword: 'Current password',
      newPassword: 'New password',
      submit: 'Update',
      errors: {
        passwordMinLength:
          'Your password must contain at least {{count}} characters',
        currentPassword: 'Invalid current password',
        noWhitespace: 'Your username must not contain any whitespace',
      },
      profileUpdated: 'Profile updated',
    },
    logout: 'Logout',
    usersManagement: {
      title: 'Users',
      newUser: 'New user',
      columns: {
        id: 'ID',
        name: 'Name',
        roles: 'Roles',
        created: 'Created',
      },
      confirmDeleteUser: 'Are you sure you wish to delete this user?',
      userCreated: 'User created',
      userDeleted: 'User deleted',
      userUpdated: 'User updated',
      you: 'you',
      form: {
        editUser: 'Edit user',
        editUserCancel: 'cancel',
        addUser: 'Add new user',
        username: 'Username',
        password: 'Password',
        newPassword: 'New password',
        roles: 'Role(s)',
      },
      errors: {
        passwordMinLength:
          'The password must contain at least {{count}} characters',
      },
    },
    roles: {
      owner: {
        label: 'Owner',
        description: 'Can manage global app settings',
      },
      admin: {
        label: 'Admin',
        description: 'Can manage users and re-scan library',
      },
      listener: {
        label: 'Listener',
        description: 'Can listen to music and change its profile settings',
      },
    },
  },
}

export default en
