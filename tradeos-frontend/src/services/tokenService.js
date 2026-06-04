const TOKEN_KEY =
  "tradeos_token";

const ROLE_KEY =
  "tradeos_role";

const USER_KEY =
  "tradeos_user";

/* Token */
export const getToken =
  () => {

    return localStorage.getItem(
      TOKEN_KEY
    );
  };

export const setToken =
  (token) => {

    localStorage.setItem(
      TOKEN_KEY,
      token
    );
  };

export const removeToken =
  () => {

    localStorage.removeItem(
      TOKEN_KEY
    );
  };

/* Role */
export const getRole =
  () => {

    return localStorage.getItem(
      ROLE_KEY
    );
  };

export const setRole =
  (role) => {

    localStorage.setItem(
      ROLE_KEY,
      role
    );
  };

export const removeRole =
  () => {

    localStorage.removeItem(
      ROLE_KEY
    );
  };

/* User */
export const getUser =
  () => {

    const user =
      localStorage.getItem(
        USER_KEY
      );

    return user
      ? JSON.parse(user)
      : null;
  };

export const setUser =
  (user) => {

    localStorage.setItem(

      USER_KEY,

      JSON.stringify(user)
    );
  };

export const removeUser =
  () => {

    localStorage.removeItem(
      USER_KEY
    );
  };

/* Avatar */
const AVATAR_KEY =
  "tradeos_avatar";

export const getAvatar =
  () => {

    return localStorage.getItem(
      AVATAR_KEY
    );
  };

export const setAvatar =
  (dataUrl) => {

    localStorage.setItem(
      AVATAR_KEY,
      dataUrl
    );
  };

export const removeAvatar =
  () => {

    localStorage.removeItem(
      AVATAR_KEY
    );
  };

/* Clear Auth */
export const clearAuth =
  () => {

    removeToken();

    removeRole();

    removeUser();

    removeAvatar();
  };