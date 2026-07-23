# Vehicle Data Collection Prompt (for Gemini / ChatGPT / Claude)

Paste the prompt below into any capable LLM (Google Gemini, ChatGPT, Claude). Replace
`{{BRAND}}`, `{{MODEL}}`, and `{{MARKET/YEAR}}` with the vehicle you want. The model returns a
single JSON object matching the evinfo import shape: **Model → Variants → Sub-Variants →
(specifications, pricing, colors)**.

> Tip: ask for **one model at a time**. Models hallucinate less on a tight scope, and the JSON
> stays small enough to copy without truncation.

---

## THE PROMPT

```
You are an automotive data researcher. Return REAL, factual specifications for the vehicle
below. Output ONE valid JSON object ONLY — no markdown, no comments, no prose before or after.

VEHICLE: {{BRAND}} {{MODEL}}  (market/year: {{MARKET/YEAR}})

RULES
- Use only real, verifiable data for this exact market/year. If a value is unknown, use null
  (for text/number fields) or [] (for arrays). NEVER invent numbers.
- Every string enum MUST use one of the allowed values listed below — no synonyms.
- Numbers are plain numbers (no units, no commas): 4299000 not "₹42,99,000".
- Spec measurement fields are STRINGS WITH UNITS: "201 km/h", "75 kWh", "4720 mm".
- slug = lowercase, hyphenated, unique, e.g. "hyundai-creta-sx-petrol-mt".
- Create ONE sub_variant per real powertrain+transmission combo actually sold for that variant
  (e.g. "Petrol MT", "Petrol AT", "Diesel AT", "Long Range AWD").
- Colors live on the VARIANT (shared by its sub-variants), NOT on the sub-variant.
- Specifications + pricing live on the SUB-VARIANT.

ALLOWED ENUM VALUES
- fuel_type: "Petrol" | "Diesel" | "EV" | "Hybrid" | "CNG" | "PHEV"
- transmission: "Manual" | "Automatic" | "CVT" | "AMT" | "DCT"
- drivetrain: "FWD" | "RWD" | "AWD" | "4WD" | "4x4"
- variant.segment: "Budget" | "Mid" | "Premium" | "Luxury" | "A-Segment" | "B-Segment" | "C-Segment" | "D-Segment" | "E-Segment" | "F-Segment"
- variant.production_status: "in-production" | "discontinued" | "upcoming"
- color.type: "standard" | "metallic" | "pearlescent" | "matte" | "satin"
- status (model/variant/sub_variant): "active" | "discontinued" | "upcoming"
- safety.parking_sensors: "front" | "rear" | "both" | null
- safety.autonomous_level: "L0" | "L1" | "L2" | "L2+" | "L3" | "L4" | null
- wheels.wheel_type: "alloy" | "steel"
- wheels.spare: "full-size" | "stepney" | "none"

OUTPUT EXACTLY THIS SHAPE (fill real data; keep all keys):
{
  "slug": "",
  "name": "",
  "generation": null,
  "body_type": null,                // Sedan | SUV | Hatchback | Coupe | MPV | Crossover | Truck | Van
  "production_years": null,         // e.g. "2020–present"
  "platform": null,
  "description": null,
  "status": "active",
  "featured": false,
  "timeline": [
    { "year": 2020, "event": "", "description": null }
  ],
  "variants": [
    {
      "slug": "",
      "name": "",                   // trim name e.g. "SX", "ZX+", "Long Range"
      "trim": null,
      "launch_year": null,
      "production_status": "in-production",
      "segment": null,
      "description": null,
      "cover_image": null,          // leave null; images added later
      "competitor_ids": [],
      "status": "active",
      "featured": false,
      "colors": [
        {
          "name": "",
          "hex_code": "#000000",
          "image_url": null,
          "price_delta": 0,         // extra cost over base, 0 if included
          "type": "standard",
          "is_available": true
        }
      ],
      "sub_variants": [
        {
          "slug": "",
          "name": "",               // e.g. "Petrol MT", "Diesel AT"
          "fuel_type": "Petrol",
          "transmission": "Manual",
          "engine": null,           // e.g. "1.5L VTVT"
          "drivetrain": null,
          "status": "active",
          "ownership": {
            "warranty": null,
            "battery_warranty": null,      // EV/PHEV only
            "service_interval": null,
            "maintenance_cost": null,
            "roadside_assist": null,
            "service_centers": null
          },
          "specifications": {
            "performance": {
              "acceleration": null,        // "10.5s (0-100 km/h)"
              "top_speed": null,           // "170 km/h"
              "power": null,               // "115 hp"
              "torque": null,              // "144 Nm"
              "fuel_efficiency": null,     // "17 km/l" or "14.3 kWh/100km"
              "traction_control": null,
              "launch_control": null
            },
            "battery": {                   // EV/PHEV only, else all null
              "capacity": null,            // "75 kWh"
              "type": null,                // "Lithium-Ion (NMC)"
              "voltage": null,
              "range": null,               // "629 km (WLTP)"
              "range_city": null,
              "range_highway": null,
              "efficiency": null,
              "charging": {
                "ac": null,                // "11 kW"
                "dc": null,                // "170 kW"
                "time_10to80": null,       // "25 min"
                "time_0to100": null,
                "connector_type": null,    // "CCS2"
                "port_location": null
              }
            },
            "dimensions": {
              "length": null,              // "4720 mm"
              "width": null,
              "height": null,
              "wheelbase": null,
              "ground_clearance": null,
              "kerb_weight": null,         // "1830 kg"
              "gross_weight": null,
              "turning_radius": null,
              "boot_space": null,          // "433 L"
              "fuel_tank": null            // "50 L" (null for EV)
            },
            "interior": {
              "seating": null,             // number, e.g. 5
              "seating_material": null,
              "upholstery": null,
              "dashboard": null,
              "infotainment": null,
              "screen_size": null,
              "instrument_cluster": null,
              "headroom_front": null,
              "headroom_rear": null,
              "legroom_front": null,
              "legroom_rear": null,
              "cargo_volume": null,
              "cargo_max": null
            },
            "safety": {
              "ncap_rating": null,         // "5-Star Global NCAP"
              "airbags": null,             // number
              "abs": null,
              "ebd": null,
              "esc": null,
              "tcs": null,
              "blind_spot": null,
              "lane_assist": null,
              "adaptive_cruise": null,
              "parking_sensors": null,     // front | rear | both | null
              "reverse_camera": null,
              "camera_360": null,
              "autonomous_level": null
            },
            "wheels": {
              "front": null,               // "215/60 R17"
              "rear": null,
              "wheel_type": null,          // alloy | steel
              "spare": null,               // full-size | stepney | none
              "pressure_monitoring": null
            },
            "features": {
              "exterior": [],
              "interior": [],
              "comfort": [],
              "entertainment": [],
              "connectivity": [],
              "convenience": [],
              "safety_features": [],
              "adas_features": []
            }
          },
          "pricing": {
            "city": null,                  // null = national base price
            "state": null,
            "ex_showroom_price": null,     // number, required to publish
            "on_road_price": null,
            "insurance": null,
            "registration": null,
            "tcs_tax": null,
            "financing": {
              "emi": null,                 // "₹15,000/month"
              "down_payment": null,
              "tenure": null,              // "60 months"
              "interest": null             // number, e.g. 8.5
            }
          }
        }
      ]
    }
  ]
}
```

---

## How to import the result

The JSON is nested for readability, but your admin APIs create records level by level. Order:

1. **Model** → `POST /api/v1/admin/models/create-model`  (send model fields, drop `variants`)
2. For each **variant** → `POST /api/v1/admin/variants/create-variant`  (include `colors`, set `model_id`)
3. For each **sub_variant** → `POST /api/v1/admin/sub-variants/create`  (set `variant_id`; send `ownership`)
4. **specifications** → `POST /api/v1/admin/specifications/upsert`  (set `sub_variant_id`)
5. **pricing** → `POST /api/v1/admin/pricing/create`  (set `sub_variant_id`, `ex_showroom_price` required)

Images/colors' `image_url` and `cover_image` are added later via the Gallery Manager — keep them
null in the AI output.
