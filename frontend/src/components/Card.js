function Card(props) {

   function handleClick() {
      props.onCardClick(props.card);
   }

   function handleLikeClick() {
      props.onLike(props.card)
   }

   function handleDeleteClick() {
      props.onCardDelet(props.card)
   }

   const isOwn = props.idUserCard === props.idUser;
   const isLiked = props.likes.some(i => i._id === props.idUser);

   const cardLikeButtonClassName = (
   `card__like ${isLiked && 'card__like_active'}`
   );

   return (
   <li className="card">
      <div className="card__image-block">
         <button className="card__image-button" type="button" onClick={handleClick}/>
         <img className="card__image" src={props.link} alt={props.title}/>
      </div>
      <div className="card__info">
         <h2 className="card__title">{props.name}</h2>
         <div className="card__container-like">
            <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}/>
            <div className="card__like-counter">{props.likes.length}</div>
         </div>
      </div>
      {isOwn && <button className="card__remove" type="button" onClick={handleDeleteClick}/>}
   </li>
   );
}

export default Card