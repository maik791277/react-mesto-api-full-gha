class Api {
   constructor({baseUrl, headers}) {
      this.baseUrl = baseUrl;
      this.headers = headers;
   }

   _checkResponse(res) {
      if (res.ok) {
         return res.json();
      }
      return Promise.reject(`Ошибка ${res.status}`);
   }

   getInitialCards() {
      return fetch(`${this.baseUrl}/cards`, {
         method: "GET",
         headers: this.headers,
         credentials: 'include',
      }).then(this._checkResponse)
   }

   getUserInformation() {
      return fetch(`${this.baseUrl}/users/me`, {
         method: "GET",
         headers: this.headers,
         credentials: 'include',
      }).then(this._checkResponse)
   }

   createUserInformation(data) {
      return fetch(`${this.baseUrl}/users/me`, {
         method: "PATCH",
         headers: this.headers,
         body: JSON.stringify(data),
         credentials: 'include',
      }).then(this._checkResponse)
   }

   putCardLike(id, isLiked) {
      let methodSending = "";
      if (isLiked) {
         methodSending = "PUT"
      }else {
         methodSending = "DELETE"
      }
      return fetch(`${this.baseUrl}/cards/${id}/likes`, {
         method: methodSending,
         headers: this.headers,
         credentials: 'include',
      }).then(this._checkResponse)
   }

   deleteCardLike(id) {
      return fetch(`${this.baseUrl}/cards/${id}/likes`, {
         method: "DELETE",
         headers: this.headers,
         credentials: 'include',
      }).then(this._checkResponse)
   }

   createUserImage(data) {
      return fetch(`${this.baseUrl}/users/me/avatar`, {
         method: "PATCH",
         headers: this.headers,
         body: JSON.stringify(data),
         credentials: 'include',
      }).then(this._checkResponse)
   }

   createCard(data) {
      return fetch(`${this.baseUrl}/cards`, {
         method: "POST",
         headers: this.headers,
         body: JSON.stringify(data),
         credentials: 'include',
      }).then(this._checkResponse)
   }

   deleteCard(id) {
      return fetch(`${this.baseUrl}/cards/${id}`, {
         method: "DELETE",
         headers: this.headers,
         credentials: 'include',
      }).then(this._checkResponse)
   }
}

/**
 * renderLoading показывает пользователю
 * что идёт процесс запроса
 */
export const api = new Api({
   baseUrl: 'https://api-v-porulitsun.nomoredo.nomoredomains.xyz',
   headers: {
      "Content-Type": "application/json"
   }
})

