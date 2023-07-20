import mestoSvg from "../images/Mesto.svg";
import {Link, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";

function Header (props) {

   const [hamburger, setHamburger] = useState(false)
   const [login, setLogin] = useState(false)
   const [register, setRegister] = useState(false)
   const [unknown, setUnknown] = useState(true)

   let location = useLocation();
   const navigate = useNavigate()

   function locationPage() {
      if (location.pathname === '/main') {
         setLogin(false)
         setHamburger(true)
         setRegister(false)
         setUnknown(false)
         document.querySelector('.header__user').classList.add('header__user-main')
      }else if(location.pathname === '/sign-in') {
         setLogin(true)
         setHamburger(false)
         setRegister(false)
         setUnknown(false)
         document.querySelector('.header__user').classList.remove('header__user-main')
      }else if (location.pathname === '/sign-up') {
         setLogin(false)
         setHamburger(false)
         setRegister(true)
         setUnknown(false)
      }
   }

   useEffect(() => {
      locationPage()
   })

   function deleteJwt() {
      localStorage.removeItem('jwt')
      navigate('/sign-in')
      props.asdasd(false)
   }

   function toggleMenu() {
      const hamburger = document.querySelector('.hamburger')
      const barTop = document.querySelector('.top')
      const barMiddle = document.querySelector('.middle')
      const barBottom = document.querySelector('.bottom')

      if
      (hamburger.classList.toggle('hamburger__menu-is-visible'))
      {
         hamburger.classList.add('hamburger__menu-is-visible')
         barTop.classList.add('top-open')
         barMiddle.classList.add('middle-open')
         barBottom.classList.add('bottom-open')
      }
      else
      {
         hamburger.classList.remove('hamburger__menu-is-visible')
         barTop.classList.remove('top-open')
         barMiddle.classList.remove('middle-open')
         barBottom.classList.remove('bottom-open')
      }
   }

   return (
   <>
      {hamburger &&
      <div className="hamburger">
         <p className="header__user-email">{props.userData.email}</p>
         <button onClick={deleteJwt} className="header__button">Выход</button>
      </div>
      }
      <header className="header">
         <img
         className="header__logo"
         src={mestoSvg}
         alt="Логотип Mesto"
         />

         <div className="header__user">
            {hamburger &&
            <>
               <button onClick={deleteJwt} className="header__button">Выход</button>
               <p className="header__user-email">{props.userData.email}</p>
            </>
            }

            {login &&
            <>
               <Link to="/sign-up" className="header__button" >Регистрация</Link>
            </>
            }

            {register &&
            <>
               <Link to="/sign-in" className="header__button">Вход</Link>
            </>
            }
            {unknown &&
               <>
                  <Link to="/main" className="header__button">Главная</Link>
               </>
            }

         </div>

         {hamburger &&
         <div className="hamburger__button" onClick={toggleMenu}>
            <div className="hamburger__button-con">
               <div className="hamburger__button-bar top"></div>
               <div className="hamburger__button-bar middle"></div>
               <div className="hamburger__button-bar bottom"></div>
            </div>
         </div>
         }
      </header>
   </>
   );
}

export default Header;