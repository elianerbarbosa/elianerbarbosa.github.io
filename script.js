function ativaLetra(elemento){
    const arrTexto = elemento.innerHTML.split('');
    elemento.innerHTML = '';
    arrTexto.forEach((Letra, i)=>{
setTimeout(()=>{
       elemento.innerHTML += Letra;
}, 75 * i);
});
}

const titulo = document.querySelector('.digitando');
ativaLetra(titulo);

function menuMobol(){
const ativaMenu = document.querySelector('.fa-bars');
const navMenu = document.querySelector('header .navegacao-primaria')

ativaMenu.addEventListener('click', ()=>{
    ativaMenu.classList.toggle('fa-x')
    navMenu.classList.toggle('ativado')
})
}

