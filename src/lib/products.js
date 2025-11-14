import productsData from '../data/products.json';

export function obtenerProductos() {
  return productsData;
}

export function obtenerProductoPorSlug(slug) {
  const productos = obtenerProductos();
  return productos.find((producto) => producto.slug === slug);
}

export function obtenerCategorias() {
  const productos = obtenerProductos();
  const categorias = productos.map((producto) => producto.categoria);
  return Array.from(new Set(categorias)).sort();
}

export function obtenerMarcas() {
  const productos = obtenerProductos();
  const marcas = productos.map((producto) => producto.marca);
  return Array.from(new Set(marcas)).sort();
}

export function obtenerBadgesProducto(producto) {
  const badges = [];
  
  if (producto.id > 15) {
    badges.push({
      texto: 'Nuevo',
      tipo: 'nuevo',
      color: 'bg-green-100 text-green-800 border-green-200'
    });
  }
  
  return badges;
}

export function tieneOferta(producto) {
  return producto.precio.toString().endsWith('.99');
}

export function obtenerPrecioOriginal(producto) {
  if (tieneOferta(producto)) {
    const descuento = producto.id % 3 === 0 ? 0.25 : producto.id % 2 === 0 ? 0.20 : 0.15;
    return Math.round(producto.precio / (1 - descuento) * 100) / 100;
  }
  return null;
}

