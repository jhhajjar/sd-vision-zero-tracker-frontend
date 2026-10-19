import { Box, FormControl, InputLabel, MenuItem, Select, SxProps, Theme, Typography } from "@mui/material"
import { ALL } from "../utils/constants"

interface FilterBarProps {
  neighborhood: string
  setNeighborhoodFilter: (hood: string | undefined) => void
  severity: string
  setSeverityFilter: (sev: string | undefined) => void
  incidentTableLoading: boolean
}

export const NEIGHBORHOOD_OPTIONS = [
  ALL,
  "South San Diego",
  "Point Loma",
  "Coastal",
  "Central Suburbs",
  "East San Diego",
  "Northern Suburbs",
  "Mid-City",
  "Navajo Communities",
  "Urban Core",
]

const SELECT_SX: SxProps<Theme> = {
  color: '#fff',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
  '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
  '& .MuiSelect-icon': { color: '#fff' },
}

export const SEVERITY_OPTIONS = [
  ALL,
  "Light",
  "Serious",
  "Fatal"
]

export const FilterBar: React.FC<FilterBarProps> = (props: FilterBarProps) => {
  const { neighborhood, setNeighborhoodFilter, severity, setSeverityFilter, incidentTableLoading } = props

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "24px", color: '#fff' }}>
          Filter
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <FormControl sx={{ m: 1, minWidth: 200, color: '#fff' }} size="small">
            <InputLabel sx={{ color: '#fff' }}>Severity</InputLabel>
            <Select
              value={severity}
              label="Severity"
              onChange={(event) => setSeverityFilter(event?.target?.value?.toLowerCase())}
              sx={SELECT_SX}
              disabled={incidentTableLoading}
              >
              {SEVERITY_OPTIONS.map(val => {
                return (
                  <MenuItem value={val}>
                    {val}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200, color: '#fff' }} size="small">
            <InputLabel sx={{ color: '#fff' }}>Neighborhood</InputLabel>
            <Select
              value={neighborhood}
              label="Neighborhood"
              onChange={(event) => setNeighborhoodFilter(event?.target?.value)}
              sx={SELECT_SX}
              disabled={incidentTableLoading}
              >
              {NEIGHBORHOOD_OPTIONS.map(neighborhood => {
                return (
                  <MenuItem value={neighborhood}>
                    {neighborhood}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  )
}