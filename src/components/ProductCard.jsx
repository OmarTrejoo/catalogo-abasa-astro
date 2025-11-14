import { obtenerBadgesProducto } from '../lib/products';

export default function ProductCard({ producto }) {
  const badges = obtenerBadgesProducto(producto);
  
  return (
    <a href={`/item/${producto.slug}`} className="block group">
      <article className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-sm hover:-translate-y-1 h-full flex flex-col">
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.tipo}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${badge.color} shadow-sm`}
                >
                  {badge.texto}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1 mb-3">
            <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 mb-2 text-sm line-clamp-2 transition-colors duration-200">
              {producto.nombre}
            </h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                {producto.marca}
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-emerald-600 font-medium">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Disponible
              </div>
              <span className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">
                ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}
