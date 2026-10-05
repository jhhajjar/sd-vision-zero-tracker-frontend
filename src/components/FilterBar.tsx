import { Box, FormControl, InputLabel,  MenuItem, Select, Typography } from "@mui/material"

interface FilterBarProps {
  neighborhood: string
  setNeighborhoodFilter: (hood: string | undefined) => void
  incidentTableLoading: boolean
}

export const NEIGHBORHOOD_OPTIONS = [
  "All",
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

export const FilterBar: React.FC<FilterBarProps> = (props: FilterBarProps) => {
  const { neighborhood, setNeighborhoodFilter, incidentTableLoading } = props

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
        <FormControl sx={{ m: 1, minWidth: 200, color: '#fff' }} size="small" >
          <InputLabel sx={{ color: '#fff' }}>Neighborhood</InputLabel>
          <Select
            value={neighborhood}
            label="Neighborhood"
            onChange={(event) => setNeighborhoodFilter(event?.target?.value)}
            sx={{ color: '#fff', borderColor: '#fff' }}
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
    </>
  )
}