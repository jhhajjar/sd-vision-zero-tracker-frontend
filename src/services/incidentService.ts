import axios from "axios";

export type Incident = {
    report_id: string,
    date_time: string,
    full_address: string,
    charge_desc: string,
    injured: number,
    killed: number,
    latitude: number | null,
    longitude: number | null,
}

export type IncidentListDTO = {
    incidents: Incident[],
    page: number,
    pageSize: number,
    totalIncidents: number
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

export type IncidentFilter = {
    neighborhood?: string
}

export async function fetchIncidents(filter: IncidentFilter, page: number, pageSize: number): Promise<IncidentListDTO> {
    const { neighborhood } = filter
    const params: Record<string, string | number> = { page, pageSize }
    // "All" means no neighborhood filter
    if (neighborhood && neighborhood !== 'All') {
        params.filter = JSON.stringify({ neighborhoods: [neighborhood] })
    }
    const response = await axios.get<IncidentListDTO>(`${API_BASE_URL}/incidents`, { params });
    return response.data;
};

export async function fetchIncidentMetadata(): Promise<IncidentListDTO> {
    const response = await axios.get(`${API_BASE_URL}/incidents/metadata`);
    return response.data;
}