'use client';

import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { RadioTower } from 'lucide-react';

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
}

export default function Map() {
	const [markers, setMarkers] = useState<TowerLocation[]>([]);
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [selectedMarker, setSelectedMarker] = useState<TowerLocation | null>(
		null
	);

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

	// Search for "menara bts" and place markers when map is ready
	useEffect(() => {
		if (map && isLoaded) {
			const placesService = new google.maps.places.PlacesService(map);

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
							name: place.name,
							address: place.formatted_address,
						}));
						setMarkers(locations);

						// If we have results, fit the map to show all markers
						if (locations.length > 0) {
							const bounds = new google.maps.LatLngBounds();
							locations.forEach((location) => {
								bounds.extend(
									new google.maps.LatLng(location.lat, location.lng)
								);
							});
							map.fitBounds(bounds);
						}
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

	return (
		<div className='relative w-full h-full'>
			{/* Side panel that appears when a marker is clicked */}
			{selectedMarker && (
				<div className='absolute left-2 top-2 z-10 component-bg w-80 h-[90%] overflow-auto p-4 rounded-2xl'>
					<div className='flex justify-between items-center mb-4'>
						<h3 className='text-lg font-bold'>Tower Details</h3>
						<button
							onClick={closeSidePanel}
							className='text-gray-400 hover:text-white'
						>
							×
						</button>
					</div>

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
							<div className='w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center shadow-lg'>
								<RadioTower
									className='text-green-400'
									size={20}
								/>
							</div>
						</div>
					</OverlayView>
				))}
			</GoogleMap>
		</div>
	);
}
