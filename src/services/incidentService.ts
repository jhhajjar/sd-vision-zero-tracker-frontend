import axios from "axios";

export type Incident = {
    report_id: string,
    date_time: string,
    full_address: string,
    charge_desc: string,
    injured: number,
    killed: number,
}

export type IncidentListDTO = {
    incidents: Incident[],
    page: number,
    pageSize: number,
    totalIncidents: number
}
// Users should be able to zoom into map, see multiple pins at once, click on pin to see incident details

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

export async function fetchIncidents(page: number, pageSize: number): Promise<IncidentListDTO[]> {
    const response = await axios.get(`${API_BASE_URL}/incidents?page=${page}&pageSize=${pageSize}`);
    return response.data;
};

export async function fetchIncidentMetadata(): Promise<IncidentListDTO> {
    const response = await axios.get(`${API_BASE_URL}/incidents/metadata`);
    return response.data;
}