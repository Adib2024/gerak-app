import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';

export const MapLibre: React.FC = () => {
  const { activeRide } = useApp();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const driverMarker = useRef<maplibregl.Marker | null>(null);

  // Initialise map once
  useEffect(() => {
    if (!mapContainer.current) return;
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current as HTMLElement,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // free style
      center: [101.6869, 3.1390], // generic campus centre
      zoom: 15,
    });
    mapRef.current.addControl(new maplibregl.NavigationControl());
    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Update map when a ride is active
  useEffect(() => {
    if (!activeRide || !mapRef.current) return;
    const { pickup, destination } = activeRide;
    const landmarkCoords: Record<string, [number, number]> = {
      'Kolej Kediaman Pertama (KK1)': [101.6835, 3.1398],
      'Kolej Kediaman Ketiga (KK3)': [101.6820, 3.1382],
      'Fakulti Sains Komputer & Teknologi Maklumat': [101.6870, 3.1405],
      'Dewan Peperiksaan Utama': [101.6895, 3.1370],
      'Perpustakaan Sentral': [101.6880, 3.1385],
      'Pusat Sukan': [101.6845, 3.1365],
    };
    const start = landmarkCoords[pickup];
    const end = landmarkCoords[destination];
    if (!start || !end) return;
    const bounds = new maplibregl.LngLatBounds();
    bounds.extend(start as any);
    bounds.extend(end as any);
    mapRef.current.fitBounds(bounds, { padding: 40, maxZoom: 17 });

    // Route line
    const routeId = 'route-source';
    const routeData = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [start, end] },
    } as any;
    if (mapRef.current.getSource(routeId)) {
      (mapRef.current.getSource(routeId) as any).setData(routeData);
    } else {
      mapRef.current.addSource(routeId, { type: 'geojson', data: routeData });
      mapRef.current.addLayer({
        id: 'route-layer',
        type: 'line',
        source: routeId,
        paint: { 'line-color': '#10B981', 'line-width': 4, 'line-opacity': 0.8 },
      });
    }

    // Pins for pickup and destination
    const pinEl = (color: string) => {
      const el = document.createElement('div');
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.background = color;
      el.style.border = '2px solid white';
      return el;
    };
    new maplibregl.Marker({ element: pinEl('#3B82F6') }).setLngLat(start as any).addTo(mapRef.current);
    new maplibregl.Marker({ element: pinEl('#EF4444') }).setLngLat(end as any).addTo(mapRef.current);

    try {
      const channel = supabase
        .channel('public:locations')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'locations' }, (payload: any) => {
          const { latitude, longitude } = payload.new as any;
          if (driverMarker.current) {
            driverMarker.current.setLngLat([longitude, latitude]);
          } else {
            driverMarker.current = new maplibregl.Marker({ element: pinEl('#FBBF24') })
              .setLngLat([longitude, latitude])
              .addTo(mapRef.current!);
          }
        })
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
        driverMarker.current?.remove();
        driverMarker.current = null;
        if (mapRef.current?.getLayer('route-layer')) mapRef.current.removeLayer('route-layer');
        if (mapRef.current?.getSource(routeId)) mapRef.current.removeSource(routeId);
      };
    } catch (e) {
      console.error('Supabase realtime error:', e);
      return undefined;
    }
  }, [activeRide]);

  return <div ref={mapContainer} className="w-full h-[360px] rounded-2xl overflow-hidden border border-slate-100" />;
};
