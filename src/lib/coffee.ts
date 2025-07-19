// lib/coffee.ts
import { GameConfig, Equipment, Upgrade, EquipmentKey, UpgradeKey } from '@/types/coffee';

// Game configuration
export const GAME_CONFIG: GameConfig = {
  SAVE_INTERVAL: 5000, // Save every 5 seconds
  TICK_RATE: 100, // Game updates every 100ms
  OFFLINE_HOURS_CAP: 24, // Max offline progress hours
  PRESTIGE_THRESHOLD: 1000000000, // 1 billion beans to prestige
};

// Equipment data with iconify icons
export const EQUIPMENT: Record<EquipmentKey, Equipment> = {
  manualGrinder: {
    name: 'Manual Grinder',
    baseProduction: 1,
    baseCost: 10,
    costMultiplier: 1.15,
    icon: 'mdi:coffee-maker',
    description: 'Hand-cranked precision grinding for perfect extraction'
  },
  dripCoffee: {
    name: 'Drip Coffee Maker',
    baseProduction: 5,
    baseCost: 100,
    costMultiplier: 1.18,
    icon: 'mdi:coffee-maker',
    description: 'Automated drip brewing with consistent temperature control'
  },
  espressoMachine: {
    name: 'Espresso Machine',
    baseProduction: 25,
    baseCost: 1000,
    costMultiplier: 1.20,
    icon: 'mdi:coffee-maker',
    description: 'High-pressure extraction for intense flavor concentration'
  },
  frenchPress: {
    name: 'French Press',
    baseProduction: 100,
    baseCost: 10000,
    costMultiplier: 1.22,
    icon: 'mdi:coffee-maker',
    description: 'Full immersion brewing for rich, full-bodied coffee'
  },
  coldBrew: {
    name: 'Cold Brew Tower',
    baseProduction: 500,
    baseCost: 100000,
    costMultiplier: 1.25,
    icon: 'mdi:coffee-maker',
    description: 'Slow-drip extraction creating smooth, low-acid concentrate'
  },
  roaster: {
    name: 'Bean Roaster',
    baseProduction: 2500,
    baseCost: 1000000,
    costMultiplier: 1.28,
    icon: 'mdi:coffee-maker',
    description: 'Commercial roaster transforming green beans to aromatic perfection'
  },
  plantation: {
    name: 'Coffee Plantation',
    baseProduction: 12500,
    baseCost: 10000000,
    costMultiplier: 1.30,
    icon: 'mdi:coffee-maker',
    description: 'Sustainable coffee farm producing premium arabica beans'
  }
};

// Upgrades data with enhanced descriptions and proper multiplier values
export const UPGRADES: Record<UpgradeKey, Upgrade> = {
  clickPower: {
    name: 'Master Barista Training',
    description: 'Advanced techniques multiply your manual brewing efficiency by 20x',
    cost: 1000,
    effect: 'Manual clicks produce 20x more beans',
    multiplier: 20
  },
  autoClicker: {
    name: 'Industrial Brewing Assistant',
    description: 'Advanced AI-powered brewing system works at industrial scale',
    cost: 50000,
    effect: 'Automatically generates 100 beans per second',
    beansPerSecond: 100
  },
  efficiency: {
    name: 'Premium Equipment',
    description: 'Upgrade all equipment with professional-grade components',
    cost: 500000,
    effect: 'All brewing equipment produces 1.5x more beans',
    multiplier: 1.5
  },
  speedBoost: {
    name: 'Caffeine Overdrive',
    description: 'Pure caffeine energy supercharges all production processes',
    cost: 5000000,
    effect: 'All production increased by 80% across the board',
    multiplier: 1.8
  }
};