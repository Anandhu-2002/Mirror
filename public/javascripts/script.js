const swiper = new Swiper(".swiper", {
    // Optional parameters
    speed: 500,
    allowTouchMove: false,
  });
  
  const gotoSlide = (index) => {
    swiper.slideTo(index);
  };
  
  const restart = () => {
    const inputs = document.querySelectorAll("input");
    const buttons = document.querySelectorAll("button[type=button]");
  
    buttons.forEach((button) => {
      button.disabled = true;
    });
  
    inputs.forEach((input) => {
      input.value = "";
    });
  
    gotoSlide(0);
  };
  
  const checkValid = (event) => {
    event.target.nextElementSibling.disabled = !event.target.value.length;
  };
// var body=document.querySelector('.body');
// themeChanger=document.querySelector('.theme-change');
// document.onload = setInitialTheme(localStorage.getItem('theme'));
// function setInitialTheme(themeKey) {
   
//     if (themeKey === 'light') {
//         body.classList.toggle("light")
//     } else {
//        body.classList.remove("light")
//     }
//   }


// themeChanger.addEventListener('click', () =>{
//     body.classList.toggle('light');
//     if(body.classList.contains("light")){
        
//         localStorage.setItem('theme', 'light');
//     }
//     else{
//         localStorage.setItem('theme', 'dark');
//     }
// })
