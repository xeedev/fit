# Fitness Video Portal

A simple and elegant fitness video portal built with Next.js that streams HLS workout videos with an intuitive interface.

## Features

- **HLS Video Streaming**: Supports .m3u8 video format with automatic quality adaptation
- **Auto-Play Next**: Videos automatically play the next workout when current video ends
- **Interactive Preview Grid**: Click on any workout thumbnail to instantly switch videos
- **Custom Video Controls**: Play/pause, previous/next navigation with smooth hover effects
- **Workout Information**: Display video duration, reps, and categorized tags
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Visual Indicators**: Highlights currently playing video in the preview grid

## Technology Stack

- **Next.js 15.4.2** - React framework for the web application
- **React 19.1.0** - UI component library
- **HLS.js** - JavaScript library for HLS video playback
- **Tailwind CSS 4** - Utility-first CSS framework for styling

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Video Data

The application uses workout data from `src/app/utils/videos.js` which contains:
- Video stream URLs (.m3u8 format)
- Thumbnail preview images
- Workout titles and metadata
- Exercise tags and categories
- Duration and repetition information

## Usage

1. **Video Player**: The main video player displays the current workout
2. **Navigation Controls**: Use the overlay controls to play/pause or navigate between videos
3. **Workout Grid**: Browse all available workouts in the grid below the player
4. **Click to Play**: Click any workout thumbnail to immediately start playing that video
5. **Auto-progression**: Videos will automatically advance to the next workout when completed

## File Structure

```
src/
  app/
    utils/
      videos.js          # Workout data and video URLs
    page.js              # Main video portal component
    layout.js            # App layout configuration
    globals.css          # Global styles
```

## Browser Compatibility

- **Chrome/Edge**: Full HLS support via HLS.js
- **Firefox**: Full HLS support via HLS.js  
- **Safari**: Native HLS support (no additional library needed)
- **Mobile browsers**: Optimized for touch interactions

## Development

- The app uses React hooks for state management
- HLS.js handles video streaming and format support
- Tailwind CSS provides responsive, utility-based styling
- Next.js handles routing and server-side rendering

Enjoy your fitness journey! 💪
