// --- Navegacion por click ---
// .active vuelve a significar "la seccion que elegiste en el menu", que es lo que
// las reglas CSS que cuelgan de esa clase ya esperaban: los titulos fantasma
// PROYECTOS/INFO y la animacion de entrada. El fondo 3D se encarga aparte, via
// window.irAEstado (lo expone three.js).
const secciones = [...document.querySelectorAll("main section")];
const menu = document.querySelector(".menuPrincipal");
const cabecera = document.querySelector(".cabecera");
const INICIO = window.ESTADO_INICIAL || "#inicio";
const DURACION = 1.4;

function mostrar(hash) {
    const esInicio = hash === INICIO;

    for (const s of secciones) {
        s.classList.toggle("active", !esInicio && "#" + s.id === hash);
    }

    // Portada y menu solo en el inicio. Cuando ya has elegido seccion, la forma
    // de volver es el nombre de arriba, que es un enlace a #inicio.
    if (cabecera) cabecera.classList.toggle("visible", esInicio);
    if (menu) menu.classList.toggle("active", esInicio);

    if (typeof window.irAEstado === "function") window.irAEstado(hash, DURACION);

    // Al cambiar de seccion el alto del documento cambia de golpe y el scroll
    // puede quedar a media pagina de la anterior. Sin Lenis ya no hay quien lo
    // suavice, y ademas el salto se nota menos aqui, con el morph recien
    // empezado.
    window.scrollTo(0, 0);
}

mostrar(INICIO);

// Los href siguen siendo anclas de verdad (cursor de enlace, abrir en pestana
// nueva), pero el click no mueve el scroll: cambia de seccion y dispara el morph.
document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
        const destino = enlace.getAttribute("href");
        if (!destino || destino === "#") return;

        evento.preventDefault();

        // El h1 es un <a href="#inicio"> y la portada no es un <section>, asi que
        // no se busca dentro de <main>: tiene su propia comprobacion. Sin esto el
        // retorno a la portada se quedaba sin hacer nada.
        if (destino === INICIO || document.querySelector("main " + destino)) {
            mostrar(destino);
        }
    });
});

// --- Proyectos ---
// Cada .itemBoton es la fuente unica de su proyecto: el texto del boton es el
// titulo, el .fechaBoton la fecha y el .descripcionBoton el cuerpo. El panel de
// la derecha no tiene texto escrito, se pinta desde ahi. Antes cada dato vivia
// en dos sitios a la vez (el texto del boto y su data-titulo, el parrafo del
// panel y su data-descripcion) y por eso el click ensebaba un texto distinto del
// que se veia por defecto.
const botonesProyecto = [...document.querySelectorAll(".botonProyectos")];

const detalleTitulo = document.getElementById("detalle-titulo");
const detalleFecha = document.getElementById("detalle-fecha");
const detalleDescripcion = document.getElementById("detalle-descripcion");
const detalleImagen = document.getElementById("detalle-imagen");

function mostrarProyecto(boton) {
    for (const b of botonesProyecto) b.classList.toggle("active", b === boton);

    const bloque = boton.closest(".itemBoton");
    const fecha = bloque && bloque.querySelector(".fechaBoton");
    const descripcion = bloque && bloque.querySelector(".descripcionBoton");
    const titulo = boton.textContent.trim();

    if (detalleTitulo) detalleTitulo.textContent = titulo;
    if (detalleFecha) detalleFecha.textContent = fecha ? fecha.textContent.trim() : "";
    if (detalleDescripcion) {
        detalleDescripcion.textContent = descripcion ? descripcion.textContent.trim() : "";
    }

    if (!detalleImagen) return;

    const src = boton.dataset.imagen;
    if (src) {
        detalleImagen.src = src;
        detalleImagen.alt = "Imagen de " + titulo;
        detalleImagen.hidden = false;
    } else {
        // Sin data-imagen no basta con quitar el src: dejaria el icono de
        // imagen rota de Chrome flotando en el aire.
        detalleImagen.removeAttribute("src");
        detalleImagen.hidden = true;
    }
}

for (const boton of botonesProyecto) {
    boton.addEventListener("click", () => mostrarProyecto(boton));
}

// Al entrar se pinta el proyecto marcado, o el primero si no hay ninguno. Asi el
// panel nunca sale vacio y anadir un proyecto no obliga a tocar nada mas.
const proyectoInicial = botonesProyecto.find((b) => b.classList.contains("active"))
    || botonesProyecto[0];
if (proyectoInicial) mostrarProyecto(proyectoInicial);

// --- Retícula viva ---
// Las columnas no se fijan aqui: se leen del estilo computado del contenedor,
// que es donde querysMovil.css decide cuantas hay (30 / 16 / 10 / 8 segun el
// ancho). Por eso hay que repintar en cada resize.
const contenedorOndas = document.querySelector(".gridOndas");

function pintarOndas() {
    if (!contenedorOndas) return;

    const columnas = getComputedStyle(contenedorOndas)
        .gridTemplateColumns
        .split(" ")
        .filter(Boolean)
        .length;

    const necesarias = columnas * 15;

    if (contenedorOndas.childElementCount === necesarias) return;

    contenedorOndas.textContent = "";
    const fragmento = document.createDocumentFragment();
    for (let i = 0; i < necesarias; i++) {
        fragmento.appendChild(document.createElement("span"));
    }
    contenedorOndas.appendChild(fragmento);
}

pintarOndas();
window.addEventListener("resize", pintarOndas);
