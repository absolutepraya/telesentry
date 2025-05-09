/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
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
} from 'lucide-react';
import Map from './components/Map';

export default function Home() {
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
									<div className='text-sm text-gray-400'>
										Average of Anomaly Rate
									</div>
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

					{/* Map */}
					<div className='component-bg rounded-2xl p-4 mb-6'>
						<h2 className='text-lg font-bold mb-2'>Map</h2>
						<div className='bg-gray-800/50 w-full h-96 rounded-2xl overflow-hidden'>
							<Map />
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
							<div className='bg-gray-800/50 w-full h-[250px] rounded-2xl flex items-center justify-center'>
								{/* Chart placeholder */}
								<span className='text-gray-500'>
									Chart will be implemented later
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
