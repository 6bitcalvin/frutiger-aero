import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { FaFolder, FaCog, FaStickyNote, FaRedo, FaMusic, FaPlay, FaPause, FaForward, FaBackward, FaGlobe, FaDesktop, FaPalette, FaFile, FaTrash, FaFilm, FaPhotoVideo, FaStop, FaBroom } from 'react-icons/fa';
import { GiMusicalNotes } from "react-icons/gi";
import { ImWindows } from "react-icons/im";
import { RiCursorFill, RiArrowRightSLine } from "react-icons/ri";
import { BsFillCollectionPlayFill, BsSquare, BsDashLg } from "react-icons/bs";
import * as Tone from 'tone';
import * as THREE from 'three';


// --- Import Wallpapers ---
import wallpaper from './assets/metro_41.jpg';
import wallpaper2 from './assets/frutiger-aero-2.jpg';
import wallpaper3 from './assets/metro_1.jpg';
import wallpaper4 from './assets/metro_pink.jpg';
import wallpaper5 from './assets/liam_27.jpg';
import wallpaper6 from './assets/liam_25.jpg';
import wallpaper7 from './assets/metro_2.jpg';
import wallpaper8 from './assets/windows_7_200.jpg';
import wallpaper9 from './assets/windows_vista_beta_84.jpg';
import wallpaper10 from './assets/metro_39.jpg';
import wallpaper11 from './assets/liam_28.jpg';

// --- Import Aero Center Images ---
import aeroImg1 from './assets/metro_18.jpg';
import aeroImg2 from './assets/metro_21.jpg';
import aeroImg3 from './assets/metro_22.jpg';
import aeroImg4 from './assets/metro_26.jpg';
import aeroImg5 from './assets/metro_40.jpg';
import aeroImg6 from './assets/metro_44.png';
import aeroImg7 from './assets/metro_45.png';
import aeroImg8 from './assets/bubbles_3.jpg';
import aeroImg9 from './assets/bubbles_4.jpg';
import aeroImg10 from './assets/bubbles_5.jpg';
import aeroImg11 from './assets/bubbles_6.jpg';
import aeroImg12 from './assets/bubbles_8.jpg';
import aeroImg13 from './assets/bubbles_9.jpg';
import aeroImg14 from './assets/bubbles_10.jpg';
import aeroImg15 from './assets/bubbles_14.png';
import aeroImg16 from './assets/bubbles_33.jpg';
import aeroImg17 from './assets/bubbles_37.png';


// --- Types and Definitions ---
type Theme = 'aero-blue' | 'frutiger-green' | 'metro-rainbow' | 'frutiger-pink' | 'sunflower-city' | 'growth' | 'metro-book' | 'windows-7' | 'vista-red' | 'metro-swirl' | 'purple-haze';
type Wallpaper = 'metro' | 'frutiger' | 'metro-rainbow' | 'frutiger-pink' | 'sunflower-city' | 'growth' | 'metro-book' | 'windows-7' | 'vista-red' | 'metro-swirl' | 'purple-haze';

interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  pos: { x: number; y: number };
  size: { width: number | string; height: number | string };
  prevPos?: { x: number; y: number };
  prevSize?: { width: number | string; height: number | string };
  zIndex: number;
  content?: any;
}

interface WindowsState {
  [key: string]: WindowState;
}

