import { ListingImage } from '@/lib/types';

export default function PhotoGallery({ images }: { images: ListingImage[] }) {
  if (!images || images.length === 0) {
    return <div className="w-full h-[50vh] bg-gray-200 rounded-2xl my-6"></div>;
  }

  // Airbnb style: 1 large image on the left, 4 smaller grid images on the right
  const mainImage = images[0];
  const gridImages = images.slice(1, 5); // Up to 4 images for the grid

  return (
    <div className="relative mt-6 rounded-2xl overflow-hidden hidden md:flex gap-2 h-[50vh]">
      {/* Main Image */}
      <div className="w-1/2 h-full cursor-pointer hover:opacity-90 transition">
        <img 
          src={mainImage.image_url} 
          className="object-cover w-full h-full" 
          alt="Main"
        />
      </div>

      {/* Grid Images */}
      <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-2 h-full">
        {gridImages.map((img, index) => (
          <div key={img.id} className="w-full h-full cursor-pointer hover:opacity-90 transition">
            <img 
              src={img.image_url} 
              className="object-cover w-full h-full" 
              alt={`Grid ${index + 1}`}
            />
          </div>
        ))}
      </div>
      
      <button className="absolute bottom-6 right-6 bg-white border border-gray-900 rounded-lg px-4 py-1.5 font-semibold text-sm hover:bg-gray-100 transition shadow-sm z-10 flex items-center gap-2">
         <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', height: '16px', width: '16px', fill: 'currentColor'}}><path d="M3 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-10 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path></svg>
         Show all photos
      </button>
    </div>
  );
}
