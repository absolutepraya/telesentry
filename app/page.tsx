/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */

'use client';

import {
	Home as HomeIcon,
	TrendingUp,
	Bell,
	Settings,
	AlertTriangle,
	Search,
	LogIn,
	ChevronRight,
	Radio,
	ChartNoAxesCombined,
	Logs,
	BellRing,
	ScrollText,
	Atom,
	OctagonAlert,
	Camera,
	CheckCircle,
	XCircle,
	Loader,
} from 'lucide-react';
import Map from './components/Map';
import AnomalyChart from './components/AnomalyChart';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
	const [showScan, setShowScan] = useState(false);
	const [capturedImage, setCapturedImage] = useState('');
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [scanResult, setScanResult] = useState<null | { isLegal: boolean }>(
		null
	);
	const [scanCounter, setScanCounter] = useState(0);
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);

	// Initialize webcam when showScan is true
	useEffect(() => {
		if (showScan && videoRef.current) {
			startWebcam();
		}

		// Cleanup function to stop webcam when component unmounts or showScan becomes false
		return () => {
			if (streamRef.current) {
				const tracks = streamRef.current.getTracks();
				tracks.forEach((track) => track.stop());
				streamRef.current = null;
			}
		};
	}, [showScan]);

	const startWebcam = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false,
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				streamRef.current = stream;
			}
		} catch (err) {
			console.error('Error accessing webcam:', err);
		}
	};

	const captureImage = () => {
		if (videoRef.current) {
			const canvas = document.createElement('canvas');
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;

			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

				const imageDataUrl = canvas.toDataURL('image/png');
				setCapturedImage(imageDataUrl);

				// Reset result and start analyzing
				setScanResult(null);
				setIsAnalyzing(true);

				// Simulate API analysis
				setTimeout(() => {
					const isLegal = scanCounter % 2 === 0;
					setScanResult({ isLegal });
					setIsAnalyzing(false);
					setScanCounter((prev) => prev + 1);
				}, 4000);
			}
		}
	};

	return (
		<div className='min-h-screen flex text-white'>
			{/* Sidebar */}
			<div className='w-[15rem] component-bg h-screen flex flex-col fixed left-0 top-0 z-10'>
				<div className='p-4 flex items-center gap-2 font-bold text-xl border-b border-gray-700/50'>
					<a href='/'>
						<img
							src='/logo.svg'
							alt='logo'
							className='w-full'
						/>
					</a>
				</div>

				<nav className='flex-1 py-4 px-3'>
					<div className='px-3 py-2 flex items-center gap-2 bg-primary/20 border-l-4 border-primary cursor-pointer rounded-xl'>
						<HomeIcon size={18} />
						<span>Dashboard</span>
					</div>
					<div className='px-3 py-2 flex items-center gap-2 text-gray-400 cursor-not-allowed rounded-2xl'>
						<ChartNoAxesCombined size={18} />
						<span>Risk Analysis</span>
					</div>
					<div className='px-3 py-2 flex items-center gap-2 text-gray-400 cursor-not-allowed rounded-2xl'>
						<Logs size={18} />
						<span>SS7 Logs</span>
					</div>
					<div className='px-3 py-2 flex items-center gap-2 text-gray-400 cursor-not-allowed rounded-2xl'>
						<BellRing size={18} />
						<span>Alerts & Notifications</span>
					</div>
					<div className='px-3 py-2 flex items-center gap-2 text-gray-400 cursor-not-allowed rounded-2xl'>
						<ScrollText size={18} />
						<span>Reports</span>
					</div>
					<div className='px-3 py-2 flex items-center gap-2 text-gray-400 cursor-not-allowed rounded-2xl'>
						<Atom size={18} />
						<span>Integrations</span>
					</div>
					<div className='px-3 py-2 flex items-center gap-2 text-gray-400 cursor-not-allowed rounded-2xl'>
						<OctagonAlert size={18} />
						<span>Help & Docs</span>
					</div>
				</nav>
			</div>

			{/* Main Content */}
			<div className='flex-1 ml-[15rem]'>
				{/* Top Navigation */}
				<div className='flex justify-between items-center p-4'>
					<div className='flex items-center gap-1'>
						<span className='opacity-50'>Home</span>
						<ChevronRight size={14} />
						<span>Dashboard</span>
					</div>
					<div className='flex items-center gap-4'>
						<div className='flex items-center component-bg rounded-2xl px-3 py-2'>
							<Search
								size={14}
								className='text-gray-400'
							/>
							<input
								type='text'
								placeholder='Search...'
								className='bg-transparent border-none outline-none text-sm w-36 ml-2'
							/>
						</div>
						<button className='flex items-center component-bg rounded-2xl px-8 py-2 gap-1 text-sm'>
							<LogIn size={14} />
							<span>Sign In</span>
						</button>
						<div
							className='cursor-pointer hover:text-primary transition-colors'
							onClick={() => setShowScan(!showScan)}
						>
							<Camera size={18} />
						</div>
						<Settings size={18} />
						<Bell size={18} />
					</div>
				</div>

				{/* Dashboard Content */}
				<div className='p-4'>
					{/* Stat Boxes */}
					<div className='grid grid-cols-4 gap-4 mb-6'>
						<div className='component-bg rounded-2xl p-4'>
							<div className='flex justify-between items-start'>
								<div>
									<div className='text-sm text-gray-400'>
										Total Monitoring Towers
									</div>
									<div className='text-2xl font-bold'>731,311</div>
								</div>
								<div className='bg-primary/20 p-2 rounded-2xl'>
									<Radio
										size={20}
										className='text-green-400'
									/>
								</div>
							</div>
						</div>

						<div className='component-bg rounded-2xl p-4'>
							<div className='flex justify-between items-start'>
								<div>
									<div className='text-sm text-gray-400'>
										Detected Illegal Tower
									</div>
									<div className='text-2xl font-bold items-end flex'>
										19 <span className='text-xs text-red-500 ml-1'>+5</span>
									</div>
								</div>
								<div className='bg-red-500/20 p-2 rounded-2xl'>
									<AlertTriangle
										size={20}
										className='text-red-500'
									/>
								</div>
							</div>
						</div>

						<div className='component-bg rounded-2xl p-4'>
							<div className='flex justify-between items-start'>
								<div>
									<div className='text-sm text-gray-400'>Anomaly Rate</div>
									<div className='text-2xl font-bold items-end flex'>
										+3,052{' '}
										<span className='text-xs text-red-500 ml-1'>+12%</span>
									</div>
								</div>
								<div className='bg-primary/20 p-2 rounded-2xl'>
									<TrendingUp
										size={20}
										className='text-white'
									/>
								</div>
							</div>
						</div>

						<div className='component-bg rounded-2xl p-4'>
							<div className='flex justify-between items-start'>
								<div>
									<div className='text-sm text-gray-400'>New Alert</div>
									<div className='text-2xl font-bold'>256</div>
								</div>
								<div className='bg-primary/20 p-2 rounded-2xl'>
									<Bell
										size={20}
										className='text-white'
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Map or Scan */}
					<div className='component-bg rounded-2xl p-4 mb-6'>
						<h2 className='text-lg font-bold mb-2'>
							{showScan ? 'Scan' : 'Map'}
						</h2>
						<div className='bg-gray-800/50 w-full h-96 rounded-2xl overflow-hidden'>
							{showScan ? (
								<div className='flex w-full h-full'>
									<div className='w-1/2 p-4 border-r border-gray-700/30 flex flex-col'>
										<div className='bg-gray-700/30 w-full h-full rounded-xl flex items-center justify-center overflow-hidden relative'>
											<video
												ref={videoRef}
												autoPlay
												playsInline
												className='w-full h-full object-cover'
											/>
											<button
												className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2'
												onClick={captureImage}
											>
												<Camera size={16} />
												Scan
											</button>
										</div>
									</div>
									<div className='w-1/2 p-4 flex flex-col'>
										<div className='bg-gray-700/30 w-full h-1/2 rounded-xl mb-4 overflow-hidden flex items-center justify-center'>
											{capturedImage ? (
												<img
													src={capturedImage}
													alt='Captured image'
													className='w-full h-full object-contain'
												/>
											) : (
												<div className='text-gray-400 text-sm'>
													No image captured
												</div>
											)}
										</div>
										<div className='bg-gray-700/30 w-full h-1/2 rounded-xl flex flex-col items-center justify-center p-4'>
											{isAnalyzing ? (
												<div className='flex flex-col items-center'>
													<Loader
														size={40}
														className='animate-spin mb-2'
													/>
													<span className='text-gray-300'>Analyzing...</span>
												</div>
											) : scanResult ? (
												<div className='flex flex-col items-center'>
													<h3
														className={`text-xl font-bold mb-2 flex items-center gap-2 ${
															scanResult.isLegal
																? 'text-green-400'
																: 'text-red-500'
														}`}
													>
														{scanResult.isLegal ? (
															<>
																<CheckCircle size={24} />
																Legal Tower
															</>
														) : (
															<>
																<XCircle size={24} />
																Illegal Tower
															</>
														)}
													</h3>
													<div className='text-sm text-center max-w-xs'>
														{scanResult.isLegal
															? 'This tower has been verified and is registered in our database.'
															: 'This tower is not registered in our database and might be used for illegal activities.'}
													</div>
												</div>
											) : capturedImage ? (
												<div className='text-gray-400 text-sm'>
													Click Scan to analyze this image
												</div>
											) : (
												<div className='text-gray-400 text-sm'>
													Capture an image first
												</div>
											)}
										</div>
									</div>
								</div>
							) : (
								<Map />
							)}
						</div>
					</div>

					{/* Bottom Section: Risk Locations and Anomaly Trends */}
					<div className='grid grid-cols-3 gap-4'>
						<div className='component-bg rounded-2xl p-4 col-span-2 relative'>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='text-lg font-bold'>High-Risk Locations List</h2>
								<button className='text-gray-400 absolute right-5 top-5'>
									<Settings size={16} />
								</button>
							</div>

							<table className='w-full text-sm'>
								<thead>
									<tr className='text-gray-400 text-left'>
										<th className='pb-2'>LOCATION</th>
										<th className='pb-2'>RISK SCORE</th>
										<th className='pb-2'>NUMBER of ILLEGAL TOWERS</th>
										<th className='pb-2'>LAST DETECTION TIME</th>
									</tr>
								</thead>
								<tbody>
									<tr className='border-t border-gray-700/30'>
										<td className='py-3 flex items-center gap-2'>
											<span className='w-2 h-2 rounded-full bg-red-500'></span>
											North Jakarta
										</td>
										<td>141</td>
										<td>141</td>
										<td>2025-05-09T21:30:00Z</td>
									</tr>
									<tr className='border-t border-gray-700/30'>
										<td className='py-3 flex items-center gap-2'>
											<span className='w-2 h-2 rounded-full bg-red-500'></span>
											East Jakarta
										</td>
										<td>141</td>
										<td>135</td>
										<td>2025-05-09T20:40:00Z</td>
									</tr>
									<tr className='border-t border-gray-700/30'>
										<td className='py-3 flex items-center gap-2'>
											<span className='w-2 h-2 rounded-full bg-orange-500'></span>
											Temanggung
										</td>
										<td>141</td>
										<td>123</td>
										<td>2025-05-09T17:30:00Z</td>
									</tr>
									<tr className='border-t border-gray-700/30'>
										<td className='py-3 flex items-center gap-2'>
											<span className='w-2 h-2 rounded-full bg-orange-500'></span>
											Surabaya
										</td>
										<td>141</td>
										<td>110</td>
										<td>2025-05-09T15:30:00Z</td>
									</tr>
									<tr className='border-t border-gray-700/30'>
										<td className='py-3 flex items-center gap-2'>
											<span className='w-2 h-2 rounded-full bg-orange-500'></span>
											Bekasi
										</td>
										<td>141</td>
										<td>89</td>
										<td>2025-05-09T08:30:00Z</td>
									</tr>
									<tr className='border-t border-gray-700/30'>
										<td className='py-3 flex items-center gap-2'>
											<span className='w-2 h-2 rounded-full bg-yellow-500'></span>
											Batam
										</td>
										<td>141</td>
										<td>67</td>
										<td>2025-05-09T06:30:00Z</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div className='component-bg rounded-2xl p-4'>
							<h2 className='text-lg font-bold mb-4'>Anomaly Trends</h2>
							<div className='bg-gray-800/50 w-full h-[250px] rounded-2xl'>
								<AnomalyChart />
							</div>
							<div className='mt-3 flex justify-between items-center text-xs'>
								<span className='text-gray-400'>Last 3 days</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
