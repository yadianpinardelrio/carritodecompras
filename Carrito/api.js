//notas importantes
// recordar q el json es un arreglo de objetos por
// eso puede recorrerse con un foreach
// recordar q aqui las funciones pueden ser const

const cards = document.getElementById('cards')
const templatecard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
const templatefooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const items = document.getElementById('items')
const footer = document.getElementById('footer')
let carrito = {}

document.addEventListener('DOMContentLoaded',() => {
fechData()
//ojo a continuacion esto es para guardar la info
// de la pagina localmente
if (localStorage.getItem('carrito')){
carrito = JSON.parse(localStorage.getItem('carrito'))
pintarCarrito()
}
//

})

cards.addEventListener('click',e => {
addCarrito(e)
})

items.addEventListener('click',e => {
btnAccion(e)
})

const btnAccion = e =>{
if (e.target.classList.contains('btn-info')){
const producto = carrito[e.target.dataset.id]
producto.cantidad++
carrito[e.target.dataset.id]={...producto}
pintarCarrito()
}

if (e.target.classList.contains('btn-danger')){
  const producto = carrito[e.target.dataset.id]
  producto.cantidad--
  if (producto.cantidad === 0){
    delete carrito[e.target.dataset.id]
  }
  pintarCarrito()
  }

  e.stopPropagation()

}



const fechData = async () => {
try {
const res = await fetch('api.json')
const data = await res.json()
//console.log(data)
pintarCards(data)
} catch (error) {
  console.log(error)
}

}

const pintarCards = data => {
data.forEach(producto =>{
templatecard.querySelector('h5').textContent = producto.title
templatecard.querySelector('p').textContent = producto.precio
templatecard.querySelector('img').setAttribute("src",producto.thumbnailUrl)
templatecard.querySelector('.btn-dark').dataset.id = producto.id
const clone = templatecard.cloneNode(true)
fragment.appendChild(clone)

})
cards.appendChild(fragment)

}

const addCarrito = e =>{
//console.log(e.target)
if (e.target.classList.contains('btn-dark')) {
setCarrito(e.target.parentElement)

}
e.stopPropagation()
}

const setCarrito = objeto => {
const producto = {
    title : objeto.querySelector('h5').textContent,
    id : objeto.querySelector('button').dataset.id,
    precio : objeto.querySelector('p').textContent,
    cantidad :1
}

if (carrito.hasOwnProperty(producto.id)){
   producto.cantidad = carrito[producto.id].cantidad + 1
}

carrito[producto.id] = {...producto}
pintarCarrito()

}

const pintarCarrito = () => {
//console.log(carrito)
items.innerHTML = ''
Object.values(carrito).forEach(producto => {
templateCarrito.querySelector('th').textContent = producto.id
templateCarrito.querySelectorAll('td')[0].textContent = producto.title
templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
templateCarrito.querySelector('.btn-info').dataset.id = producto.id
templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
const clone = templateCarrito.cloneNode(true)
fragment.appendChild(clone)

})
items.appendChild(fragment)
pintarFooter()
localStorage.setItem('carrito',JSON.stringify(carrito))
} 

const pintarFooter = () => {
footer.innerHTML = ''
if (Object.keys(carrito).length === 0){
footer.innerHTML = `
<th scope="row" colspan="5">Carrito Vacio -Comience a comprar</th>
`
return
}
const nCantidad = Object.values(carrito).reduce((acc,{cantidad})=> acc + cantidad,0)
const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio})=> acc + cantidad * precio,0)
templatefooter.querySelectorAll('td')[0].textContent = nCantidad
templatefooter.querySelector('span').textContent = nPrecio
const clone = templatefooter.cloneNode(true)
fragment.appendChild(clone)
footer.appendChild(fragment)

const btnvaciar = document.getElementById('vaciar-carrito')
btnvaciar.addEventListener('click',()=> {
carrito = {}
pintarCarrito()
})



}