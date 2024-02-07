function renderLogin() {
    const logo = document.querySelector('.joinLogo');
    const startup = document.querySelector('.startup');

    setTimeout(function(){
        logo.classList.add('selected');
    }, 1000);

    setTimeout(function(){
        startup.classList.add('blend-out');
    }, 1250);

    setTimeout(function(){
        startup.classList.add('d-none');
    }, 1350);
}