const themes: Record<Theme, Record<string, string>> = {
  'aero-blue': {
    '--taskbar-bg': 'linear-gradient(to bottom, #245edb 0%, #3f8ce0 100%)', '--taskbar-border': '#4a98e3', '--window-title-bg': 'linear-gradient(to bottom, #0054e8, #003dbd)', '--window-border': 'rgba(0, 84, 232, 0.6)', '--start-menu-bg': 'linear-gradient(to bottom, #3f8ce0, #245edb)', '--selection-bg': 'rgba(40, 120, 220, 0.3)', '--selection-border': 'rgba(40, 120, 220, 0.8)', '--media-player-bg': 'rgba(20, 40, 80, 0.7)', '--media-player-highlight': 'rgba(0, 180, 255, 0.8)',
  },
  'frutiger-green': {
    '--taskbar-bg': 'linear-gradient(to bottom, #008800, #00aa00)', '--taskbar-border': '#00cc00', '--window-title-bg': 'linear-gradient(to bottom, #007700, #006600)', '--window-border': 'rgba(0, 128, 0, 0.6)', '--start-menu-bg': 'linear-gradient(to bottom, #008800, #00aa00)', '--selection-bg': 'rgba(0, 136, 0, 0.3)', '--selection-border': 'rgba(0, 136, 0, 0.8)', '--media-player-bg': 'rgba(0, 60, 20, 0.7)', '--media-player-highlight': 'rgba(30, 255, 110, 0.8)',
  },
  'metro-rainbow': {
    '--taskbar-bg': 'linear-gradient(to right, #333, #111)', '--taskbar-border': '#555', '--window-title-bg': 'linear-gradient(to right, #444, #222)', '--window-border': 'rgba(100, 100, 100, 0.6)', '--start-menu-bg': 'linear-gradient(to right, #333, #111)', '--selection-bg': 'rgba(200, 200, 200, 0.3)', '--selection-border': 'rgba(255, 255, 255, 0.8)', '--media-player-bg': 'rgba(20, 20, 20, 0.7)', '--media-player-highlight': 'rgba(255, 255, 255, 0.8)',
  },
  'frutiger-pink': {
    '--taskbar-bg': 'linear-gradient(to bottom, #d83a7d, #b92b67)', '--taskbar-border': '#e74c8f', '--window-title-bg': 'linear-gradient(to bottom, #c72c6f, #a32057)', '--window-border': 'rgba(200, 40, 110, 0.6)', '--start-menu-bg': 'linear-gradient(to bottom, #d83a7d, #b92b67)', '--selection-bg': 'rgba(255, 100, 150, 0.3)', '--selection-border': 'rgba(255, 100, 150, 0.8)', '--media-player-bg': 'rgba(100, 20, 50, 0.7)', '--media-player-highlight': 'rgba(255, 150, 200, 0.8)',
  },
  'sunflower-city': {
    '--taskbar-bg': 'linear-gradient(to bottom, #4a70a4, #2c4a75)', '--taskbar-border': '#6a90c4', '--window-title-bg': 'linear-gradient(to bottom, #5a80b4, #3c5a85)', '--window-border': 'rgba(74, 112, 164, 0.6)', '--start-menu-bg': 'linear-gradient(to bottom, #4a70a4, #2c4a75)', '--selection-bg': 'rgba(255, 215, 0, 0.3)', '--selection-border': 'rgba(255, 215, 0, 0.8)', '--media-player-bg': 'rgba(44, 74, 117, 0.7)', '--media-player-highlight': 'rgba(255, 225, 50, 0.8)',
  },
  'growth': {
    '--taskbar-bg': 'linear-gradient(to bottom, #8f9a6d, #6b744d)', '--taskbar-border': '#afba8d', '--window-title-bg': 'linear-gradient(to bottom, #9fa97c, #7b845c)', '--window-border': 'rgba(143, 154, 109, 0.6)', '--start-menu-bg': 'linear-gradient(to bottom, #8f9a6d, #6b744d)', '--selection-bg': 'rgba(200, 220, 100, 0.4)', '--selection-border': 'rgba(200, 220, 100, 0.8)', '--media-player-bg': 'rgba(107, 116, 77, 0.7)', '--media-player-highlight': 'rgba(220, 240, 120, 0.9)',
  },
    'metro-book': {
    '--taskbar-bg': 'linear-gradient(to right, #2c3e50, #1a242f)', '--taskbar-border': '#4c6e8e', '--window-title-bg': 'linear-gradient(to right, #34495e, #2c3e50)', '--window-border': 'rgba(52, 73, 94, 0.6)', '--start-menu-bg': 'linear-gradient(to right, #2c3e50, #1a242f)', '--selection-bg': 'rgba(46, 204, 113, 0.3)', '--selection-border': 'rgba(46, 204, 113, 0.8)', '--media-player-bg': 'rgba(26, 36, 47, 0.7)', '--media-player-highlight': 'rgba(52, 152, 219, 0.8)',
  },
    'windows-7': {
    '--taskbar-bg': 'linear-gradient(to bottom, #83b6f3, #4d89d9)', '--taskbar-border': '#a0cffc', '--window-title-bg': 'linear-gradient(to bottom, #add2ff, #7cb9f3)', '--window-border': 'rgba(100, 150, 220, 0.6)', '--start-menu-bg': 'linear-gradient(to bottom, #83b6f3, #4d89d9)', '--selection-bg': 'rgba(173, 216, 230, 0.4)', '--selection-border': 'rgba(173, 216, 230, 0.8)', '--media-player-bg': 'rgba(0, 0, 0, 0.7)', '--media-player-highlight': 'rgba(255, 255, 255, 0.8)',
  },
  'vista-red': {
    '--taskbar-bg': 'linear-gradient(to bottom, #d13a3a, #b02a2a)', '--taskbar-border': '#e05a5a', '--window-title-bg': 'linear-gradient(to bottom, #c03030, #a02020)', '--window-border': 'rgba(200, 50, 50, 0.6)', '--start-menu-bg': 'linear-gradient(to bottom, #d13a3a, #b02a2a)', '--selection-bg': 'rgba(255, 100, 100, 0.3)', '--selection-border': 'rgba(255, 100, 100, 0.8)', '--media-player-bg': 'rgba(50, 10, 10, 0.7)', '--media-player-highlight': 'rgba(255, 150, 150, 0.8)',
  },
  'metro-swirl': {
    '--taskbar-bg': 'linear-gradient(to right, #16a085, #1abc9c)', '--taskbar-border': '#2ecc71', '--window-title-bg': 'linear-gradient(to right, #16a085, #1abc9c)', '--window-border': 'rgba(22, 160, 133, 0.6)', '--start-menu-bg': 'linear-gradient(to right, #16a085, #1abc9c)', '--selection-bg': 'rgba(241, 196, 15, 0.3)', '--selection-border': 'rgba(241, 196, 15, 0.8)', '--media-player-bg': 'rgba(22, 160, 133, 0.7)', '--media-player-highlight': 'rgba(241, 196, 15, 0.8)',
  },
  'purple-haze': {
    '--taskbar-bg': 'linear-gradient(to bottom, #6a3093, #a044ff)', '--taskbar-border': '#8a53c3', '--window-title-bg': 'linear-gradient(to bottom, #7a43b3, #5a2383)', '--window-border': 'rgba(106, 48, 147, 0.6)', '--start-menu-bg': 'linear-gradient(to bottom, #6a3093, #a044ff)', '--selection-bg': 'rgba(200, 150, 255, 0.3)', '--selection-border': 'rgba(200, 150, 255, 0.8)', '--media-player-bg': 'rgba(50, 20, 80, 0.7)', '--media-player-highlight': 'rgba(220, 180, 255, 0.8)',
  }
};
const wallpapers: Record<Wallpaper, string> = { 'metro': wallpaper, 'frutiger': wallpaper2, 'metro-rainbow': wallpaper3, 'frutiger-pink': wallpaper4, 'sunflower-city': wallpaper5, 'growth': wallpaper6, 'metro-book': wallpaper7, 'windows-7': wallpaper8, 'vista-red': wallpaper9, 'metro-swirl': wallpaper10, 'purple-haze': wallpaper11 };
const initialPlaylist = [
    { name: "Playstation Home - Theme.mp3", url: "/music/Playstation Home - Theme.mp3" }, { name: "Xploshi - Connecting.mp3", url: "/music/Xploshi - Connecting.mp3" }, { name: "Xploshi - Customize.mp3", url: "/music/Xploshi - Customize.mp3" }, { name: "Xploshi - Demo Booth.mp3", url: "/music/Xploshi - Demo Booth.mp3" }, { name: "Xploshi - Logging in.mp3", url: "/music/Xploshi - Logging in.mp3" }, { name: "Xploshi - Mesosphere.mp3", url: "/music/Xploshi - Mesosphere.mp3" }, { name: "Xploshi - New You.mp3", url: "/music/Xploshi - New You.mp3" }, { name: "Xploshi - Pod Lounge.mp3", url: "/music/Xploshi - Pod Lounge.mp3" }, { name: "Xploshi - Rafflesia Channel.mp3", url: "/music/Xploshi - Rafflesia Channel.mp3" }, { name: "PlayStation 4 - Intro Theme.mp3", url: "/music/PlayStation 4 System Music - Intro Theme.mp3" }, { name: "PlayStation 4 - Home Menu.mp3", url: "/music/PlayStation 4 System Music - Home Menu.mp3" }, { name: "PlayStation 5 - Home Menu.mp3", url: "/music/PlayStation 5 System Music - Home Menu.mp3" },
];
const aeroCenterImages = [aeroImg1, aeroImg2, aeroImg3, aeroImg4, aeroImg5, aeroImg6, aeroImg7, aeroImg8, aeroImg9, aeroImg10, aeroImg11, aeroImg12, aeroImg13, aeroImg14, aeroImg15, aeroImg16, aeroImg17];


