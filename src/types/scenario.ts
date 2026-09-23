export interface Decision {
  measureId: string
  districtId: string | null
}

export interface ScenarioRequest {
  decisions: Decision[]
}
