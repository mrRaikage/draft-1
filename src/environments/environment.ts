// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://bothworldsapim.azure-api.net/napi/',
  avatar: 'https://eu.ui-avatars.com/api/?name=John+Doe',
  refreshTokenEndpoint: 'https://securetoken.googleapis.com/v1/token',
  appInsights: {
    instrumentationKey: '00000000-0000-0000-0000-000000000000'
  },
  firebase: {
    apiKey: 'AIzaSyA7sqUJDc8BkugZ6c4isb1VDbYjNcuNHpg',
    authDomain: 'norder-ecd1a.firebaseapp.com',
    projectId: 'norder-ecd1a',
    storageBucket: 'norder-ecd1a.appspot.com',
    messagingSenderId: '329096662889',
    appId: '1:329096662889:web:78a098d7c9d4f6770bf7f8',
    measurementId: 'G-RLS0DS5XNW'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
