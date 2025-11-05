
import React, { useState, useCallback } from 'react';
import { AppState, GroundingChunk } from './types';
import { findNearbyIceCream } from './services/geminiService';
import { IceCreamIcon, MapPinIcon, SadFaceIcon, SearchIcon } from './components/Icons';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PlaceCard } from './components/PlaceCard';
import { MarkdownRenderer } from './components/MarkdownRenderer';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [apiResponseText, setApiResponseText] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setError(null);
    setApiResponseText(null);
    setGroundingChunks([]);
  };

  const handleFindIceCream = useCallback(() => {
    setAppState(AppState.GETTING_LOCATION);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setAppState(AppState.FETCHING_PLACES);
        try {
          const { latitude, longitude } = position.coords;
          const result = await findNearbyIceCream(latitude, longitude);
          
          if (result.text) {
             setApiResponseText(result.text);
          } else {
             setApiResponseText("I found some great places for you! Here they are:");
          }

          if (result.groundingChunks && result.groundingChunks.length > 0) {
            setGroundingChunks(result.groundingChunks);
            setAppState(AppState.SHOWING_RESULTS);
          } else {
            setError("Sorry, I couldn't find any ice cream shops nearby. Maybe try moving to a different spot?");
            setApiResponseText(null);
            setAppState(AppState.ERROR);
          }
        } catch (err) {
          console.error(err);
          setError('An error occurred while fetching ice cream places. Please try again.');
          setAppState(AppState.ERROR);
        }
      },
      (geoError) => {
        let errorMessage = 'Could not get your location.';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = 'Please allow location access to find nearby ice cream shops.';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = 'Your location information is unavailable.';
            break;
          case geoError.TIMEOUT:
            errorMessage = 'The request to get your location timed out.';
            break;
        }
        setError(errorMessage);
        setAppState(AppState.ERROR);
      },
      { timeout: 10000 }
    );
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.IDLE:
        return <IdleView onFind={handleFindIceCream} />;
      case AppState.GETTING_LOCATION:
        return <LoadingView message="Getting your location..." icon={<MapPinIcon className="h-12 w-12 text-pink-500" />} />;
      case AppState.FETCHING_PLACES:
        return <LoadingView message="Scooping up the best spots..." icon={<IceCreamIcon className="h-12 w-12 text-pink-500" />} />;
      case AppState.SHOWING_RESULTS:
        return <ResultsView responseText={apiResponseText} chunks={groundingChunks} onReset={handleReset} />;
      case AppState.ERROR:
        return <ErrorView message={error} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-pink-50 min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 transition-all duration-500">
      <main className="w-full max-w-2xl mx-auto text-center">
        {renderContent()}
      </main>
      <footer className="text-center mt-8 text-pink-400 text-sm">
        <p>Powered by Gemini</p>
      </footer>
    </div>
  );
}

const IdleView: React.FC<{ onFind: () => void }> = ({ onFind }) => (
  <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg animate-fade-in">
    <IceCreamIcon className="h-24 w-24 text-pink-400 mb-4" />
    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-700 mb-2">Craving Ice Cream?</h1>
    <p className="text-lg text-gray-500 mb-8 max-w-md">Let's find the best ice cream shops near you. One click is all it takes!</p>
    <button
      onClick={onFind}
      className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
    >
      <SearchIcon className="h-6 w-6" />
      Find Ice Cream Near Me
    </button>
  </div>
);

const LoadingView: React.FC<{ message: string, icon: React.ReactNode }> = ({ message, icon }) => (
  <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg animate-fade-in">
    <LoadingSpinner icon={icon} />
    <p className="text-xl text-gray-600 font-semibold mt-6">{message}</p>
  </div>
);

const ErrorView: React.FC<{ message: string | null; onReset: () => void }> = ({ message, onReset }) => (
  <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg animate-fade-in">
    <SadFaceIcon className="h-20 w-20 text-red-400 mb-4" />
    <h2 className="text-3xl font-bold text-red-600 mb-2">Oops!</h2>
    <p className="text-lg text-gray-500 mb-8 max-w-md">{message || 'Something went wrong.'}</p>
    <button
      onClick={onReset}
      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
    >
      Try Again
    </button>
  </div>
);

const ResultsView: React.FC<{ responseText: string | null, chunks: GroundingChunk[], onReset: () => void }> = ({ responseText, chunks, onReset }) => (
  <div className="flex flex-col items-center p-4 sm:p-8 bg-white rounded-3xl shadow-lg animate-fade-in w-full">
    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-700 mb-6 self-start">Sweet Spots Found!</h2>
    {responseText && (
        <div className="text-left bg-pink-50 p-4 rounded-xl mb-6 w-full prose prose-pink">
            <MarkdownRenderer content={responseText} />
        </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
      {chunks.map((chunk, index) => (
        chunk.maps ? <PlaceCard key={index} place={chunk.maps} /> : null
      ))}
    </div>
    <button
      onClick={onReset}
      className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300"
    >
      Search Again
    </button>
  </div>
);
