const TELEFONO_WHATSAPP = "593989539744";

const productos = [
  {
    id: 1,
    nombre: "CAMISETA OVERSIZE VEGETA • HEAVY DROP",
    fit: "Oversize Fit • Algodón pesado",
    precio: 18.00,
    categoria: "camiseta",
    tallas: ["S", "M", "L", "XL"],
    imagen: "assets/camisa oversize Vegeta.jpg"
  },
  {
    id: 2,
    nombre: "CAMISETA OVERSIZE GOHAN • HEAVY DROP",
    fit: "Oversize Fit • Algodón pesado",
    precio: 18.00,
    categoria: "camiseta",
    tallas: ["S", "M", "L", "XL"],
    imagen: "assets/gohan.jpg"
  },
  {
    id: 3,
    nombre: "CAMISETA OVERSIZE DENNIS RODMAN • CUSTOM",
    fit: "Oversize Fit • Algodón pesado",
    precio: 18.00,
    categoria: "Camiseta",
    tallas: ["S", "M", "L", "XL"],
    imagen: "assets/3.jpg"
  }
];

let carrito = [];
let categoriaActual = "todos";
let textoBusqueda = "";

const gridProductos = document.getElementById("grid-productos");
const contadorCarrito = document.getElementById("contador-carrito");
const modalCarrito = document.getElementById("modal-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const botonesFiltro = document.querySelectorAll(".btn-filtro");
const buscadorProductos = document.getElementById("buscador-productos");
const btnMenuFiltro = document.getElementById("btn-menu-filtro");

function renderizarProductos() {
  if (!gridProductos) return;
  gridProductos.innerHTML = "";

  const filtrados = productos.filter((prod) => {
    const coincideCategoria =
      categoriaActual === "todos" ||
      prod.categoria.toLowerCase() === categoriaActual.toLowerCase();

    const termino = textoBusqueda.trim().toLowerCase();
    const coincideTexto =
      !termino ||
      prod.nombre.toLowerCase().includes(termino) ||
      (prod.fit && prod.fit.toLowerCase().includes(termino)) ||
      prod.categoria.toLowerCase().includes(termino);

    return coincideCategoria && coincideTexto;
  });

  if (filtrados.length === 0) {
    gridProductos.innerHTML = `<p style="color:#9e9eaa;grid-column:1/-1;text-align:center;">No se encontraron prendas con ese filtro.</p>`;
    return;
  }

  filtrados.forEach((prod) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div>
        <div class="card-img-wrap">
          <span class="card-tag">${prod.etiqueta || prod.categoria}</span>
          <img src="${prod.imagen}" alt="${prod.nombre}" />
        </div>
        <h3 class="card-title">${prod.nombre}</h3>
        <div class="card-precio">$${prod.precio.toFixed(2)}</div>
        <p class="card-cuotas">${prod.fit || "Algodón pesado"}</p>
      </div>
      <div class="card-controls">
        <select id="talla-${prod.id}" aria-label="Seleccionar talla para ${prod.nombre}">
          ${prod.tallas.map((t) => `<option value="${t}">Talla ${t}</option>`).join("")}
        </select>
        <button type="button" class="btn-primario" onclick="agregarAlCarrito(${prod.id})">AGREGAR AL CARRITO</button>
      </div>
    `;
    gridProductos.appendChild(card);
  });
}

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesFiltro.forEach((b) => b.classList.remove("activo"));
    boton.classList.add("activo");
    categoriaActual = boton.dataset.categoria;
    renderizarProductos();
  });
});

if (buscadorProductos) {
  buscadorProductos.addEventListener("input", (e) => {
    textoBusqueda = e.target.value;
    renderizarProductos();
  });
}

if (btnMenuFiltro) {
  btnMenuFiltro.addEventListener("click", () => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    buscadorProductos?.focus();
  });
}

renderizarProductos();

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;
  const selectTalla = document.getElementById(`talla-${id}`);
  const talla = selectTalla ? selectTalla.value : "M";
  carrito.push({ ...producto, talla });
  actualizarCarrito();
}

function actualizarCarrito() {
  if (contadorCarrito) contadorCarrito.textContent = carrito.length;
  if (!listaCarrito) return;

  listaCarrito.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `<li style="color:#9e9eaa;border:none;background:transparent;">Tu bag está vacío.</li>`;
  } else {
    carrito.forEach((item, index) => {
      total += item.precio;
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <span><strong>${item.nombre}</strong> (${item.talla}) — $${item.precio.toFixed(2)}</span>
        <button type="button" class="btn-eliminar" onclick="eliminarItem(${index})" aria-label="Quitar">✕</button>
      `;
      listaCarrito.appendChild(li);
    });
  }

  if (totalCarrito) totalCarrito.textContent = total.toFixed(2);
}

function eliminarItem(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

const abrirModal = () => {
  actualizarCarrito();
  if (!modalCarrito) return;
  modalCarrito.classList.remove("oculto");
  modalCarrito.classList.add("open");
  modalCarrito.style.display = "flex";
  modalCarrito.setAttribute("aria-hidden", "false");
};

const cerrarModal = () => {
  if (!modalCarrito) return;
  modalCarrito.classList.add("oculto");
  modalCarrito.classList.remove("open", "active");
  modalCarrito.style.display = "none";
  modalCarrito.setAttribute("aria-hidden", "true");
};

const btnAbrirCarrito = document.getElementById("btn-abrir-carrito");
const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");
const btnCerrarX = document.getElementById("btn-cerrar-x");

if (btnAbrirCarrito) btnAbrirCarrito.onclick = abrirModal;
if (btnCerrarCarrito) btnCerrarCarrito.onclick = cerrarModal;
if (btnCerrarX) btnCerrarX.onclick = cerrarModal;

if (modalCarrito) {
  modalCarrito.addEventListener("click", (e) => {
    if (e.target === modalCarrito) cerrarModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
});

const btnEnviarWhatsapp = document.getElementById("btn-enviar-whatsapp");

if (btnEnviarWhatsapp) {
  btnEnviarWhatsapp.onclick = () => {
    if (carrito.length === 0) {
      alert("Agrega al menos una prenda a tu bag antes de enviar el pedido.");
      return;
    }

    const detalle = carrito
      .map((item) => `• ${item.nombre} [Talla ${item.talla}] - $${item.precio.toFixed(2)}`)
      .join("\n");
    const total = totalCarrito ? totalCarrito.textContent : "0.00";
    const mensaje = `Hola Altapinta, quiero hacer este pedido:\n\n${detalle}\n\n*Total: $${total}*`;
    const url = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };
}
