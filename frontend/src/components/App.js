import Main from "./Main";
import somethingIsWrong from "../images/something-wrong.png"
import something from "../images/Union (1).png";
import React, {useState, useEffect} from "react";
import {Routes, Route, Navigate, useNavigate, useLocation} from "react-router-dom";
import {api} from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import Login from "./pages/Login";
import {ProtectedRoute} from "./ProtectedRoute";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import * as mestoAuth from "../utils/mestoAuth";
import Header from "./Header";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeletePlacePopup from "./DeletePlacePopup";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";


function App() {
   const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
   const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
   const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
   const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
   const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = useState(false);
   const [isInfoTooltip, setIsInfoTooltip] = useState(false)
   const [popupRegister, setPopupRegister] = useState({
      textPopup: '',
      imagePopup: ''
   })
   const [loggedIn, setLoggedIn] = useState(false);
   const [currentIdCard, setCurrentIdCard] = useState("");
   const [selectedCard, setSelectedCard] = useState({});
   const [currentUser, setCurrentUser] = useState([]);
   const [currentCard, setCurrentCard] = useState([]);
   const [userData, setUserData] = useState([]);
   const navigate = useNavigate()
   let location = useLocation();

   useEffect(() => {
      api.getUserInformation()
      .then((data) => {
         setCurrentUser(data);
      })
      .catch((err) => alert(err));
   }, []);

   useEffect(() => {
      if (loggedIn) {
         if (location.pathname === '/sign-up' || location.pathname === '/sign-in') {
            navigate('/main')
         }
      }
   }, [location.pathname, loggedIn, navigate])

   function authorize(email, password) {
      mestoAuth.authorize(email, password)
      .then((data) => {
            handleLogin();
            tokenCheck()
      })
      .catch((err) => {
         if (err === 'Ошибка 401') {
            setPopupRegister({
               textPopup: `${err} Что-то пошло не так! пользователь с email не найден или неправильный пароль.`,
               imagePopup: somethingIsWrong
            })
            setIsInfoTooltip(true)
         }
         if (err === 'Ошибка 400') {
            setPopupRegister({
               textPopup: `${err} Что-то пошло не так! Поля не заполнены.`,
               imagePopup: somethingIsWrong
            })
            setIsInfoTooltip(true)
         }
      });
   }

   function register(email, password) {
      mestoAuth.register(email, password)
      .then(() => {
         setPopupRegister({
            textPopup: `Вы успешно зарегистрировались!`,
            imagePopup: something
         })
         setIsInfoTooltip(true)
         setTimeout(navigate, 3000, '/sign-in')
      })
      .catch((err) => {
         setPopupRegister({
            textPopup: `${err} Что-то пошло не так! Возможно у вас уже есть аккаунт. Попробуйте ещё раз.`,
            imagePopup: somethingIsWrong
         })
         setIsInfoTooltip(true)
      });
   }

  function getCardsMain() {
      api.getInitialCards()
      .then((data) => {
         setCurrentCard(data);
      })
      .catch((err) => alert(err)) 
  }

  function tokenCheck() {
      mestoAuth.usersMe()
      .then((user) => {
         setLoggedIn(true);
         getCardsMain()
         setCurrentUser(user)
         navigate('/main')
      })
      .catch((err) => alert(err));
   }

   useEffect(() => {
      tokenCheck()
   }, [])

   function handleCardLike(card) {
      const isLiked = card.likes.some((i) => i === currentUser._id);

      api.putCardLike(card._id, !isLiked)
      .then((newCard) => {
         setCurrentCard((state) =>
         state.map((c) => (c._id === card._id ? newCard : c))
         );
      })
      .catch((err) => alert(err));
   }

   function handleCardDelete(card) {
      api.deleteCard(card._id)
      .then(() => {
         setCurrentCard((state) => state.filter((c) => c._id !== card._id));
         closeAllPopups();
      })
      .catch((err) => alert(err));
   }

   function handleUpdateUser(data) {
      api.createUserInformation(data)
      .then((data) => {
         setCurrentUser(data);
         closeAllPopups();
      })
      .catch((err) => alert(err));
   }

   function handleUpdateAvatar(data) {
      api.createUserImage(data)
      .then((data) => {
         setCurrentUser(data);
         closeAllPopups();
      })
      .catch((err) => alert(err));
   }

   function handleUpdateCard(data) {
      api.createCard(data)
      .then((data) => {
         setCurrentCard([data, ...currentCard]);
         closeAllPopups();
      })
      .catch((err) => alert(err));
   }

   function handleEditAvatarClick() {
      setIsEditAvatarPopupOpen(true);
   }

   function handleEditProfileClick() {
      setIsEditProfilePopupOpen(true);
   }

   function handleAddPlaceClick() {
      setIsAddPlacePopupOpen(true);
   }

   function DeleteCardClick(asda) {
      setDeleteCardPopupOpen(true);
      setCurrentIdCard(asda)
   }

   function handleCardClick(card) {
      setSelectedCard(card);
      setIsImagePopupOpen(true);
   }

   function handleLogin() {
       setLoggedIn(true)
   }

   function closeAllPopups() {
      setIsEditAvatarPopupOpen(false);
      setIsEditProfilePopupOpen(false);
      setIsAddPlacePopupOpen(false);
      setIsImagePopupOpen(false);
      setDeleteCardPopupOpen(false)
      setIsInfoTooltip(false)
   }

   return (
   <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
         <div className="page">
            <Header userData={currentUser} asdasd={setLoggedIn}/>
            <Routes>
               <Route path="/main" element={<ProtectedRoute
               element={Main}
               onEditAvatar={handleEditAvatarClick}
               onEditProfile={handleEditProfileClick}
               onAddPlace={handleAddPlaceClick}
               handleClick={handleCardClick}
               onCardLike={handleCardLike}
               onCardDelete={DeleteCardClick}
               card={currentCard}
               loggedIn={loggedIn}
               />}
               />
               <Route path="/sign-in" element={<Login authorize={authorize}/> }/>
               <Route path="/sign-up" element={<Register popupRegister={setPopupRegister} isInfoTooltip={setIsInfoTooltip} register={register}/>}/>
               <Route path="*" element={<PageNotFound/>}/>
               <Route path="/" element={loggedIn ? <Navigate to='/main'/> : <Navigate to='/sign-in'/>}/>
            </Routes>
         </div>

         <EditProfilePopup
         isOpen={isEditProfilePopupOpen}
         onClose={closeAllPopups}
         onUpdateUser={handleUpdateUser}
         />
         <EditAvatarPopup
         isOpen={isEditAvatarPopupOpen}
         onClose={closeAllPopups}
         onUpdateAvatar={handleUpdateAvatar}
         />
         <AddPlacePopup
         isOpen={isAddPlacePopupOpen}
         onClose={closeAllPopups}
         onUpdateCard={handleUpdateCard}
         />
         <DeletePlacePopup
         isOpen={isDeleteCardPopupOpen}
         onClose={closeAllPopups}
         onCardDelet={handleCardDelete}
         idCard={currentIdCard}
         />
         <ImagePopup
         isOpen={isImagePopupOpen}
         onClose={closeAllPopups}
         card={selectedCard}
         />
         <InfoTooltip
         isOpen={isInfoTooltip}
         onClose={closeAllPopups}
         image={popupRegister.imagePopup}
         text={popupRegister.textPopup}
         />

      </div>
   </CurrentUserContext.Provider>
   );
}

export default App;
