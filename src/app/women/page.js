'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { womenWorkouts } from '../utils/women_videos.js';
import Link from 'next/link';
import Image from 'next/image';

export default function WomenFitnessPortal() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const currentWorkout = womenWorkouts[currentVideoIndex];

  const playNextVideo = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % womenWorkouts.length);
  }, []);

  // Handle video end - auto play next video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      playNextVideo();
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, [playNextVideo]);

  // Auto-play on source change
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(error => {
        // Auto-play was prevented.
        console.error("Auto-play prevented: ", error);
        setIsPlaying(false);
      });
    }
  }, [currentVideoIndex, isPlaying]);


  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playPreviousVideo = () => {
    const prevIndex = currentVideoIndex === 0 ? womenWorkouts.length - 1 : currentVideoIndex - 1;
    setCurrentVideoIndex(prevIndex);
  };

  const selectVideo = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="bg-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center">Women&apos;s Fitness</h1>
          <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Men&apos;s Workouts
          </Link>
        </header>

        {/* Main Video Player Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
              <video
                  ref={videoRef}
                  key={currentWorkout.path}
                  className="w-full aspect-video"
                  controls={false}
                  autoPlay
                  muted
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
              >
                <source src={currentWorkout.path} type="video/mp4" />
              </video>

              {/* Custom Controls Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <button
                      onClick={playPreviousVideo}
                      className="bg-gray-900 bg-opacity-80 hover:bg-opacity-90 border border-white border-opacity-30 rounded-full p-3 transition-all duration-200 shadow-lg"
                  >
                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                  </button>

                  <button
                      onClick={togglePlayPause}
                      className="bg-gray-900 bg-opacity-80 hover:bg-opacity-90 border border-white border-opacity-30 rounded-full p-4 transition-all duration-200 shadow-lg"
                  >
                    {isPlaying ? (
                        <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                    ) : (
                        <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                    )}
                  </button>

                  <button
                      onClick={playNextVideo}
                      className="bg-gray-900 bg-opacity-80 hover:bg-opacity-90 border border-white border-opacity-30 rounded-full p-3 transition-all duration-200 shadow-lg"
                  >
                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Current Video Info */}
            <div className="mt-6 bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">{currentWorkout.title}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span>Video {currentVideoIndex + 1} of {womenWorkouts.length}</span>
              </div>
            </div>
          </div>

          {/* Video Preview Grid */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center">All Workouts</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {womenWorkouts.map((workout, index) => (
                  <div
                      key={index}
                      onClick={() => selectVideo(index)}
                      className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                          index === currentVideoIndex
                              ? 'ring-4 ring-blue-500 shadow-lg'
                              : 'hover:shadow-xl'
                      }`}
                  >
                    <div className="relative">
                      <Image
                          src={workout.prev}
                          alt={workout.title}
                          width={256}
                          height={144}
                          className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      {index === currentVideoIndex && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Now Playing
                          </div>
                      )}
                    </div>
                    <div className="p-3 bg-gray-800">
                      <h4 className="font-semibold text-sm mb-1 truncate">{workout.title}</h4>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
