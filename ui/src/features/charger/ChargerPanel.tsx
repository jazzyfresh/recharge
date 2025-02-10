import react from 'react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';

import { useAppSelector, useAppDispatch } from '../../app/hooks.ts';
import {
  selectAddress,
  selectChargers,
  setAddress,
  getChargers,
} from './chargerSlice.ts';

export function ChargerSearchForm() {
  const address = useAppSelector(selectAddress);
  const dispatch = useAppDispatch();
	const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    dispatch(getChargers(address));
  }, []);

  const onSubmit = (data) => {
		console.log(data);
    dispatch(setAddress(data.address));
    dispatch(getChargers(data.address));
	};

  return (
		<form className="max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="address-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
        Charging Stations Near You
      </label>
			<div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-500" 
					id="address-search"
          type="search" 
					name="address"
					placeholder="3rd Street Promenade, Santa Monica, CA"
					{...register('address', { required: true })}
				/>
        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2">
          Search
        </button>
			</div>
      <div>
				{errors?.address && <p className="text-red-500 text-xs italic">Please enter an address to search</p>}
      </div>
    </form>
  )
};

export function ChargerFeedbackForm({ onClose }) {
	const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
		console.log(data);
    onClose();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="mb-4">
				<label className="block text-gray-700 font-medium mb-2" htmlFor="username">
					Username
				</label>
				<input
					className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
					id="username"
					type="text"
					name="username"
					placeholder="username"
					{...register('username', { required: true })}
				/>
				{errors?.username && <p className="text-red-500 text-xs italic">Username is required</p>}
			</div>
			<div className="mb-4">
				<label className="block text-gray-700 font-medium mb-2" htmlFor="chargerId">
					ChargerId
				</label>
				<input
					className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
					id="chargerId"
					type="number"
					name="chargerId"
					{...register('number', { required: true })}
				/>
				{errors?.chargerId && <p className="text-red-500 text-xs italic">chargerId is required</p>}
			</div>
			<div className="mb-4">
				<label className="block text-gray-700 font-medium mb-2" htmlFor="rating">
					Rating
				</label>
				<input
					className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
					id="rating"
					type="number"
					name="rating"
					{...register('number', { required: true })}
				/>
				{errors?.rating && <p className="text-red-500 text-xs italic">rating is required</p>}
			</div>
			<div className="mb-4">
				<label className="block text-gray-700 font-medium mb-2" htmlFor="description">
					Feedback
				</label>
				<input
					className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
					id="description"
					type="text"
					name="description"
					{...register('text', { required: true })}
				/>
				{errors?.description && <p className="text-red-500 text-xs italic">Feedback description is required</p>}
			</div>
      <div className="flex justify-between">
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
		</form>
	);
};

function ChargerDetail({ charger }) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    console.log(`favorite: ${charger.station_name}`);
    setIsFavorite(!isFavorite);
  }
  return (
    <div className="max-w-md mx-auto rounded overflow-hidden shadow-sm">
      <div className="px-6 py-4">
        <div className="flex justify-between">
          <div className="font-bold text-xl mb-2">{charger.station_name}</div>
          <button onClick={toggleFavorite}>
            <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:bg-purple-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </button>
        </div>
        <p className="text-gray-700 text-base">ID: {charger.id}</p>
        <p className="text-gray-700 text-base">{charger.station_phone}</p>
        <p className="text-gray-700 text-base">{charger.ev_network}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button className="inline-block bg-gray-200 hover:bg-purple-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 hover:text-gray-900 mr-2 mb-2"
          onClick={() => {
            setShowFeedbackForm(true);
            console.log(`feedback: ${charger.station_name}`);
          }}
        >
          Submit feedback
        </button>
        {showFeedbackForm && (
          <ChargerFeedbackForm onClose={() => setShowFeedbackForm(false)} />
        )}
      </div>
    </div>
  );
};

function ChargerList() {
  const address = useAppSelector(selectAddress);
  const chargers = useAppSelector(selectChargers);
  const dispatch = useAppDispatch();

  return (
    <div>
        {chargers && chargers.fuel_stations && chargers.fuel_stations.map((charger) => {
            return (
              <ChargerDetail key={`charger-detail-${charger.id}`} charger={charger} />
            )
        })}
    </div>
  );
};

export function ChargerPanel() {
  return (
    <div>
      <ChargerSearchForm />
      <ChargerList />
    </div>
  );
};

