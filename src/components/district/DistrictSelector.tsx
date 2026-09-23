import { DISTRICTS } from '../../data'

interface DistrictSelectorProps {
  id: string
  value: string | null
  onChange: (districtId: string | null) => void
}

function DistrictSelector({ id, value, onChange }: DistrictSelectorProps) {
  const selectedDistrict = DISTRICTS.find((district) => district.id === value)

  return (
    <div className="district-selector">
      <label htmlFor={id}>Район</label>
      <select
        id={id}
        value={value ?? ''}
        aria-invalid={value === null}
        onChange={(event) => onChange(event.target.value || null)}
      >
        <option value="">Выберите район</option>
        {DISTRICTS.map((district) => (
          <option key={district.id} value={district.id}>
            {district.name}
          </option>
        ))}
      </select>
      {selectedDistrict && <p className="district-selector__profile">{selectedDistrict.profile}</p>}
    </div>
  )
}

export default DistrictSelector
