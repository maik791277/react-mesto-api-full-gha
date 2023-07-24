const BASE_URL = process.env.REACT_APP_API_URL;


function checkResponse(res) {
   return res.ok ? res.json() : Promise.reject(`Ошибка ${res.status}`)
}

export const register = (email, password) => {
   return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
         "password": password,
         "email": email
      }),
      credentials: 'include',
   })
   .then(res => checkResponse(res));
};

export const authorize = (email, password) => {
   return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
         "email": email,
         "password": password
      }),
      credentials: 'include',
   })
   .then(res => checkResponse(res));
};

export const usersMe = (jwtUser) => {
   return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
         "Content-Type": "application/json",
         "Authorization" : `Bearer ${jwtUser}`
      },
      credentials: 'include',
   })
   .then(res => checkResponse(res));
}

export const logout = () => {
   return fetch(`${BASE_URL}/signout`, {
      method: 'GET',
      headers: {
         "Content-Type": "application/json",
      },
      credentials: 'include',
   })
   .then(res => checkResponse(res));
}
