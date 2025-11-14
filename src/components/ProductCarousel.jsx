import { useState, useEffect, useRef } from 'react';
import { obtenerBadgesProducto, tieneOferta, obtenerPrecioOriginal } from '../lib/products';

export default function ProductCarousel({ productos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else if (window.innerWidth < 1280) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  const maxIndex = Math.max(0, productos.length - itemsToShow);
  
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsToShow, maxIndex, currentIndex]);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < maxIndex) {
      nextSlide();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevSlide();
    }
  };

  return (
    <div className="relative pt-8 pb-2" ref={carouselRef}>
      <div 
        className="overflow-hidden rounded-xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out gap-4 px-2"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
        >
              {productos.map((producto) => {
                const badges = obtenerBadgesProducto(producto);
                const enOferta = tieneOferta(producto);
                const precioOriginal = obtenerPrecioOriginal(producto);
                return (
                <div 
                  key={producto.id} 
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / itemsToShow}% - 0.5rem)` }}
                >
                  <a href={`/item/${producto.slug}`} className="block group">
                    <article className="bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col shadow-md hover:-translate-y-1">
                      <div className="relative overflow-hidden aspect-square bg-gray-50">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        
                        {badges.length > 0 && (
                          <div className="absolute top-2 left-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${badges[0].color} shadow-sm`}>
                              {badges[0].texto}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1 mb-3">
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                            {producto.nombre}
                          </h3>
                          <p className="text-xs text-gray-500">{producto.marca}</p>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          {enOferta && precioOriginal ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                                  Oferta
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                  ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-orange-600 font-medium">
                                  {Math.round((1 - producto.precio / precioOriginal) * 100)}% OFF
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  ${precioOriginal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-right">
                              <span className="text-lg font-bold text-gray-900">
                                ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </a>
                </div>
                );
              })}
        </div>
      </div>

      {maxIndex > 0 && (
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200 flex items-center justify-center transition-all duration-200 ${
            currentIndex === 0 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:shadow-2xl hover:bg-white hover:border-gray-300 hover:scale-110 active:scale-95'
          }`}
          aria-label="Producto anterior"
        >
          <svg className={`w-5 h-5 md:w-6 md:h-6 ${currentIndex === 0 ? 'text-gray-400' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {maxIndex > 0 && (
        <button
          onClick={nextSlide}
          disabled={currentIndex === maxIndex}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200 flex items-center justify-center transition-all duration-200 ${
            currentIndex === maxIndex 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:shadow-2xl hover:bg-white hover:border-gray-300 hover:scale-110 active:scale-95'
          }`}
          aria-label="Siguiente producto"
        >
          <svg className={`w-5 h-5 md:w-6 md:h-6 ${currentIndex === maxIndex ? 'text-gray-400' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {maxIndex > 0 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? 'bg-gray-900 w-8 h-2.5' 
                  : 'bg-gray-300 w-2.5 h-2.5 hover:bg-gray-400 hover:w-4'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
