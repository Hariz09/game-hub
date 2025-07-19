// types/coffee.ts
export interface GameConfig {
  SAVE_INTERVAL: number;
  TICK_RATE: number;
  OFFLINE_HOURS_CAP: number;
  PRESTIGE_THRESHOLD: number;
}

export interface Equipment {
  name: string;
  baseProduction: number;
  baseCost: number;
  costMultiplier: number;
  icon: string;
  description: string;
}

export interface Upgrade {
  name: string;
  description: string;
  cost: number;
  effect: string;
}

export interface EquipmentLevels {
  manualGrinder: number;
  dripCoffee: number;
  espressoMachine: number;
  frenchPress: number;
  coldBrew: number;
  roaster: number;
  plantation: number;
}

export type EquipmentKey = keyof EquipmentLevels;
export type UpgradeKey = 'clickPower' | 'autoClicker' | 'efficiency' | 'speedBoost';

export interface GameState {
  coffeeBeans: number;
  totalCoffeeProduced: number;
  prestigePoints: number;
  prestigeLevel: number;
  clickPower: number;
  equipment: EquipmentLevels;
  upgrades: UpgradeKey[];
  lastSave: number;
  isAuthenticated: boolean;
  username: string | null;
}

export interface GameStats {
  beansPerSecond: number;
  totalValue: number;
}