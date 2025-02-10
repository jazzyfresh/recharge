import React from 'react';
import { connect, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

import { useAppSelector, useAppDispatch } from '../../app/hooks.ts';
import {
  selectLatitude,
  selectLongitude,
  selectZoom,
  selectChargers,
  getChargers,
} from './chargerSlice.ts';

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function ChargerMap() {
  const latitude = useAppSelector(selectLatitude);
  const longitude = useAppSelector(selectLongitude);
  const zoom = useAppSelector(selectZoom);
  const chargers = useAppSelector(selectChargers);
  const dispatch = useAppDispatch();

  const center = [latitude, longitude];

  return (
    <div id="mapid">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-[800px]">
        <ChangeView center={center} zoom={zoom} /> 
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {chargers && chargers.fuel_stations && chargers.fuel_stations.map((charger) => {
            return (
              <Marker key={charger.id} position={[charger.latitude, charger.longitude]}>
                <Popup>
                  <b>{charger.station_name}</b><br />
                  ID: {charger.id}<br />
                  {charger.station_phone}<br />
                  {charger.ev_network}
                </Popup>
              </Marker>
            )
        })}
      </MapContainer>
    </div>
)};
