import { create } from 'zustand'

export const CARS = [
  { id: 'redeye', name: '2021 Dodge Charger SRT Hellcat Redeye', file: '2021_dodge_charger_srt_hellcat_redeye.glb' },
  { id: 'e63', name: '2018 Mercedes-Benz E63 AMG S Wagon', file: '2018_mercedes_benz_e63_amg_s_wagon.glb' },
  { id: 'hellcat', name: '2015 Dodge Charger SRT Hellcat', file: '2015_dodge_charger_srt_hellcat.glb' },
  { id: 'rt69', name: '1969 Dodge Charger RT', file: '1969_dodge_charger_rt.glb' },
  { id: 'm5', name: '2022 BMW M5 CS', file: '2022_bmw_m5_cs.glb' },
]

export const useCarStore = create((set) => ({
  selectedCar: CARS[0],
  bodyColor: '#c8102e',
  wheelColor: '#1a1a1a',
  glassColor: '#1a1a1a',
  glassOpacity: 0.85,
  clearcoatEnabled: true,
  clearcoatIntensity: 1,

  setSelectedCar: (car) => set({ selectedCar: car }),
  setBodyColor: (color) => set({ bodyColor: color }),
  setWheelColor: (color) => set({ wheelColor: color }),
  setGlassColor: (color) => set({ glassColor: color }),
  setGlassOpacity: (val) => set({ glassOpacity: val }),
  setClearcoatEnabled: (val) => set({ clearcoatEnabled: val }),
  setClearcoatIntensity: (val) => set({ clearcoatIntensity: val }),
}))