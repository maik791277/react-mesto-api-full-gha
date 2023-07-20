import React from "react";
import Card from "./Card";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import Footer from "./Footer";

function Main(props) {
   const currentUser = React.useContext(CurrentUserContext)
   console.log(props.card)
   return (
   <>
      <main className="content">
         <section className="profile">
            <div>
               <button className="profile__avatar-button" type="button" onClick={props.onEditAvatar}/>
               <img
               className="profile__avatar"
               src={currentUser.avatar}
               alt="Аватарка"
               />
            </div>
            <div className="profile__info">
               <div className="profile__info-content">
                  <h1 className="profile__name">{currentUser.name}</h1>
                  <p className="profile__job">{currentUser.about}</p>
               </div>
               <button className="profile__edit-button" type="button" onClick={props.onEditProfile}/>
            </div>
            <button className="profile__add-button" type="button" onClick={props.onAddPlace}/>
         </section>
         <section className="card-grid">
            <ul className="card-grid__cards">
               {props.card.map(item => {
                  return (
                  <Card
                  key={item._id}
                  link={item.link}
                  name={item.name}
                  likes={item.likes}
                  idUserCard={item.owner._id}
                  idUser={currentUser._id}
                  onCardClick={props.handleClick}
                  card={item}
                  onLike={props.onCardLike}
                  onCardDelet={props.onCardDelete}
                  />
                  );
               })}
            </ul>
         </section>
      </main>

      <Footer/>
   </>
   );
}

export default Main;