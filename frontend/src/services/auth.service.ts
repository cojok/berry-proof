import { createAuth0Client, Auth0Client } from '@auth0/auth0-spa-js';
import { authConfig } from '@/config/auth.config';

let auth0Client: Auth0Client;

export const initAuth0 = async () => {
  auth0Client = await createAuth0Client({
    domain: authConfig.domain,
    clientId: authConfig.clientId,
    authorizationParams: {
      audience: authConfig.audience,
      redirect_uri: authConfig.redirectUri,
      scope: 'openid profile email',
    },
  });

  if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
    try {
      await auth0Client.handleRedirectCallback();
    } catch (err) {
      console.error('[Auth0] Redirect handling failed:', err);
    } finally {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.location.replace(cleanUrl);
      window.history.replaceState({}, window.document.title, cleanUrl);
    }
  }

  return auth0Client;
};

export const getAuth0Client = () => {
  if (!auth0Client) throw new Error('Auth0 client not initialized!');
  return auth0Client;
};

