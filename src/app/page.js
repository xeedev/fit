'use client';

import { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { workouts } from './utils/videos.js';
import Link from 'next/link';

export default function FitnessPortal() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const currentWorkout = workouts[currentVideoIndex];

  // Initialize HLS player
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      
      const hls = new Hls();
      hlsRef.current = hls;
      
      hls.loadSource(currentWorkout.path);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Video ready to play');
        // Auto play the video
        video.play().catch(console.error);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log('HLS error:', data);
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = currentWorkout.path;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(console.error);
      }, { once: true });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentWorkout.path]);

  // Handle video end - auto play next video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      playNextVideo();
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, [currentVideoIndex]);

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

  const playNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % workouts.length;
    setCurrentVideoIndex(nextIndex);
  };

  const playPreviousVideo = () => {
    const prevIndex = currentVideoIndex === 0 ? workouts.length - 1 : currentVideoIndex - 1;
    setCurrentVideoIndex(prevIndex);
  };

  const selectVideo = (index) => {
    setCurrentVideoIndex(index);
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
        <h1 className="text-3xl font-bold text-center">Men's Fitness</h1>
        <Link href="/women" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded">
          Women's Workouts
        </Link>
      </header>

      {/* Main Video Player Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Video Player */}
          <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="w-full aspect-video"
              controls={false}
              autoPlay
              muted
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
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
              <span>Duration: {currentWorkout.duration}s</span>
              <span>Reps: {currentWorkout.reps}</span>
              <span>Video {currentVideoIndex + 1} of {workouts.length}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {currentWorkout.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Video Preview Grid */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-center">All Workouts</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {workouts.map((workout, index) => (
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
                  <img
                    src={workout.prev}
                    alt={workout.title}
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
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Duration: {workout.duration}s</div>
                    <div>Reps: {workout.reps}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