// --- Child Components ---

const CustomCursor = React.memo(() => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);
  return <div className="custom-cursor" style={{ left: `${position.x}px`, top: `${position.y}px` }}><RiCursorFill size={24} /></div>;
});

const Window = React.memo(({ title, onClose, onMinimize, onMaximize, children, position, size, onTitleBarMouseDown, zIndex, isMaximized, isMinimized, className = '' }: any) => {
    const style: React.CSSProperties = {
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        zIndex,
        display: isMinimized ? 'none' : 'flex',
    };
    
    if(isMaximized) {
        style.top = 0;
        style.left = 0;
        style.width = '100vw';
        style.height = 'calc(100vh - 50px)';
        style.transform = 'none';
    }

    return (
      <div className={`window ${className}`} style={style} onMouseDown={(e) => onTitleBarMouseDown(e, title)}>
        <div className="title-bar" onDoubleClick={onMaximize}>
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button onClick={(e) => { e.stopPropagation(); onMinimize(); }}><BsDashLg/></button>
            <button onClick={(e) => { e.stopPropagation(); onMaximize(); }}><BsSquare/></button>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="close-button">x</button>
          </div>
        </div>
        <div className="window-content" onMouseDown={(e) => e.stopPropagation()}>{children}</div>
      </div>
    );
});

const DesktopIcon = React.memo(({ icon, text, onMouseDown, onDoubleClick, selected }: any) => (
  <div className={`desktop-icon ${selected ? 'selected' : ''}`} onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}>
    <div className="icon-container">{icon}</div>
    <span>{text}</span>
  </div>
));

