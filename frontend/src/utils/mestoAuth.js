export const BASE_URL = 'http://v-porulitsun.nomoredomains.xyz'


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
      })
   })
   .then(res => checkResponse(res));
};

export const authorize = (email, password) => {
   return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
         "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({
         "email": email,
         "password": password
      }),
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
   })
   .then(res => checkResponse(res));
}