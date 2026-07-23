import {
  PerformanceSpecs,
  BatterySpecs,
  DimensionSpecs,
  InteriorSpecs,
  SafetySpecs,
  WheelSpecs,
  FeatureSpecs,
} from "@prisma/client";

export interface UpsertSpecificationsPayload {
  sub_variant_id: string;
  performance?: PerformanceSpecs;
  battery?: BatterySpecs;
  dimensions?: DimensionSpecs;
  interior?: InteriorSpecs;
  safety?: SafetySpecs;
  wheels?: WheelSpecs;
  features?: FeatureSpecs;
}

export interface UpdateSpecificationsPayload {
  performance?: PerformanceSpecs;
  battery?: BatterySpecs;
  dimensions?: DimensionSpecs;
  interior?: InteriorSpecs;
  safety?: SafetySpecs;
  wheels?: WheelSpecs;
  features?: FeatureSpecs;
}
