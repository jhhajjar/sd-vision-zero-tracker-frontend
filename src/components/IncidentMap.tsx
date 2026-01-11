import React, { useEffect, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import { Incident } from "../services/incidentService";

interface IncidentMapProps {
  incidents: Incident[];
  hoveredIncidentId: string | null;
  onMarkerHover: (reportId: string | null) => void;
}

// San Diego center coordinates
const SAN_DIEGO_CENTER = { lat: 32.7157, lng: -117.1611 };
const DEFAULT_ZOOM = 11;

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  hoveredIncidentId,
  onMarkerHover,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const createMarkerElement = useCallback(
    (incident: Incident, isHovered: boolean): HTMLElement => {
      const div = document.createElement("div");
      const size = isHovered ? 24 : 16;
      const color = incident.killed > 0 ? "#dc3545" : "#ffc107"; // Red for fatalities, yellow for injuries

      div.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        cursor: pointer;
      `;

      return div;
    },
    []
  );

  const createInfoWindowContent = useCallback((incident: Incident): string => {
    return `
      <div style="padding: 8px; max-width: 250px;">
        <h4 style="margin: 0 0 8px 0; color: #333;">${incident.full_address}</h4>
        <p style="margin: 4px 0; color: #666;"><strong>Date:</strong> ${incident.date_time}</p>
        <p style="margin: 4px 0; color: #666;"><strong>Charge:</strong> ${incident.charge_desc || "N/A"}</p>
        <p style="margin: 4px 0; color: #666;"><strong>Injured:</strong> ${incident.injured}</p>
        <p style="margin: 4px 0; color: ${incident.killed > 0 ? "#dc3545" : "#666"};"><strong>Killed:</strong> ${incident.killed}</p>
      </div>
    `;
  }, []);

  // Initialize map
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const initMap = async (): Promise<void> => {
      if (!mapContainerRef.current || mapRef.current) return;

      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      mapRef.current = new Map(mapContainerRef.current, {
        center: SAN_DIEGO_CENTER,
        zoom: DEFAULT_ZOOM,
        mapId: "INCIDENT_MAP_ID",
        mapTypeControl: false,
      });
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,marker&v=weekly`;
      script.async = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  // Update markers when incidents change
  useEffect(() => {
    const updateMarkers = async (): Promise<void> => {
      if (!mapRef.current) return;

      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      // Clear existing markers
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current.clear();

      // Create info window if not exists
      if (!infoWindowRef.current) {
        infoWindowRef.current = new google.maps.InfoWindow();
      }

      // Add markers for incidents with valid coordinates
      incidents.forEach((incident) => {
        if (incident.latitude === null || incident.longitude === null) return;

        const isHovered = incident.report_id === hoveredIncidentId;
        const markerContent = createMarkerElement(incident, isHovered);

        const marker = new AdvancedMarkerElement({
          map: mapRef.current,
          position: { lat: incident.latitude, lng: incident.longitude },
          title: incident.full_address,
          content: markerContent,
        });

        // Click handler for info window
        marker.addListener("click", () => {
          const infoContent = createInfoWindowContent(incident);
          infoWindowRef.current?.setContent(infoContent);
          infoWindowRef.current?.open(mapRef.current, marker);
        });

        // Hover handlers
        const markerElement = marker.element;
        if (markerElement) {
          markerElement.addEventListener("mouseenter", () =>
            onMarkerHover(incident.report_id)
          );
          markerElement.addEventListener("mouseleave", () =>
            onMarkerHover(null)
          );
        }

        markersRef.current.set(incident.report_id, marker);
      });
    };

    updateMarkers();
  }, [incidents, createMarkerElement, createInfoWindowContent, onMarkerHover, hoveredIncidentId]);

  // Update marker size on hover state change
  useEffect(() => {
    markersRef.current.forEach((marker, reportId) => {
      const incident = incidents.find((i) => i.report_id === reportId);
      if (!incident) return;

      const isHovered = reportId === hoveredIncidentId;
      marker.content = createMarkerElement(incident, isHovered);
    });
  }, [hoveredIncidentId, incidents, createMarkerElement]);

  return (
    <Box
      ref={mapContainerRef}
      sx={{
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "20px",
      }}
    />
  );
};

export default IncidentMap;