const ContextMenu = React.memo(({ x, y, onRefresh, onNewFolder, onDelete, onOpenSettings, onClose, hasSelection }: any) => {
    const [showNewSubmenu, setShowNewSubmenu] = useState(false);
    return (
        <div className="context-menu" style={{ top: y, left: x }} onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
            <ul>
                {hasSelection && <li onClick={onDelete}><FaTrash style={{marginRight: '10px'}}/> Delete</li>}
                <li onMouseEnter={() => setShowNewSubmenu(true)} onMouseLeave={() => setShowNewSubmenu(false)}>
                    <span><FaFile style={{marginRight: '10px'}}/> New</span>
                    <RiArrowRightSLine style={{marginLeft: 'auto'}}/>
                    {showNewSubmenu && (
                        <div className="submenu">
                           <ul><li onClick={onNewFolder}><FaFolder style={{marginRight: '10px'}}/> Folder</li></ul>
                        </div>
                    )}
                </li>
                <li onClick={onOpenSettings}><FaDesktop style={{marginRight: '10px'}}/> Display settings</li>
                <li onClick={onOpenSettings}><FaPalette style={{marginRight: '10px'}}/> Personalize</li>
                <li onClick={onRefresh}><FaRedo size={12} style={{marginRight: '10px'}}/> Refresh</li>
            </ul>
        </div>
    );
});

const MediaPlayer = React.memo(() => {
    const [playlist] = useState(initialPlaylist);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.75);
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number>();

    const setupAudioContext = useCallback(() => {
        if (!audioRef.current || audioContextRef.current) return;
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        analyserRef.current.fftSize = 256;
    },[]);

    const playPause = () => {
        if (!audioRef.current) return;
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
        setIsPlaying(!isPlaying);
    };

    const changeTrack = (index: number) => {
        let newIndex = index;
        if (newIndex < 0) newIndex = playlist.length - 1;
        if (newIndex >= playlist.length) newIndex = 0;
        setCurrentTrackIndex(newIndex);
        setIsPlaying(true);
    };

    const drawVisualizer = useCallback(() => {
        if (!analyserRef.current || !canvasRef.current || !isPlaying) return;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;
        const color = getComputedStyle(document.documentElement).getPropertyValue('--media-player-highlight').trim();
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2;
            ctx.fillStyle = color || `rgba(30, 255, 110, 0.8)`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
        animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);
    
    useEffect(() => {
        if (isPlaying) {
            setupAudioContext();
            audioRef.current?.play().catch(e => console.error("Playback error:", e));
            animationFrameRef.current = requestAnimationFrame(drawVisualizer);
        } else {
            audioRef.current?.pause();
            if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
        return () => {
            if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
    }, [isPlaying, drawVisualizer, setupAudioContext]);
    
     useEffect(() => {
        const audio = audioRef.current;
        if (audio && playlist[currentTrackIndex]) {
            const handleTimeUpdate = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);
            const handleEnded = () => changeTrack(currentTrackIndex + 1);
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('ended', handleEnded);
            if (audio.src !== playlist[currentTrackIndex].url) {
                audio.src = playlist[currentTrackIndex].url;
            }
            if(isPlaying) audio.play().catch(e => console.error("Auto-play failed", e));
            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('ended', handleEnded);
            };
        }
    }, [currentTrackIndex, isPlaying, playlist]);
    
    useEffect(() => {
       return () => {
           if(audioContextRef.current && audioContextRef.current.state !== 'closed') {
               audioContextRef.current?.close();
           }
       }
    }, []);

    return (
        <div className="media-player">
            <audio ref={audioRef} crossOrigin="anonymous"/>
            <div className="media-player-main">
                <div className="playlist-container">
                    <ul>
                        {playlist.map((track, index) => (
                            <li key={index} className={index === currentTrackIndex ? 'active' : ''} onClick={() => changeTrack(index)}>
                                {track.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="now-playing-section">
                    <canvas ref={canvasRef} className="visualizer-canvas" width="300" height="150" />
                    <div className={`cd-art ${isPlaying ? 'spinning' : ''}`}><div className="cd-hole" /></div>
                </div>
            </div>
            <div className="media-controls">
                 <button className="control-button" onClick={() => changeTrack(currentTrackIndex - 1)}><FaBackward /></button>
                 <button className="control-button play-pause" onClick={playPause}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
                 <button className="control-button" onClick={() => changeTrack(currentTrackIndex + 1)}><FaForward /></button>
                 <input type="range" min="0" max="100" value={progress} className="progress-bar" onChange={(e) => {
                     if(audioRef.current && isFinite(audioRef.current.duration)) audioRef.current.currentTime = (Number(e.target.value) / 100) * audioRef.current.duration;
                 }}/>
                 <input type="range" min="0" max="1" step="0.01" value={volume} className="volume-slider" onChange={e => setVolume(Number(e.target.value))}/>
            </div>
        </div>
    );
});

const VideoPlayer = React.memo(() => {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "video/mp4") {
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
        } else {
            alert("Please select an MP4 file.");
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return(
        <div className="video-player-container">
            {videoSrc ? (
                 <video src={videoSrc} controls autoPlay className="video-player"/>
            ) : (
                <div className="video-upload-placeholder">
                    <p>Select a video file to play.</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/mp4" style={{display: 'none'}}/>
                    <button onClick={handleButtonClick}>Upload MP4</button>
                </div>
            )}
        </div>
    )
});

const Browser = React.memo(() => {
    const HOME_PAGE = 'https://www.wikipedia.org/';
    return (
        <div className="browser">
            <iframe title="Browser" src={HOME_PAGE} className="browser-view" sandbox="allow-forms allow-scripts allow-same-origin allow-popups"></iframe>
        </div>
    )
});

const ImageGallery = () => (
    <div className="aero-center-grid">
            {aeroCenterImages.map((img, index) => (
                <div key={index} className="grid-item">
                    <img src={img} alt={`Aero artwork ${index + 1}`} />
            </div>
        ))}
        </div>
);

const InteractiveBubbles = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Bubbles
        const bubbles: THREE.Mesh[] = [];
        const bubbleGeometry = new THREE.SphereGeometry(1, 32, 32);
        const bubbleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.05,
            transparent: true,
            opacity: 0.6,
        });

        for (let i = 0; i < 20; i++) {
            const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
            bubble.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            bubble.scale.setScalar(Math.random() * 0.5 + 0.2);
            (bubble as any).velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            );
            bubbles.push(bubble);
            scene.add(bubble);
        }

        camera.position.z = 10;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            bubbles.forEach(bubble => {
                bubble.position.add((bubble as any).velocity);
                if (Math.abs(bubble.position.x) > 6) (bubble as any).velocity.x *= -1;
                if (Math.abs(bubble.position.y) > 6) (bubble as any).velocity.y *= -1;
                if (Math.abs(bubble.position.z) > 6) (bubble as any).velocity.z *= -1;
            });
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            if (mountRef.current) {
                camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            currentMount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} id="interactive-bubbles-canvas"></div>;
};

