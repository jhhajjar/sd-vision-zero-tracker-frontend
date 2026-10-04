import React, { useEffect, useRef, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import { Incident } from "../services/incidentService";
import { createInfoWindowContent } from "../utils/markerPopUp";

interface IncidentMapProps {
  incidents: Incident[];
  hoveredIncidentId: string | null;
  onMarkerHover: (reportId: string | null) => void;
  clickedIncidentId: string | null;
  setClickedIncidentId: (reportId: string | null) => void;
}

// San Diego center coordinates
const SAN_DIEGO_CENTER = { lat: 32.7157, lng: -117.1611 };
const DEFAULT_ZOOM = 11;

// Track script loading globally to prevent duplicate loads
let googleMapsScriptLoading = false;
let googleMapsScriptLoaded = false;

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (googleMapsScriptLoaded && window.google?.maps) {
      resolve();
      return;
    }

    if (googleMapsScriptLoading) {
      // Wait for existing script to load
      const checkLoaded = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
      return;
    }

    googleMapsScriptLoading = true;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,marker&v=weekly`;
    script.async = true;
    script.onload = () => {
      googleMapsScriptLoaded = true;
      googleMapsScriptLoading = false;
      resolve();
    };
    script.onerror = () => {
      googleMapsScriptLoading = false;
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });
};

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  hoveredIncidentId,
  onMarkerHover,
  clickedIncidentId,
  setClickedIncidentId,
}) => {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const getMarkerIcon = useCallback(
    (incident: Incident, isHovered: boolean): google.maps.Symbol => {
      const size = isHovered ? 16 : 8;
      const color = incident.killed > 0 ? "#dc3545" : "#ffc107";

      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2,
        scale: size,
      };
    },
    []
  );

  // Initialize map
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("VITE_GOOGLE_MAPS_API_KEY is not set");
      return;
    }

    let mounted = true;

    const initMap = async (): Promise<void> => {
      try {
        await loadGoogleMapsScript(apiKey);

        if (!mounted || !mapContainerRef.current) return;
        if (mapRef.current) {
          setMapReady(true);
          return;
        }

        const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

        if (!mounted || !mapContainerRef.current) return;

        mapRef.current = new Map(mapContainerRef.current, {
          center: SAN_DIEGO_CENTER,
          zoom: DEFAULT_ZOOM,
          mapTypeControl: false,
        });

        // Wait for map to be idle before marking as ready
        google.maps.event.addListenerOnce(mapRef.current, "idle", () => {
          if (mounted) {
            setMapReady(true);
          }
        });
      } catch (error) {
        console.error("Failed to initialize map:", error);
      }
    };

    initMap();

    return () => {
      mounted = false;
    };
  }, []);

  // Update markers when incidents change (only after map is ready)
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current.clear();

    // Create info window if not exists
    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
      // Reset clicked state when the user closes the window so the same incident can be re-selected
      infoWindowRef.current.addListener("closeclick", () => {
        setClickedIncidentId(null);
      });
    }

    // Add markers for incidents with valid coordinates
    incidents?.forEach((incident) => {
      if (incident.latitude !== null && incident.longitude !== null) {

        const marker = new google.maps.Marker({
          map: mapRef.current,
          position: { lat: incident.latitude, lng: incident.longitude },
          title: incident.full_address,
          icon: getMarkerIcon(incident, false),
        });

        // Click handler - info window is opened by the clickedIncidentId effect
        marker.addListener("click", () => {
          setClickedIncidentId(incident.report_id);
        });

        // Hover handlers
        marker.addListener("mouseover", () => {
          onMarkerHover(incident.report_id);
        });
        marker.addListener("mouseout", () => {
          onMarkerHover(null);
        });

        markersRef.current.set(incident.report_id, marker);
      }
    });
  }, [mapReady, incidents, getMarkerIcon, onMarkerHover, setClickedIncidentId]);

  // Update marker size on hover state change (separate from marker creation)
  useEffect(() => {
    if (!mapReady) return;

    markersRef.current.forEach((marker, reportId) => {
      const incident = incidents.find((i) => i.report_id === reportId);
      if (!incident) return;

      const isHovered = reportId === hoveredIncidentId;
      marker.setIcon(getMarkerIcon(incident, isHovered));
    });
  }, [mapReady, hoveredIncidentId, incidents, getMarkerIcon]);

  // Open the info window for the clicked incident (from a marker or a table row)
  useEffect(() => {
    if (!mapReady || !infoWindowRef.current) return;

    const incident: Incident | undefined = incidents?.find((i) => i.report_id === clickedIncidentId);
    const marker: google.maps.Marker | undefined = clickedIncidentId
      ? markersRef.current.get(clickedIncidentId)
      : undefined;

    if (!incident || !marker) {
      infoWindowRef.current.close();
      return;
    }

    infoWindowRef.current.setContent(createInfoWindowContent(incident));
    infoWindowRef.current.open(mapRef.current, marker);
  }, [mapReady, clickedIncidentId, incidents]);

  return (
    <Box
      ref={mapContainerRef}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
};

export default IncidentMap;
