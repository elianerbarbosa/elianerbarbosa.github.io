
function escrevendoLetra() {
function ativaLetra(element){
    const arrText = element.innerHTML.split('');
    element.innerHTML = '';
    arrText.forEach((Letra, i) =>{
        setTimeout(()=>{
            element.innerHTML += Letra;
        }, 75 * i);
    });
}
const titulo = document.querySelector('.digitando');
ativaLetra(titulo);
}
escrevendoLetra()
/* blolinhas mudança de slides */


function menuMobol(){
const ativaMenu = document.querySelector('.fa-bars');
const navMenuMenu = document.querySelector('header .navegacao-primaria');
 
ativaMenu.addEventListener('click',()=>{
    ativaMenu.classList.toggle('fa-x')
    navMenu.classList.toggle('ativado')
});
}

    

const divexperiencia = document.querySelectorAll('.experiencia_content div');
const liexperiencia = document.querySelectorAll('.experiencia_content ul li');
const diveducacao = document.querySelectorAll('.educacao_content div');
const lieducacao = document.querySelectorAll('.educacao_content ul li');

divexperiencia[0].classList.add('ativo')
diveducacao[0].classList.add('ativo')
liexperiencia[0].classList.add('ativo')
lieducacao[0].classList.add('ativo')

function slideShow(index) {
    divexperiencia.forEach((div)=>{
        div.classList.remove('ativo');
    });
    liexperiencia.forEach((botao)=> {
        botao.classList.remove('ativo');
    })
    divexperiencia[index].classList.add('ativo')
    liexperiencia[index].classList.add('ativo')
}

function slideShow2(index) {
    diveducacao.forEach((div)=>{
    div.classList.remove('ativo');
    });
    lieducacao.forEach((botao)=>{
        botao.classList.remove('ativo');
    })
    diveducacao[index].classList.add('ativo');
    lieducacao[index].classList.add('ativo');

}

liexperiencia.forEach((event,index)=>{
    event.addEventListener('click', ()=>{
        slideShow(index)
    });
});

lieducacao.forEach((event,index)=>{
    event.addEventListener('click', ()=>{
        slideShow2(index)
    });
});



