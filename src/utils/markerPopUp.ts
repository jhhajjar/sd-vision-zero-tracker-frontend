import { Incident } from "../services/incidentService";

export const createInfoWindowContent = (incident: Incident): string => {
  return `
    <div style="padding: 8px; max-width: 250px;">
      <h4 style="margin: 0 0 8px 0; color: #333;">${incident.full_address}</h4>
      <p style="margin: 4px 0; color: #666;"><strong>Date:</strong> ${incident.date_time}</p>
      <p style="margin: 4px 0; color: #666;"><strong>Charge:</strong> ${incident.charge_desc || "N/A"}</p>
      <p style="margin: 4px 0; color: #666;"><strong>Injured:</strong> ${incident.injured}</p>
      <p style="margin: 4px 0; color: ${incident.killed > 0 ? "#dc3545" : "#666"};"><strong>Killed:</strong> ${incident.killed}</p>
    </div>
  `;
}