const AeroCenter = React.memo(() => {
    const [activeTab, setActiveTab] = useState('gallery');

    return (
        <>
            <div className="aero-center-tabs">
                <button className={`aero-center-tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>
                    Gallery
                </button>
                <button className={`aero-center-tab ${activeTab === 'bubbles' ? 'active' : ''}`} onClick={() => setActiveTab('bubbles')}>
                    Interactive Bubbles
                </button>
            </div>
            <div className="aero-center-content">
                {activeTab === 'gallery' && <ImageGallery />}
                {activeTab === 'bubbles' && <InteractiveBubbles />}
            </div>
        </>
    );
});


const MusicMaker = React.memo(() => {
    const NOTES = ["B4", "A#4", "A4", "G#4", "G4", "F#4", "F4", "E4", "D#4", "D4", "C#4", "C4"];
    const NUM_STEPS = 32;
    
    const [sequence, setSequence] = useState<boolean[][]>(() => 
        Array(NOTES.length).fill(null).map(() => Array(NUM_STEPS).fill(false))
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [bpm, setBpm] = useState(120);
    
    const synthRef = useRef<Tone.PolySynth | null>(null);
    const sequenceRef = useRef<Tone.Sequence | null>(null);
    
    useEffect(() => {
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "fmsine" },
            envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 },
            volume: -10,
        }).toDestination();
                    
        return () => {
            synthRef.current?.dispose();
            sequenceRef.current?.dispose();
            Tone.Transport.stop();
            Tone.Transport.cancel();
        };
    }, []);
    
    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
    }, [bpm]);

    useEffect(() => {
        if (sequenceRef.current) {
            sequenceRef.current.dispose();
        }
        
        sequenceRef.current = new Tone.Sequence((time, col) => {
            const columnNotes = [];
            for (let i = 0; i < NOTES.length; i++) {
                if (sequence[i][col]) {
                    columnNotes.push(NOTES[i]);
                }
            }
            if (columnNotes.length > 0) {
                synthRef.current?.triggerAttackRelease(columnNotes, "8n", time);
            }
            Tone.Draw.schedule(() => {
                setCurrentStep(col);
            }, time);
        }, Array.from({ length: NUM_STEPS }, (_, i) => i), "16n").start(0);

        return () => {
            sequenceRef.current?.dispose();
        };
    }, [sequence]);

    const togglePlay = async () => {
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        if (Tone.Transport.state === "started") {
            Tone.Transport.pause();
            setIsPlaying(false);
        } else {
            Tone.Transport.start();
            setIsPlaying(true);
        }
    };
    
    const stopPlayback = () => {
        Tone.Transport.stop();
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const clearSequence = () => {
        setSequence(Array(NOTES.length).fill(null).map(() => Array(NUM_STEPS).fill(false)));
    };

    const toggleCell = (row: number, col: number) => {
        const newSequence = sequence.map(r => [...r]);
        newSequence[row][col] = !newSequence[row][col];
        setSequence(newSequence);
    };

    const playNote = (note: string) => {
        synthRef.current?.triggerAttackRelease(note, "8n");
    }

    return (
        <div className="music-maker-container">
            <div className="music-maker-controls">
                <button onClick={togglePlay}>{isPlaying ? <><FaPause/> Pause</> : <><FaPlay/> Play</>}</button>
                <button onClick={stopPlayback}><FaStop/> Stop</button>
                <button onClick={clearSequence}><FaBroom/> Clear</button>
                <label htmlFor="bpm">BPM: {bpm}</label>
                <input type="range" id="bpm" min="60" max="240" value={bpm} onChange={e => setBpm(Number(e.target.value))} />
            </div>
            <div className="music-maker-main">
                <div className="piano-roll">
                    {NOTES.map((note, index) => {
                        if (note.includes('#')) return null;
                        
                        const sharpNoteInfo = {
                            note: NOTES[index - 1],
                            exists: index > 0 && NOTES[index - 1]?.includes('#')
                        };

                        return (
                             <div key={note} className="piano-key-wrapper">
                                <div className="piano-key natural" onClick={() => playNote(note)}>
                                    {note}
                                </div>
                                {sharpNoteInfo.exists && (
                                     <div className="piano-key sharp" onClick={(e) => { e.stopPropagation(); playNote(sharpNoteInfo.note); }}>
                                        {sharpNoteInfo.note}
                                     </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="sequencer-grid-container">
                    <div className="sequencer-grid">
                        {sequence.map((row, rowIndex) => (
                            <div key={rowIndex} className="sequencer-row">
                                {row.map((isActive, colIndex) => (
                                    <div 
                                        key={colIndex}
                                        className={`sequencer-cell ${isActive ? 'active' : ''}`}
                                        onClick={() => toggleCell(rowIndex, colIndex)}
                                    />
                                ))}
                            </div>
                        ))}
                         {isPlaying && <div className="progress-bar-indicator" style={{ left: `${currentStep * 40}px`, transition: `left ${60/bpm/4}s linear` }} />}
                    </div>
                </div>
            </div>
        </div>
    );
});


// --- Main App Component ---
function App() {
  const [time, setTime] = useState(new Date());
  const [theme, setTheme] = useState<Theme>('aero-blue');
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>('frutiger');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [desktopRefreshKey, setDesktopRefreshKey] = useState(0);
  
  const [windows, setWindows] = useState<WindowsState>({
    'My Documents': { isOpen: false, pos: { x: 20, y: 20 }, zIndex: 100, content: [], isMinimized: false, isMaximized: false, size: { width: 500, height: 350 }},
    'Settings': { isOpen: false, pos: { x: 250, y: 150 }, zIndex: 100, isMinimized: false, isMaximized: false, size: { width: 500, height: 400 }},
    'Notepad': { isOpen: false, pos: { x: 350, y: 200 }, zIndex: 100, content: "This is a simple notepad.", isMinimized: false, isMaximized: false, size: { width: 500, height: 350 }},
    'Media Player': {isOpen: false, pos: {x: 400, y: 50 }, zIndex: 100, isMinimized: false, isMaximized: false, size: { width: 600, height: 400 }},
    'Video Player': {isOpen: false, pos: {x: 220, y: 80}, zIndex: 100, isMinimized: false, isMaximized: false, size: { width: 640, height: 480 }},
    'Browser': {isOpen: false, pos: {x: 100, y: 50 }, zIndex: 100, isMinimized: false, isMaximized: false, size: { width: 800, height: 600 }},
    'Frutiger Aero Center': { isOpen: false, pos: {x: 100, y: 100}, zIndex: 100, isMinimized: false, isMaximized: false, size: {width: 700, height: 500}},
    'Music Maker': { isOpen: false, pos: {x: 150, y: 120}, zIndex: 100, isMinimized: false, isMaximized: false, size: {width: 800, height: 500}},
  });

  const [desktopIcons, setDesktopIcons] = useState([
    { id: 'aero-center', name: 'Frutiger Aero Center', icon: <FaPhotoVideo size={48} />, isSystem: true },
    { id: 'docs', name: 'My Documents', icon: <FaFolder size={48} />, isSystem: true },
    { id: 'settings', name: 'Settings', icon: <FaCog size={48} />, isSystem: true },
    { id: 'notepad', name: 'Notepad', icon: <FaStickyNote size={48} />, isSystem: true },
    { id: 'musicmaker', name: 'Music Maker', icon: <GiMusicalNotes size={48} />, isSystem: true },
    { id: 'mediaplayer', name: 'Media Player', icon: <FaMusic size={48} />, isSystem: true },
    { id: 'videoplayer', name: 'Video Player', icon: <BsFillCollectionPlayFill size={48} />, isSystem: true },
    { id: 'browser', name: 'Browser', icon: <FaGlobe size={48} />, isSystem: true },
  ]);
  
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [highestZ, setHighestZ] = useState(100);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean, x: number, y: number }>({ visible: false, x: 0, y: 0 });
  const [selectionBox, setSelectionBox] = useState<{ visible: boolean, x: number, y: number, width: number, height: number }>({ visible: false, x: 0, y: 0, width: 0, height: 0 });
  
  const dragInfo = useRef<{ isDragging: boolean, target: string | null, offset: { x: number, y: number } }>({ isDragging: false, target: null, offset: { x: 0, y: 0 } });
  const selectInfo = useRef({ isSelecting: false, startX: 0, startY: 0 });
  
  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = themes[theme];
    for (const [key, value] of Object.entries(selectedTheme)) {
      root.style.setProperty(key, value);
    }
  }, [theme]);
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindow = useCallback((title: string) => {
        setHighestZ(prevZ => {
        const newZ = prevZ + 1;
        setWindows(prev => {
            const existingWindow = prev[title];
            let newWindowState: WindowState = { 
                ...(existingWindow || { pos: { x: 180, y: 120 }, content: [], size: {width: 500, height: 350} }), 
                isOpen: true,
                isMinimized: false,
                zIndex: newZ 
            };
            return { ...prev, [title]: newWindowState };
        });
        return newZ;
    });
    setStartMenuOpen(false);
  }, []);
  
  const createNewFolder = useCallback(() => {
    setDesktopIcons(prevIcons => {
        const newFolderName = "New Folder";
        let count = 0;
        let finalName = newFolderName;
        while (prevIcons.some(icon => icon.name === finalName)) {
            count++;
            finalName = `${newFolderName} (${count})`;
        }
        return [...prevIcons, { id: `new_folder_${Date.now()}`, name: finalName, icon: <FaFolder size={48} />, isSystem: false }];
    });
  }, []);

  const deleteSelectedIcons = useCallback(() => {
    const iconsToDelete = new Set(selectedIcons);
    setDesktopIcons(prev => prev.filter(icon => !iconsToDelete.has(icon.id) || icon.isSystem));
    setSelectedIcons(new Set());
  }, [selectedIcons]);

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    const currentWindow = windows[title];
    if (currentWindow.isMaximized) return;

    setHighestZ(prevZ => {
        const newZ = prevZ + 1;
        setWindows(prev => {
             dragInfo.current = { isDragging: true, target: title, offset: { x: e.clientX - currentWindow.pos.x, y: e.clientY - currentWindow.pos.y } };
        return { ...prev, [title]: { ...currentWindow, zIndex: newZ } };
        });
        return newZ;
    });
  }, [windows]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragInfo.current.isDragging && dragInfo.current.target) {
        setWindows(prev => {
            const { target, offset } = dragInfo.current;
            if(!target || !prev[target]) return prev;
            return { ...prev, [target]: { ...prev[target], pos: { x: e.clientX - offset.x, y: e.clientY - offset.y } } };
        });
      } else if (selectInfo.current.isSelecting) {
        const { startX, startY } = selectInfo.current;
        const x = Math.min(e.clientX, startX);
        const y = Math.min(e.clientY, startY);
        const width = Math.abs(e.clientX - startX);
        const height = Math.abs(e.clientY - startY);
        setSelectionBox({ visible: true, x, y, width, height });
        
        const newSelected = new Set<string>();
        document.querySelectorAll('.desktop-icon').forEach((el) => {
            const iconRect = el.getBoundingClientRect();
            if (iconRect.left < x + width && iconRect.left + iconRect.width > x && iconRect.top < y + height && iconRect.top + iconRect.height > y) {
                const iconId = el.parentElement?.getAttribute('data-id');
                if (iconId) newSelected.add(iconId);
            }
        });
        setSelectedIcons(newSelected);
      }
    };

    const handleMouseUp = () => {
      dragInfo.current = { isDragging: false, target: null, offset: {x: 0, y: 0}};
      if (selectInfo.current.isSelecting) {
        selectInfo.current.isSelecting = false;
        setSelectionBox(prev => ({ ...prev, visible: false }));
      }
    };
    
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleGlobalMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.context-menu')) return;
    setContextMenu(prev => prev.visible ? { ...prev, visible: false } : prev);
    if (!target.closest('.desktop-icon') && !target.closest('.window')) {
        setSelectedIcons(new Set());
        selectInfo.current = { isSelecting: true, startX: e.clientX, startY: e.clientY };
    }
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (!target.closest('.desktop-icon')) {
        setSelectedIcons(new Set());
    }
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
  };
  
  const handleIconMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    selectInfo.current.isSelecting = false; 
    setContextMenu(prev => prev.visible ? { ...prev, visible: false } : prev);
    if(e.button === 2) { 
        if (!selectedIcons.has(id)) {
             setSelectedIcons(new Set([id]));
        }
    } else { 
        setSelectedIcons(new Set([id]));
    }
  }

  const handleThemeAndWallpaperChange = (theme: Theme, wallpaper: Wallpaper) => {
      setTheme(theme);
      setCurrentWallpaper(wallpaper);
  }

  const toggleMinimize = (title: string) => {
      setWindows(prev => ({...prev, [title]: {...prev[title], isMinimized: !prev[title].isMinimized}}))
  }

  const toggleMaximize = (title: string) => {
      setWindows(prev => {
          const win = prev[title];
          const isMaximized = !win.isMaximized;
          if(isMaximized) {
              return {...prev, [title]: {...win, isMaximized: true, prevPos: win.pos, prevSize: win.size}}
          }
          return {...prev, [title]: {...win, isMaximized: false, pos: win.prevPos || win.pos, size: win.prevSize || win.size}}
      })
  }

  const handleTaskbarClick = (title: string) => {
      const win = windows[title];
      if (win.isMinimized || win.zIndex !== highestZ) {
         setHighestZ(prev => prev + 1);
         setWindows(prev => ({...prev, [title]: {...win, zIndex: highestZ + 1, isMinimized: false}}));
      } else {
          toggleMinimize(title);
      }
  }
  
  return (
    <div className="aero-os-container" style={{ backgroundImage: `url(${wallpapers[currentWallpaper]})` }} onContextMenu={handleContextMenu} onMouseDown={handleGlobalMouseDown}>
      <CustomCursor />
      <div className="desktop" key={desktopRefreshKey}>
        {desktopIcons.map((item) => (
          <div key={item.id} data-id={item.id} className="desktop-icon-wrapper">
             <DesktopIcon icon={item.icon} text={item.name} selected={selectedIcons.has(item.id)} onDoubleClick={() => openWindow(item.name)} onMouseDown={(e: React.MouseEvent) => handleIconMouseDown(e, item.id)}/>
          </div>
        ))}
      </div>
      
      {selectionBox.visible && <div className="selection-box" style={{ left: selectionBox.x, top: selectionBox.y, width: selectionBox.width, height: selectionBox.height }} />}
      {contextMenu.visible && <ContextMenu x={contextMenu.x} y={contextMenu.y} hasSelection={selectedIcons.size > 0 && Array.from(selectedIcons).some(id => !desktopIcons.find(icon => icon.id === id)?.isSystem)} onRefresh={() => setDesktopRefreshKey(k => k + 1)} onNewFolder={createNewFolder} onOpenSettings={() => openWindow('Settings')} onDelete={deleteSelectedIcons} onClose={() => setContextMenu({...contextMenu, visible: false})} />}
      
      {Object.entries(windows).map(([title, props]) => {
        if (!props.isOpen) return null;
        let content;
        let className = '';
        switch(title) {
            case 'Settings': content = (<div className="settings-content"><h3>Personalization</h3><h4>Themes</h4><div className="theme-options"><button className={theme === 'aero-blue' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('aero-blue', 'frutiger')}>Aero Blue</button><button className={theme === 'frutiger-green' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('frutiger-green', 'metro')}>Frutiger Green</button><button className={theme === 'metro-rainbow' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('metro-rainbow', 'metro-rainbow')}>Metro Rainbow</button><button className={theme === 'frutiger-pink' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('frutiger-pink', 'frutiger-pink')}>Frutiger Pink</button><button className={theme === 'sunflower-city' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('sunflower-city', 'sunflower-city')}>Sunflower City</button><button className={theme === 'growth' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('growth', 'growth')}>Growth</button><button className={theme === 'metro-book' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('metro-book', 'metro-book')}>Metro Book</button><button className={theme === 'windows-7' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('windows-7', 'windows-7')}>Windows 7</button><button className={theme === 'vista-red' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('vista-red', 'vista-red')}>Vista Red</button><button className={theme === 'metro-swirl' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('metro-swirl', 'metro-swirl')}>Metro Swirl</button><button className={theme === 'purple-haze' ? 'active' : ''} onClick={() => handleThemeAndWallpaperChange('purple-haze', 'purple-haze')}>Purple Haze</button></div></div>); break;
            case 'Notepad': content = <textarea className="notepad" defaultValue={props.content as string} />; break;
            case 'Media Player': content = <MediaPlayer />; className = 'media-player-window'; break;
            case 'Video Player': content = <VideoPlayer />; className = 'video-player-window'; break;
            case 'Browser': content = <Browser />; className = 'browser-window'; break;
            case 'Frutiger Aero Center': content = <AeroCenter />; className = 'aero-center-window'; break;
            case 'Music Maker': content = <MusicMaker />; className = 'music-maker-window'; break;
            default:
                content = <p>This folder is empty.</p>;
                if (Array.isArray(props.content) && props.content.length > 0) {
                    content = <ul className="file-list">{props.content.map((file:string, i: number) => 
                        <li key={i}>
                           {file.endsWith('.mp4') ? <FaFilm style={{marginRight: '5px'}}/> : <FaFile style={{marginRight: '5px'}}/>} {file}
                        </li>
                    )}</ul>;
                }
        }

        return (
          <Window 
            key={title} 
            title={title} 
            onClose={() => setWindows(p => ({...p, [title]: {...p[title as keyof typeof windows], isOpen: false}}))}
            onMinimize={() => toggleMinimize(title)}
            onMaximize={() => toggleMaximize(title)}
            position={props.pos} 
            size={props.size}
            onTitleBarMouseDown={(e: React.MouseEvent) => handleTitleBarMouseDown(e, title)} 
            zIndex={props.zIndex}
            isMaximized={props.isMaximized}
            isMinimized={props.isMinimized}
            className={className}
          >
            {content}
          </Window>
        )
      })}

      <div className="taskbar">
        <button className="start-button" onClick={() => setStartMenuOpen(o => !o)}><ImWindows /><span>start</span></button>
        <div className="taskbar-divider"></div>
        <div className="taskbar-items">
             {Object.entries(windows).map(([title, props]) => {
                if(!props.isOpen) return null;
                const isActive = props.zIndex === highestZ && !props.isMinimized;
                return (
                    <button key={title} className={`taskbar-item ${isActive ? 'active' : ''}`} onClick={() => handleTaskbarClick(title)}>
                        {title}
                    </button>
                )
            })}
        </div>
        <div className="taskbar-right"><div className="clock">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></div>
      </div>

      {startMenuOpen && (
        <div className="start-menu">
           <div className="start-menu-header">AeroOS</div>
           <ul>{desktopIcons.map(icon => <li key={icon.id} onClick={() => openWindow(icon.name)}>{icon.name}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

export default App;
