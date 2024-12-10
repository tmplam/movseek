import React, { useState } from 'react';
import Image from 'next/image';
import { TMDB_API } from '@/utils/constants';
import { Cast } from '@/models/movie-detail-types';

interface CastCardProps {
  actor: Cast;
}

const CastCard: React.FC<CastCardProps> = ({ actor }) => {
  const [imageSrc, setImageSrc] = useState(TMDB_API.POSTER(actor.profile_path));

  return (
    <div className="relative w-full h-full bg-white font-geist shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      <Image
        src={imageSrc}
        alt={actor.name}
        className="w-full h-60 object-cover hover:cursor-pointer"
        width={400}
        height={400 * 1.618}
        onError={() => setImageSrc(actor.gender == 1 ? '/default-female-avatar.svg' : '/default-male-avatar.svg')}
        priority
      />

      <div className="absolute text-center top-3/4 bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900 to-transparent px-2 py-5">
        <h3 className="text-sm text-white font-bold line-clamp-2 hover:text-primary hover:cursor-pointer">
          {actor.name}
        </h3>
        <p className="text-xs italic mt-1 text-white">{actor.character}</p>
      </div>
    </div>
  );
};

export default CastCard;