// lib/coffee.ts
import { GameConfig, Equipment, Upgrade, EquipmentKey, UpgradeKey } from '@/types/coffee';

// Game configuration
export const GAME_CONFIG: GameConfig = {
  SAVE_INTERVAL: 5000, // Save every 5 seconds
  TICK_RATE: 100, // Game updates every 100ms
  OFFLINE_HOURS_CAP: 24, // Max offline progress hours
  PRESTIGE_THRESHOLD: 1000000000, // 1 billion beans to prestige
};

// Equipment data
export const EQUIPMENT: Record<EquipmentKey, Equipment> = {
  manualGrinder: {
    name: 'Manual Grinder',
    baseProduction: 1,
    baseCost: 10,
    costMultiplier: 1.15,
    icon: '☕',
    description: 'Basic coffee grinding'
  },
  dripCoffee: {
    name: 'Drip Coffee Maker',
    baseProduction: 5,
    baseCost: 100,
    costMultiplier: 1.18,
    icon: '🫖',
    description: 'Automated drip brewing'
  },
  espressoMachine: {
    name: 'Espresso Machine',
    baseProduction: 25,
    baseCost: 1000,
    costMultiplier: 1.20,
    icon: '☕',
    description: 'High-pressure espresso'
  },
  frenchPress: {
    name: 'French Press',
    baseProduction: 100,
    baseCost: 10000,
    costMultiplier: 1.22,
    icon: '🫙',
    description: 'Immersion brewing method'
  },
  coldBrew: {
    name: 'Cold Brew Tower',
    baseProduction: 500,
    baseCost: 100000,
    costMultiplier: 1.25,
    icon: '🧊',
    description: 'Slow extraction process'
  },
  roaster: {
    name: 'Bean Roaster',
    baseProduction: 2500,
    baseCost: 1000000,
    costMultiplier: 1.28,
    icon: '🔥',
    description: 'Roasts beans from green to perfection'
  },
  plantation: {
    name: 'Coffee Plantation',
    baseProduction: 12500,
    baseCost: 10000000,
    costMultiplier: 1.30,
    icon: '🌱',
    description: 'Grows coffee beans from scratch'
  }
};

// Upgrades data
export const UPGRADES: Record<UpgradeKey, Upgrade> = {
  clickPower: {
    name: 'Stronger Clicks',
    description: 'Double your clicking power',
    cost: 1000,
    effect: 'Clicking produces 2x more beans'
  },
  autoClicker: {
    name: 'Auto Clicker',
    description: 'Automatically clicks once per second',
    cost: 50000,
    effect: 'Generates 1 bean per second from clicking'
  },
  efficiency: {
    name: 'Equipment Efficiency',
    description: 'All equipment 50% more efficient',
    cost: 500000,
    effect: 'All brewing equipment produces 1.5x more'
  },
  speedBoost: {
    name: 'Caffeine Rush',
    description: 'Everything runs 25% faster',
    cost: 5000000,
    effect: 'All production increased by 25%'
  }
};