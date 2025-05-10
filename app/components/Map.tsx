'use client';

import { useCallback, useEffect, useState, FormEvent } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { RadioTower, AlertCircle, MessageCircleWarning } from 'lucide-react';

// Map container style
const mapContainerStyle = {
	width: '100%',
	height: '100%',
	borderRadius: 'inherit',
};

// Style to hide all place labels
const mapStyles = [
	{
		featureType: 'all',
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi',
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'transit',
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
];

// Default center (Indonesia as default for "menara bts" search)
const defaultCenter = {
	lat: -6.2088,
	lng: 106.8456,
};

// Custom coordinates to search
const customCoordinates = [
	{
		lat: -6.232294132667354,
		lng: 106.77968962477121,
		anomalyData: {
			riskScore: 89,
			location: 'Kebayoran Lama, Jakarta Selatan',
			time: '2025-05-09T21:30:00Z',
			imsi: '****2435',
			mapMsgType: 'SendRoutingInfoForSM',
			anomalyScore: 0.92,
			nearestTower: {
				id: '5678',
				illegal: true,
				operator: 'Telkomcell',
				distance: 120,
			},
		},
	},
	{
		lat: -6.1194905670318525,
		lng: 106.79097616171859,
		anomalyData: {
			riskScore: 76,
			location: 'Pluit, Jakarta Utara',
			time: '2025-05-09T19:45:00Z',
			imsi: '****7842',
			mapMsgType: 'UpdateLocation',
			anomalyScore: 0.84,
			nearestTower: {
				id: '3421',
				illegal: false,
				operator: 'XL Axiata',
				distance: 85,
			},
		},
	},
];

// Map options
const mapOptions = {
	styles: mapStyles,
	disableDefaultUI: false,
	zoomControl: true,
	mapTypeControl: false,
	streetViewControl: false,
	fullscreenControl: false,
	mapTypeId: 'satellite',
};

interface TowerLocation {
	lat: number;
	lng: number;
	id?: string;
	type?: 'tower' | 'custom';
	name?: string;
	address?: string;
	anomalyData?: {
		riskScore: number;
		location: string;
		time: string;
		imsi: string;
		mapMsgType: string;
		anomalyScore: number;
		nearestTower: {
			id: string;
			illegal: boolean;
			operator: string;
			distance: number;
		};
	};
}

export default function Map() {
	const [markers, setMarkers] = useState<TowerLocation[]>([]);
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [selectedMarker, setSelectedMarker] = useState<TowerLocation | null>(
		null
	);
	const [searchInput, setSearchInput] = useState<string>('');

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
		libraries: ['places'],
	});

	// Save map reference when it loads
	const onLoad = useCallback((map: google.maps.Map) => {
		setMap(map);
	}, []);

	const onUnmount = useCallback(() => {
		setMap(null);
	}, []);

	// Handle marker click
	const handleMarkerClick = (marker: TowerLocation) => {
		setSelectedMarker(marker);
	};

	// Close side panel
	const closeSidePanel = () => {
		setSelectedMarker(null);
	};

	// Handle WhatsApp reporting
	const handleReport = (marker: TowerLocation) => {
		const phone = '628118465006'; // Phone number without "+"
		const lat = marker.lat.toFixed(6);
		const lng = marker.lng.toFixed(6);
		const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

		const message = `Laporan Illegal Base Transceiver Station:

Latitude: ${lat}
Longitude: ${lng}
Maps URL: ${mapsUrl}

Mohon segera diperiksa dan ditindaklanjuti. Terima kasih.`;

		const encodedMessage = encodeURIComponent(message);
		const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

		window.open(whatsappUrl, '_blank');
	};

	// Handle coordinate search
	const handleCoordinateSearch = (e: FormEvent) => {
		e.preventDefault();

		if (!map || !searchInput) return;

		// Try to parse coordinates
		const coordsRegex = /(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/;
		const match = searchInput.match(coordsRegex);

		if (match) {
			const lat = parseFloat(match[1]);
			const lng = parseFloat(match[2]);

			if (!isNaN(lat) && !isNaN(lng)) {
				// Create a new custom marker
				const customMarker: TowerLocation = {
					lat,
					lng,
					id: `custom-${Date.now()}`,
					type: 'custom',
					name: 'Custom Location',
					address: `${lat}, ${lng}`,
				};

				// Add to markers
				setMarkers((prev) => [...prev, customMarker]);

				// Pan to the location
				map.panTo({ lat, lng });
				map.setZoom(15);

				// Clear input
				setSearchInput('');
			}
		}
	};

	// Search for "menara bts" and place markers when map is ready
	useEffect(() => {
		if (map && isLoaded) {
			const placesService = new google.maps.places.PlacesService(map);

			// Add custom coordinate markers
			const customMarkers: TowerLocation[] = customCoordinates.map(
				(coords, index) => ({
					...coords,
					id: `custom-location-${index}`,
					type: 'custom',
					name: 'Custom Location',
					address: `${coords.lat}, ${coords.lng}`,
				})
			);

			// Search for menara bts
			placesService.textSearch(
				{
					query: 'menara bts',
					location: defaultCenter,
					radius: 50000,
				},
				(results, status) => {
					if (status === google.maps.places.PlacesServiceStatus.OK && results) {
						const locations = results.map((place, index) => ({
							lat: place.geometry?.location?.lat() || 0,
							lng: place.geometry?.location?.lng() || 0,
							id: `tower-${index}`,
							type: 'tower' as const,
							name: place.name,
							address: place.formatted_address,
						}));

						// Combine tower locations with custom markers
						setMarkers([...locations, ...customMarkers]);

						// If we have results, fit the map to show all markers
						if (locations.length > 0) {
							const bounds = new google.maps.LatLngBounds();
							// Add all tower locations to bounds
							locations.forEach((location) => {
								bounds.extend(
									new google.maps.LatLng(location.lat, location.lng)
								);
							});
							// Also add custom markers to bounds
							customMarkers.forEach((marker) => {
								bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
							});
							map.fitBounds(bounds);
						}
					} else {
						// If tower search fails, still show custom markers
						setMarkers(customMarkers);
						map.panTo(customCoordinates[0]);
						map.setZoom(15);
					}
				}
			);
		}
	}, [map, isLoaded]);

	if (loadError)
		return (
			<div className='component-bg rounded-2xl p-4 h-full flex items-center justify-center'>
				Error loading maps
			</div>
		);
	if (!isLoaded)
		return (
			<div className='component-bg rounded-2xl p-4 h-full flex items-center justify-center'>
				Loading maps...
			</div>
		);

	// Render anomaly detection panel for custom locations
	const renderAnomalyPanel = () => {
		if (!selectedMarker || !selectedMarker.anomalyData) return null;

		const { anomalyData } = selectedMarker;

		return (
			<div className='space-y-3 p-2'>
				<div className='flex items-center gap-2 text-red-600 font-bold text-lg'>
					<AlertCircle size={24} />
					<span>SS7 Anomaly Detected</span>
				</div>

				<button
					className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg mt-2 w-full justify-center'
					onClick={() => handleReport(selectedMarker)}
				>
					<MessageCircleWarning size={18} />
					<span>Report</span>
				</button>

				<div className='space-y-2 text-sm'>
					<p>Risk Score: {anomalyData.riskScore}/100</p>
					<p>Location: {anomalyData.location}</p>
					<p>Time: {anomalyData.time}</p>
				</div>

				<div className='space-y-2 text-sm mt-4'>
					<p>IMSI (masked): {anomalyData.imsi}</p>
					<p>MAP Msg Type: {anomalyData.mapMsgType}</p>
					<p>Anomaly Score: {anomalyData.anomalyScore}</p>
				</div>

				<div className='mt-4'>
					<p className='text-sm mb-1'>Nearest Tower:</p>
					<ul className='list-disc pl-8 space-y-1 text-sm'>
						<li>
							ID: {anomalyData.nearestTower.id}{' '}
							{anomalyData.nearestTower.illegal && (
								<span className='text-red-500'>(Illegal)</span>
							)}
						</li>
						<li>Operator: {anomalyData.nearestTower.operator}</li>
						<li>Distance: {anomalyData.nearestTower.distance} m</li>
					</ul>
				</div>
			</div>
		);
	};

	return (
		<div className='relative w-full h-full'>
			{/* Search input */}
			<div className='absolute top-2 right-2 z-10 p-2 component-bg rounded-lg'>
				<form
					onSubmit={handleCoordinateSearch}
					className='flex gap-2'
				>
					<input
						type='text'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder='Enter coordinates (lat, lng)'
						className='w-64 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg'
					/>
					<button
						type='submit'
						className='px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700'
					>
						Search
					</button>
				</form>
			</div>

			{/* Side panel that appears when a marker is clicked */}
			{selectedMarker && (
				<div className='absolute left-2 top-2 z-10 component-bg w-80 h-[90%] overflow-auto p-4 rounded-2xl'>
					<div className='flex justify-between items-center mb-4'>
						<h3 className='text-lg font-bold'>
							{selectedMarker.type === 'custom' ? '' : 'Tower Details'}
						</h3>
						<button
							onClick={closeSidePanel}
							className='text-gray-400 hover:text-white'
						>
							×
						</button>
					</div>

					{selectedMarker.type === 'custom' ? (
						// Show anomaly detection panel for custom locations
						<div
							className={`rounded-xl p-2 ${
								selectedMarker.anomalyData ? 'bg-red-200/20' : ''
							}`}
						>
							{renderAnomalyPanel()}
						</div>
					) : (
						// Show regular tower details for tower markers
						<div className='space-y-4'>
							<div>
								<p className='text-gray-400 text-sm'>ID</p>
								<p>{selectedMarker.id}</p>
							</div>
							<div>
								<p className='text-gray-400 text-sm'>Coordinates</p>
								<p>Lat: {selectedMarker.lat.toFixed(6)}</p>
								<p>Lng: {selectedMarker.lng.toFixed(6)}</p>
							</div>
							<div>
								<p className='text-gray-400 text-sm'>Status</p>
								<div className='flex items-center gap-2 mt-1'>
									<span className='w-2 h-2 rounded-full bg-green-400'></span>
									<span>Active</span>
								</div>
							</div>
							<div>
								<p className='text-gray-400 text-sm'>Signal Strength</p>
								<div className='w-full bg-gray-700 rounded-full h-2 mt-1'>
									<div
										className='bg-green-400 h-2 rounded-full'
										style={{ width: '85%' }}
									></div>
								</div>
								<p className='text-right text-xs mt-1'>85%</p>
							</div>
						</div>
					)}
				</div>
			)}

			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				center={defaultCenter}
				zoom={10}
				options={mapOptions}
				onLoad={onLoad}
				onUnmount={onUnmount}
			>
				{markers.map((marker) => (
					<OverlayView
						key={marker.id}
						position={{ lat: marker.lat, lng: marker.lng }}
						mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
					>
						<div
							className='relative cursor-pointer'
							onClick={() => handleMarkerClick(marker)}
						>
							{marker.type === 'custom' ? (
								<div className='relative flex items-center justify-center'>
									{/* Outer pulsating ring */}
									<span className='absolute w-12 h-12 rounded-full bg-red-500 animate-ping'></span>
									<span className='absolute w-4 h-4 rounded-full bg-red-700'></span>
								</div>
							) : (
								<div className='w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center shadow-lg'>
									<RadioTower
										className='text-green-400'
										size={20}
									/>
								</div>
							)}
						</div>
					</OverlayView>
				))}
			</GoogleMap>
		</div>
	);
}
