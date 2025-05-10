'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AnomalyChart = () => {
	const chartRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!chartRef.current) return;

		const ctx = chartRef.current.getContext('2d');
		if (!ctx) return;

		// Destroy existing chart if it exists
		const chartInstance = Chart.getChart(chartRef.current);
		if (chartInstance) {
			chartInstance.destroy();
		}

		// Create gradient fills for the areas under the lines
		const gradient1 = ctx.createLinearGradient(0, 0, 0, 250);
		gradient1.addColorStop(0, 'rgba(100, 220, 255, 0.3)');
		gradient1.addColorStop(1, 'rgba(100, 220, 255, 0.0)');

		const gradient2 = ctx.createLinearGradient(0, 0, 0, 250);
		gradient2.addColorStop(0, 'rgba(70, 150, 255, 0.3)');
		gradient2.addColorStop(1, 'rgba(70, 150, 255, 0.0)');

		const gradient3 = ctx.createLinearGradient(0, 0, 0, 250);
		gradient3.addColorStop(0, 'rgba(140, 180, 255, 0.3)');
		gradient3.addColorStop(1, 'rgba(140, 180, 255, 0.0)');

		// Sample data - can be replaced with actual data
		const data = {
			labels: ['Mon', '', '', '', '', 'Tue', '', '', '', '', 'Wed'],
			datasets: [
				{
					label: 'Anomaly 1',
					data: [25, 10, 8, 15, 22, 12, 5, 15, 25, 40, 15],
					borderColor: 'rgb(100, 220, 255)',
					backgroundColor: gradient1,
					borderWidth: 2,
					tension: 0.4,
					fill: true,
				},
				{
					label: 'Anomaly 2',
					data: [10, 30, 15, 5, 10, 25, 5, 10, 15, 35, 5],
					borderColor: 'rgb(70, 150, 255)',
					backgroundColor: gradient2,
					borderWidth: 2,
					tension: 0.4,
					fill: true,
				},
				{
					label: 'Anomaly 3',
					data: [5, 18, 10, 12, 5, 17, 22, 8, 12, 18, 8],
					borderColor: 'rgb(140, 180, 255)',
					backgroundColor: gradient3,
					borderWidth: 2,
					tension: 0.4,
					fill: true,
				},
			],
		};

		new Chart(ctx, {
			type: 'line',
			data: data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						mode: 'index',
						intersect: false,
						backgroundColor: 'rgba(20, 30, 70, 0.9)',
						titleColor: '#fff',
						bodyColor: '#fff',
						borderColor: 'rgba(120, 150, 255, 0.5)',
						borderWidth: 1,
					},
				},
				scales: {
					x: {
						grid: {
							color: 'rgba(150, 150, 150, 0.1)',
							// drawBorder: false,
						},
						ticks: {
							color: 'rgba(200, 200, 200, 0.7)',
							padding: 10,
							font: {
								size: 12,
							},
						},
						border: {
							display: false,
						},
					},
					y: {
						min: 0,
						max: 40,
						grid: {
							color: 'rgba(150, 150, 150, 0.1)',
						},
						ticks: {
							color: 'rgba(200, 200, 200, 0.7)',
							stepSize: 10,
							padding: 10,
							font: {
								size: 12,
							},
							callback: function (value) {
								return value;
							},
						},
						border: {
							display: false,
						},
					},
				},
				elements: {
					point: {
						radius: 0,
						hoverRadius: 5,
					},
				},
				interaction: {
					mode: 'nearest',
					axis: 'x',
					intersect: false,
				},
			},
		});
	}, []);

	return (
		<div className='w-full h-full'>
			<canvas
				ref={chartRef}
				className='w-full h-full'
			></canvas>
		</div>
	);
};

export default AnomalyChart;
