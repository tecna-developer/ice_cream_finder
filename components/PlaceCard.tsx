
import React from 'react';
import { Place } from '../types';
import { ExternalLinkIcon, MapPinIcon } from './Icons';

interface PlaceCardProps {
  place: Place;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  return (
    <div className="bg-white border border-pink-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col justify-between text-left h-full">
      <div>
        <div className="flex items-start gap-3">
          <MapPinIcon className="h-6 w-6 text-pink-400 flex-shrink-0 mt-1" />
          <h3 className="text-lg font-bold text-gray-800 mb-4">{place.title}</h3>
        </div>
      </div>
      <a
        href={place.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center justify-center gap-2 bg-pink-100 text-pink-700 font-semibold py-2 px-4 rounded-lg hover:bg-pink-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        View on Map
        <ExternalLinkIcon className="h-4 w-4" />
      </a>
    </div>
  );
};
