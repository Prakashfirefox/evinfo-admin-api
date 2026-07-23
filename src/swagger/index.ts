import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "EVinfo Admin API",
    version: "1.0.0",
    description:
      "REST API for the EVinfo Electric Vehicle information platform. Covers admin management and public read endpoints for brands, models, variants, sub-variants, pricing, specifications, dealers, reviews, banners, and more.",
    contact: {
      name: "Evvo Technology",
      email: "support@evvotech.com",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token",
      },
    },
    schemas: {
      // ─── Common ───────────────────────────────────────────────
      SuccessResponse: {
        type: "object",
        properties: {
          status: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" },
          data: { type: "object" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "boolean", example: false },
          message: { type: "string", example: "Error message" },
        },
      },
      PaginationParams: {
        type: "object",
        properties: {
          offset: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          search: { type: "string", example: "" },
          sort_by: { type: "string", example: "created_at" },
          sort_order: { type: "string", enum: ["asc", "desc"], example: "desc" },
        },
      },

      // ─── User ─────────────────────────────────────────────────
      UserRegister: {
        type: "object",
        required: ["user_name", "email", "password"],
        properties: {
          user_name: { type: "string", example: "john_doe" },
          email: { type: "string", format: "email", example: "john@evvo.com" },
          password: {
            type: "string",
            example: "Password@123",
            description: "Min 8 chars, must include uppercase, lowercase, number and special character",
          },
          first_name: { type: "string", example: "John" },
          last_name: { type: "string", example: "Doe" },
          phone_no: { type: "string", example: "+919876543210" },
          designation: { type: "string", example: "Content Manager" },
          role: { type: "string", example: "admin" },
        },
      },
      UserLogin: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@evvo.com" },
          password: { type: "string", example: "Password@123" },
        },
      },
      VerifyOtp: {
        type: "object",
        required: ["userId", "otp"],
        properties: {
          userId: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e1" },
          otp: { type: "string", minLength: 6, maxLength: 6, example: "123456" },
        },
      },
      UpdateUserStatus: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["new", "active", "converted", "contacted", "not_interested", "just_enquiry", "pending"],
            example: "active",
          },
        },
      },
      GetAllUsers: {
        allOf: [
          { $ref: "#/components/schemas/PaginationParams" },
          {
            type: "object",
            properties: {
              is_active: { type: "boolean" },
              is_admin: { type: "boolean" },
              status: { type: "string" },
            },
          },
        ],
      },
      ForgotPassword: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email", example: "admin@evvo.com" },
        },
      },
      ResetPassword: {
        type: "object",
        required: ["token", "email", "new_password"],
        properties: {
          token: { type: "string", example: "a1b2c3d4e5f6..." },
          email: { type: "string", format: "email", example: "admin@evvo.com" },
          new_password: {
            type: "string",
            example: "NewPassword@123",
            description: "Min 8 chars with uppercase, lowercase, number and special character",
          },
        },
      },

      // ─── Blog ─────────────────────────────────────────────────
      BlogSection: {
        type: "object",
        properties: {
          heading: { type: "string", example: "Introduction" },
          content: { type: "string", example: "Electric vehicles are the future..." },
          images: { type: "array", items: { type: "string" }, example: [] },
          order: { type: "integer", example: 1 },
        },
      },
      BlogSEO: {
        type: "object",
        properties: {
          metaTitle: { type: "string", example: "Top EV Picks 2025" },
          metaDescription: { type: "string", example: "Best electric vehicles in 2025" },
          keywords: { type: "array", items: { type: "string" }, example: ["EV", "electric vehicle"] },
        },
      },
      CreateBlog: {
        type: "object",
        required: ["title", "slug"],
        properties: {
          title: { type: "string", example: "Top 10 Electric Vehicles in 2025" },
          slug: { type: "string", example: "top-10-evs-2025" },
          excerpt: { type: "string", example: "A comprehensive guide to the best EVs" },
          cover_images: { type: "array", items: { type: "string" }, example: ["https://cdn.example.com/cover.jpg"] },
          categories: {
            type: "array",
            items: { type: "string", enum: ["evs", "AutoMoobiles", "Technology", "Lifestyle", "Business"] },
            example: ["evs"],
          },
          tags: { type: "array", items: { type: "string" }, example: ["EV", "2025"] },
          sections: { type: "array", items: { $ref: "#/components/schemas/BlogSection" } },
          seo: { $ref: "#/components/schemas/BlogSEO" },
          status: { type: "string", enum: ["draft", "published", "archived"], example: "draft" },
          featured: { type: "boolean", example: false },
        },
      },
      UpdateBlogStatus: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["draft", "published", "archived"], example: "published" },
        },
      },
      GetAllBlogs: {
        allOf: [
          { $ref: "#/components/schemas/PaginationParams" },
          {
            type: "object",
            properties: {
              status: { type: "string", enum: ["draft", "published", "archived"] },
              featured: { type: "boolean" },
              categories: { type: "array", items: { type: "string" } },
            },
          },
        ],
      },

      // ─── Banner ───────────────────────────────────────────────
      CreateBanner: {
        type: "object",
        required: ["title", "slug", "image_url"],
        properties: {
          title: { type: "string", example: "Summer EV Sale 2025" },
          slug: { type: "string", example: "summer-ev-sale-2025" },
          image_url: { type: "string", example: "https://cdn.example.com/banner.jpg" },
          redirect_url: { type: "string", example: "https://evinfo.in/sale" },
          position: {
            type: "string",
            enum: ["HOME_TOP", "HOME_MIDDLE", "HOME_BOTTOM", "POPUP", "SIDEBAR"],
            example: "HOME_TOP",
          },
          priority: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          start_date: { type: "string", format: "date-time", example: "2025-06-01T00:00:00Z" },
          end_date: { type: "string", format: "date-time", example: "2025-06-30T23:59:59Z" },
        },
      },
      UpdateBannerStatus: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
        },
      },
      UpdateBannerPriority: {
        type: "object",
        required: ["priority"],
        properties: {
          priority: { type: "integer", example: 2 },
        },
      },
      BulkBannerStatus: {
        type: "object",
        required: ["banner_ids", "status"],
        properties: {
          banner_ids: { type: "array", items: { type: "string" }, example: ["64a...", "64b..."] },
          status: { type: "string", enum: ["active", "inactive"], example: "inactive" },
        },
      },
      GetAllBanners: {
        allOf: [
          { $ref: "#/components/schemas/PaginationParams" },
          {
            type: "object",
            properties: {
              status: { type: "string", enum: ["active", "inactive"] },
              position: { type: "string" },
            },
          },
        ],
      },

      // ─── Brand ────────────────────────────────────────────────
      CreateBrand: {
        type: "object",
        required: ["name", "slug", "logo"],
        properties: {
          name: { type: "string", example: "Tesla" },
          slug: { type: "string", example: "tesla" },
          logo: { type: "string", example: "https://cdn.example.com/tesla-logo.png" },
          country: { type: "string", example: "USA" },
          founded: { type: "integer", example: 2003 },
          description: { type: "string", example: "Leading electric vehicle manufacturer" },
          website: { type: "string", example: "https://tesla.com" },
          status: { type: "string", enum: ["active", "discontinued"], example: "active" },
        },
      },
      UpdateBrandStatus: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["active", "discontinued"], example: "discontinued" },
        },
      },
      GetAllBrands: {
        allOf: [
          { $ref: "#/components/schemas/PaginationParams" },
          {
            type: "object",
            properties: {
              status: { type: "string", enum: ["active", "discontinued"] },
              country: { type: "string" },
            },
          },
        ],
      },

      // ─── Vehicle Model ─────────────────────────────────────────
      CreateVehicleModel: {
        type: "object",
        required: ["name", "slug", "brand_id"],
        properties: {
          name: { type: "string", example: "Model 3" },
          slug: { type: "string", example: "model-3" },
          brand_id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e1" },
          generation: { type: "string", example: "2nd Gen" },
          body_type: { type: "string", example: "Sedan" },
          production_years: { type: "string", example: "2017-Present" },
          platform: { type: "string", example: "Tesla Platform 3" },
          status: { type: "string", enum: ["active", "discontinued"], example: "active" },
        },
      },

      // ─── Variant ──────────────────────────────────────────────
      CreateVariant: {
        type: "object",
        required: ["name", "slug", "model_id"],
        properties: {
          name: { type: "string", example: "Long Range AWD" },
          slug: { type: "string", example: "model-3-long-range-awd" },
          model_id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e2" },
          trim: { type: "string", example: "Long Range" },
          launch_year: { type: "integer", example: 2021 },
          production_status: { type: "string", example: "active" },
          segment: { type: "string", example: "Premium Sedan" },
          description: { type: "string", example: "Top-of-the-line trim with AWD and extended range." },
          cover_image: { type: "string", example: "https://cdn.example.com/model3-lr.jpg" },
          featured: { type: "boolean", example: false },
          colors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", example: "Pearl White" },
                hex_code: { type: "string", example: "#FFFFFF" },
                image: { type: "string", example: "https://cdn.example.com/white.jpg" },
                price: { type: "number", example: 0 },
                is_available: { type: "boolean", example: true },
              },
            },
          },
          competitor_ids: { type: "array", items: { type: "string" }, example: [] },
          status: { type: "string", enum: ["active", "discontinued"], example: "active" },
        },
      },

      // ─── SubVariant ───────────────────────────────────────────
      CreateSubVariant: {
        type: "object",
        required: ["name", "slug", "variant_id", "fuel_type", "transmission"],
        properties: {
          name: { type: "string", example: "Petrol MT" },
          slug: { type: "string", example: "hyundai-creta-sx-petrol-mt" },
          variant_id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e3" },
          fuel_type: { type: "string", enum: ["Petrol", "Diesel", "EV", "Hybrid", "CNG", "PHEV"], example: "Petrol" },
          transmission: { type: "string", enum: ["Manual", "Automatic", "CVT", "AMT", "DCT"], example: "Manual" },
          engine: { type: "string", example: "1.5L NA" },
          drivetrain: { type: "string", enum: ["FWD", "RWD", "AWD", "4WD", "4x4"], example: "FWD" },
          status: { type: "string", enum: ["active", "discontinued", "upcoming"], example: "active" },
          ownership: {
            type: "object",
            properties: {
              warranty_years: { type: "integer", example: 3 },
              warranty_km: { type: "integer", example: 100000 },
              battery_warranty: { type: "string", example: "8 years / 160,000 km" },
              service_intervals: { type: "string", example: "10,000 km or 1 year" },
              maintenance_cost_per_km: { type: "number", example: 1.5 },
            },
          },
        },
      },
      UpdateSubVariantStatus: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["active", "discontinued", "upcoming"], example: "active" },
        },
      },
      BulkUpdateSubVariantStatus: {
        type: "object",
        required: ["sub_variant_ids", "status"],
        properties: {
          sub_variant_ids: { type: "array", items: { type: "string" }, example: ["64a...", "64b..."] },
          status: { type: "string", enum: ["active", "discontinued", "upcoming"], example: "active" },
        },
      },

      // ─── Pricing ──────────────────────────────────────────────
      CreatePricing: {
        type: "object",
        required: ["sub_variant_id", "ex_showroom_price"],
        properties: {
          sub_variant_id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e5" },
          city: { type: "string", example: "Mumbai", description: "Omit for national base price" },
          state: { type: "string", example: "Maharashtra" },
          ex_showroom_price: { type: "number", example: 1450000 },
          on_road_price: { type: "number", example: 1680000 },
          insurance: { type: "number", example: 65000 },
          registration: { type: "number", example: 120000 },
          tcs_tax: { type: "number", example: 14500 },
          is_active: { type: "boolean", example: true },
          financing: {
            type: "object",
            properties: {
              emi_10_percent: { type: "number", example: 14200 },
              emi_20_percent: { type: "number", example: 12600 },
              interest_rate: { type: "number", example: 8.5 },
              tenure_months: { type: "integer", example: 60 },
            },
          },
        },
      },
      UpdatePricing: {
        type: "object",
        properties: {
          ex_showroom_price: { type: "number", example: 1480000 },
          on_road_price: { type: "number", example: 1720000 },
          insurance: { type: "number", example: 68000 },
          registration: { type: "number", example: 125000 },
          tcs_tax: { type: "number", example: 14800 },
          is_active: { type: "boolean", example: true },
        },
      },

      // ─── Specifications ───────────────────────────────────────
      UpsertSpecifications: {
        type: "object",
        required: ["sub_variant_id"],
        properties: {
          sub_variant_id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e5" },
          performance: {
            type: "object",
            properties: {
              acceleration: { type: "string", example: "9.5s (0-100 km/h)" },
              top_speed: { type: "string", example: "180 km/h" },
              power: { type: "string", example: "115 hp" },
              torque: { type: "string", example: "144 Nm" },
              fuel_efficiency: { type: "string", example: "17 km/l" },
            },
          },
          battery: {
            type: "object",
            description: "Only for EV / PHEV sub-variants",
            properties: {
              capacity_kwh: { type: "number", example: 40.4 },
              range_km: { type: "integer", example: 412 },
              charging: {
                type: "object",
                properties: {
                  ac_kw: { type: "number", example: 7.2 },
                  dc_kw: { type: "number", example: 50 },
                  time_0_to_80: { type: "string", example: "58 min (DC)" },
                  connector_type: { type: "string", example: "CCS2" },
                },
              },
            },
          },
          dimensions: {
            type: "object",
            properties: {
              length_mm: { type: "integer", example: 4300 },
              width_mm: { type: "integer", example: 1790 },
              height_mm: { type: "integer", example: 1635 },
              wheelbase_mm: { type: "integer", example: 2610 },
              ground_clearance_mm: { type: "integer", example: 190 },
              kerb_weight_kg: { type: "integer", example: 1300 },
              boot_space_liters: { type: "integer", example: 433 },
            },
          },
          interior: {
            type: "object",
            properties: {
              seating_capacity: { type: "integer", example: 5 },
              infotainment_size: { type: "string", example: "10.25 inch" },
              instrument_cluster: { type: "string", example: "Digital" },
              sunroof: { type: "boolean", example: true },
            },
          },
          safety: {
            type: "object",
            properties: {
              ncap_rating: { type: "string", example: "5-Star (Global NCAP)" },
              airbags: { type: "integer", example: 6 },
              abs: { type: "boolean", example: true },
              esp: { type: "boolean", example: true },
              hill_assist: { type: "boolean", example: true },
              autonomous_level: { type: "string", example: "Level 1" },
            },
          },
          wheels: {
            type: "object",
            properties: {
              tyre_size: { type: "string", example: "215/60 R17" },
              wheel_type: { type: "string", example: "Alloy" },
              spare_type: { type: "string", example: "Steel" },
            },
          },
          features: {
            type: "object",
            properties: {
              exterior: { type: "array", items: { type: "string" }, example: ["LED DRL", "Shark Fin Antenna"] },
              interior: { type: "array", items: { type: "string" }, example: ["Ventilated Seats", "Wireless Charging"] },
              comfort: { type: "array", items: { type: "string" }, example: ["Cruise Control", "Auto Climate Control"] },
              connectivity: { type: "array", items: { type: "string" }, example: ["Bluetooth", "Android Auto", "Apple CarPlay"] },
            },
          },
        },
      },

      // ─── Review ───────────────────────────────────────────────
      CreateReview: {
        type: "object",
        required: ["sub_variant_id", "rating"],
        properties: {
          sub_variant_id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e4" },
          rating: { type: "number", minimum: 0, maximum: 5, example: 4.5 },
          title: { type: "string", example: "Best EV I have owned" },
          content: { type: "string", example: "Exceptional range and performance..." },
          pros: { type: "array", items: { type: "string" }, example: ["Great range", "Fast charging", "Autopilot"] },
          cons: { type: "array", items: { type: "string" }, example: ["High price", "Service centers limited"] },
        },
      },
      UpdateReviewStatus: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["pending", "approved", "rejected"], example: "approved" },
        },
      },
      MarkReviewHelpful: {
        type: "object",
        required: ["action"],
        properties: {
          action: { type: "string", enum: ["increment", "decrement"], example: "increment" },
        },
      },

      // ─── Dealer ───────────────────────────────────────────────
      CreateDealer: {
        type: "object",
        required: ["name", "address", "city", "state", "country"],
        properties: {
          name: { type: "string", example: "EV World - Mumbai" },
          address: { type: "string", example: "123, Andheri West, Mumbai" },
          city: { type: "string", example: "Mumbai" },
          state: { type: "string", example: "Maharashtra" },
          country: { type: "string", example: "India" },
          pincode: { type: "string", example: "400053" },
          phone: { type: "string", example: "+912266442200" },
          email: { type: "string", format: "email", example: "mumbai@evworld.in" },
          website: { type: "string", example: "https://evworld.in/mumbai" },
          coordinates: {
            type: "object",
            properties: {
              lat: { type: "number", example: 19.1362 },
              lng: { type: "number", example: 72.8296 },
            },
          },
          brands: { type: "array", items: { type: "string" }, example: ["64a1b2c3d4e5f6a7b8c9d0e1"] },
          services: {
            type: "array",
            items: { type: "string", enum: ["sales", "service", "parts", "financing", "insurance", "test_drive"] },
            example: ["sales", "service", "test_drive"],
          },
          rating: { type: "number", example: 4.2 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
        },
      },
      GetNearbyDealers: {
        type: "object",
        required: ["lat", "lng"],
        properties: {
          lat: { type: "number", example: 19.076 },
          lng: { type: "number", example: 72.8777 },
          radius: { type: "number", example: 50, description: "Radius in km" },
          brands: { type: "array", items: { type: "string" } },
          services: { type: "array", items: { type: "string" } },
        },
      },

      // ─── Media ────────────────────────────────────────────────
      GeneratePresignedUrl: {
        type: "object",
        required: ["fileName"],
        properties: {
          fileName: { type: "string", example: "vehicle-cover-2025.jpg" },
          folder: { type: "string", example: "vehicles" },
        },
      },

      // ─── Compare ──────────────────────────────────────────────
      CompareSubVariants: {
        type: "object",
        required: ["sub_variant_ids"],
        properties: {
          sub_variant_ids: {
            type: "array",
            minItems: 2,
            maxItems: 4,
            items: { type: "string" },
            example: ["64a1...", "64b2..."],
          },
        },
      },
    },
  },
  paths: {
    // ════════════════════════════════════════
    // MEDIA
    // ════════════════════════════════════════
    "/admin/media/presign": {
      post: {
        tags: ["Media"],
        summary: "Generate presigned upload URL",
        description: "Generate a Bunny CDN presigned URL for direct file uploads.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/GeneratePresignedUrl" } } },
        },
        responses: {
          200: { description: "Presigned URL generated", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          401: { description: "Unauthorized" },
        },
      },
    },

    // ════════════════════════════════════════
    // AUTH / USERS
    // ════════════════════════════════════════
    "/admin/auth/users/create-user": {
      post: {
        tags: ["Auth"],
        summary: "Create a new admin user",
        description: "Register a new admin user. An OTP is sent to the email for verification.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserRegister" } } },
        },
        responses: {
          201: { description: "User created. OTP sent to email.", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          400: { description: "Validation error / Email already in use" },
        },
      },
    },
    "/admin/auth/users/verify-otp": {
      post: {
        tags: ["Auth"],
        summary: "Verify OTP",
        description: "Verify the 6-digit OTP sent to the user's email during registration.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VerifyOtp" } } },
        },
        responses: {
          200: { description: "OTP verified successfully" },
          400: { description: "Invalid or expired OTP" },
        },
      },
    },
    "/admin/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        description: "Authenticate with email and password to obtain a JWT token.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserLogin" } } },
        },
        responses: {
          200: {
            description: "Login successful. Returns JWT token.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    message: { type: "string", example: "Login successful" },
                    data: {
                      type: "object",
                      properties: {
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                        user: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/admin/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout",
        description: "Invalidate the current JWT token.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Logged out successfully" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/admin/auth/users/{id}": {
      get: {
        tags: ["Auth"],
        summary: "Get user by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "User MongoDB ObjectId" }],
        responses: {
          200: { description: "User fetched", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          404: { description: "User not found" },
        },
      },
      put: {
        tags: ["Auth"],
        summary: "Update user",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  first_name: { type: "string" },
                  last_name: { type: "string" },
                  phone_no: { type: "string" },
                  designation: { type: "string" },
                  gender: { type: "string" },
                  dob: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "User updated successfully" },
          404: { description: "User not found" },
        },
      },
      delete: {
        tags: ["Auth"],
        summary: "Delete user",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User deleted" },
          404: { description: "User not found" },
        },
      },
    },
    "/admin/auth/users/get-all-users": {
      post: {
        tags: ["Auth"],
        summary: "Get all users",
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/GetAllUsers" } } },
        },
        responses: {
          200: { description: "Users list fetched", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
        },
      },
    },
    "/admin/auth/users/{id}/status": {
      patch: {
        tags: ["Auth"],
        summary: "Update user status",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateUserStatus" } } },
        },
        responses: {
          200: { description: "User status updated" },
          404: { description: "User not found" },
        },
      },
    },

    // ════════════════════════════════════════
    // AUTH - PUBLIC (no JWT required)
    // ════════════════════════════════════════
    "/public/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Forgot password — request reset link",
        description: "Sends a password reset email if the address is registered. Always returns 200 to prevent email enumeration.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ForgotPassword" } } },
        },
        responses: {
          200: {
            description: "Reset link sent (or silently ignored if email not found)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    message: { type: "string", example: "If that email exists, a password reset link has been sent" },
                  },
                },
              },
            },
          },
          400: { description: "Validation error" },
        },
      },
    },
    "/public/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password — set new password using token",
        description: "Validates the reset token from the email link and updates the user password. Token expires in 15 minutes.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ResetPassword" } } },
        },
        responses: {
          200: {
            description: "Password reset successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    message: { type: "string", example: "Password has been reset successfully" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid or expired reset token" },
        },
      },
    },

    // ════════════════════════════════════════
    // BLOGS - ADMIN
    // ════════════════════════════════════════
    "/admin/blogs/create-blog": {
      post: {
        tags: ["Blogs (Admin)"],
        summary: "Create a blog post",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateBlog" } } },
        },
        responses: {
          201: { description: "Blog created", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          400: { description: "Validation error / slug already in use" },
        },
      },
    },
    "/admin/blogs/{id}": {
      get: {
        tags: ["Blogs (Admin)"],
        summary: "Get blog by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Blog fetched" },
          404: { description: "Blog not found" },
        },
      },
      put: {
        tags: ["Blogs (Admin)"],
        summary: "Update blog",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateBlog" } } },
        },
        responses: {
          200: { description: "Blog updated" },
          404: { description: "Blog not found" },
        },
      },
      delete: {
        tags: ["Blogs (Admin)"],
        summary: "Delete blog",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Blog deleted" },
          404: { description: "Blog not found" },
        },
      },
    },
    "/admin/blogs/get-all-blogs": {
      post: {
        tags: ["Blogs (Admin)"],
        summary: "Get all blogs (admin)",
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/GetAllBlogs" } } },
        },
        responses: {
          200: { description: "Blogs list", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
        },
      },
    },
    "/admin/blogs/{id}/status": {
      patch: {
        tags: ["Blogs (Admin)"],
        summary: "Update blog status",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateBlogStatus" } } },
        },
        responses: {
          200: { description: "Blog status updated" },
          404: { description: "Blog not found" },
        },
      },
    },
    "/admin/blogs/slug/{slug}": {
      get: {
        tags: ["Blogs (Admin)"],
        summary: "Get blog by slug",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" }, example: "top-10-evs-2025" }],
        responses: {
          200: { description: "Blog fetched" },
          404: { description: "Blog not found" },
        },
      },
    },

    // ════════════════════════════════════════
    // BANNERS - ADMIN
    // ════════════════════════════════════════
    "/admin/banners/create-banner": {
      post: {
        tags: ["Banners (Admin)"],
        summary: "Create a banner",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateBanner" } } },
        },
        responses: {
          201: { description: "Banner created" },
          400: { description: "Validation error / slug already in use" },
        },
      },
    },
    "/admin/banners/{id}": {
      get: {
        tags: ["Banners (Admin)"],
        summary: "Get banner by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Banner fetched" },
          404: { description: "Banner not found" },
        },
      },
      put: {
        tags: ["Banners (Admin)"],
        summary: "Update banner",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateBanner" } } },
        },
        responses: {
          200: { description: "Banner updated" },
          404: { description: "Banner not found" },
        },
      },
      delete: {
        tags: ["Banners (Admin)"],
        summary: "Delete banner",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Banner deleted" },
          404: { description: "Banner not found" },
        },
      },
    },
    "/admin/banners/get-all-banners": {
      post: {
        tags: ["Banners (Admin)"],
        summary: "Get all banners",
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/GetAllBanners" } } },
        },
        responses: {
          200: { description: "Banners list" },
        },
      },
    },
    "/admin/banners/{id}/status": {
      patch: {
        tags: ["Banners (Admin)"],
        summary: "Update banner status",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateBannerStatus" } } },
        },
        responses: { 200: { description: "Status updated" }, 404: { description: "Banner not found" } },
      },
    },
    "/admin/banners/{id}/priority": {
      patch: {
        tags: ["Banners (Admin)"],
        summary: "Update banner priority",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateBannerPriority" } } },
        },
        responses: { 200: { description: "Priority updated" } },
      },
    },
    "/admin/banners/bulk-status": {
      post: {
        tags: ["Banners (Admin)"],
        summary: "Bulk update banner statuses",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/BulkBannerStatus" } } },
        },
        responses: { 200: { description: "Statuses updated" } },
      },
    },
    "/admin/banners/position/{position}": {
      get: {
        tags: ["Banners (Admin)"],
        summary: "Get banners by position",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "position", in: "path", required: true, schema: { type: "string", enum: ["HOME_TOP", "HOME_MIDDLE", "HOME_BOTTOM", "POPUP", "SIDEBAR"] } },
        ],
        responses: { 200: { description: "Banners for position" } },
      },
    },

    // ════════════════════════════════════════
    // BRANDS - ADMIN
    // ════════════════════════════════════════
    "/admin/brands/create-brand": {
      post: {
        tags: ["Brands (Admin)"],
        summary: "Create a vehicle brand",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateBrand" } } },
        },
        responses: {
          201: { description: "Brand created" },
          400: { description: "Brand already exists" },
        },
      },
    },
    "/admin/brands/{id}": {
      get: {
        tags: ["Brands (Admin)"],
        summary: "Get brand by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Brand fetched" }, 404: { description: "Brand not found" } },
      },
      put: {
        tags: ["Brands (Admin)"],
        summary: "Update brand",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CreateBrand" } } } },
        responses: { 200: { description: "Brand updated" }, 404: { description: "Brand not found" } },
      },
      delete: {
        tags: ["Brands (Admin)"],
        summary: "Delete brand",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Brand deleted" }, 400: { description: "Brand has associations" } },
      },
    },
    "/admin/brands/get-all-brands": {
      post: {
        tags: ["Brands (Admin)"],
        summary: "Get all brands",
        security: [{ BearerAuth: [] }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/GetAllBrands" } } } },
        responses: { 200: { description: "Brands list" } },
      },
    },
    "/admin/brands/{id}/status": {
      patch: {
        tags: ["Brands (Admin)"],
        summary: "Update brand status",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateBrandStatus" } } },
        },
        responses: { 200: { description: "Status updated" } },
      },
    },
    "/admin/brands/{id}/vehicles": {
      get: {
        tags: ["Brands (Admin)"],
        summary: "Get vehicles by brand",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "offset", in: "query", schema: { type: "integer", example: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 10 } },
        ],
        responses: { 200: { description: "Brand vehicles list" } },
      },
    },

    // ════════════════════════════════════════
    // VEHICLE MODELS - ADMIN
    // ════════════════════════════════════════
    "/admin/models/create-model": {
      post: {
        tags: ["Vehicle Models (Admin)"],
        summary: "Create a vehicle model",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateVehicleModel" } } },
        },
        responses: { 201: { description: "Model created" }, 400: { description: "Model already exists in brand" } },
      },
    },
    "/admin/models/{id}": {
      get: {
        tags: ["Vehicle Models (Admin)"],
        summary: "Get model by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Model fetched" }, 404: { description: "Model not found" } },
      },
      put: {
        tags: ["Vehicle Models (Admin)"],
        summary: "Update vehicle model",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CreateVehicleModel" } } } },
        responses: { 200: { description: "Model updated" } },
      },
      delete: {
        tags: ["Vehicle Models (Admin)"],
        summary: "Delete vehicle model",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Model deleted" }, 400: { description: "Model has associated variants" } },
      },
    },
    "/admin/models/get-all-models": {
      post: {
        tags: ["Vehicle Models (Admin)"],
        summary: "Get all vehicle models",
        security: [{ BearerAuth: [] }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/PaginationParams" } } } },
        responses: { 200: { description: "Models list" } },
      },
    },
    "/admin/models/{id}/status": {
      patch: {
        tags: ["Vehicle Models (Admin)"],
        summary: "Update model status",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateBrandStatus" } } },
        },
        responses: { 200: { description: "Status updated" } },
      },
    },
    "/admin/models/brand/{brandId}": {
      get: {
        tags: ["Vehicle Models (Admin)"],
        summary: "Get models by brand",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "brandId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Models for brand" } },
      },
    },

    // ════════════════════════════════════════
    // VARIANTS - ADMIN
    // ════════════════════════════════════════
    "/admin/variants/create-variant": {
      post: {
        tags: ["Variants (Admin)"],
        summary: "Create a vehicle variant",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateVariant" } } },
        },
        responses: { 201: { description: "Variant created" }, 400: { description: "Variant already exists" } },
      },
    },
    "/admin/variants/{id}": {
      get: {
        tags: ["Variants (Admin)"],
        summary: "Get variant by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Variant fetched" }, 404: { description: "Variant not found" } },
      },
      put: {
        tags: ["Variants (Admin)"],
        summary: "Update variant",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CreateVariant" } } } },
        responses: { 200: { description: "Variant updated" } },
      },
      delete: {
        tags: ["Variants (Admin)"],
        summary: "Delete variant",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Variant deleted" } },
      },
    },
    "/admin/variants/get-all-variants": {
      post: {
        tags: ["Variants (Admin)"],
        summary: "Get all variants",
        security: [{ BearerAuth: [] }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/PaginationParams" } } } },
        responses: { 200: { description: "Variants list" } },
      },
    },
    "/admin/variants/{id}/status": {
      patch: {
        tags: ["Variants (Admin)"],
        summary: "Update variant status",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateBrandStatus" } } },
        },
        responses: { 200: { description: "Status updated" } },
      },
    },
    "/admin/variants/model/{modelId}": {
      get: {
        tags: ["Variants (Admin)"],
        summary: "Get variants by model",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "modelId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Variants for model" } },
      },
    },

    // ════════════════════════════════════════
    // SUB-VARIANTS - ADMIN
    // ════════════════════════════════════════
    "/admin/sub-variants/create": {
      post: {
        tags: ["Sub-Variants (Admin)"],
        summary: "Create a sub-variant",
        description: "The final sellable unit (e.g. Petrol MT, Diesel AT). Belongs to a Variant.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateSubVariant" } } },
        },
        responses: { 201: { description: "Sub-variant created" }, 400: { description: "Validation error / slug already in use" } },
      },
    },
    "/admin/sub-variants/{id}": {
      get: {
        tags: ["Sub-Variants (Admin)"],
        summary: "Get sub-variant by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Sub-variant fetched" }, 404: { description: "Sub-variant not found" } },
      },
      put: {
        tags: ["Sub-Variants (Admin)"],
        summary: "Update sub-variant",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CreateSubVariant" } } } },
        responses: { 200: { description: "Sub-variant updated" }, 404: { description: "Sub-variant not found" } },
      },
      delete: {
        tags: ["Sub-Variants (Admin)"],
        summary: "Delete sub-variant (soft)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Sub-variant deleted" }, 400: { description: "Has existing reviews" } },
      },
    },
    "/admin/sub-variants/get-all": {
      post: {
        tags: ["Sub-Variants (Admin)"],
        summary: "Get all sub-variants (admin)",
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/PaginationParams" },
                  {
                    type: "object",
                    properties: {
                      variant_id: { type: "string" },
                      fuel_type: { type: "string", enum: ["Petrol", "Diesel", "EV", "Hybrid", "CNG", "PHEV"] },
                      transmission: { type: "string", enum: ["Manual", "Automatic", "CVT", "AMT", "DCT"] },
                      status: { type: "string", enum: ["active", "discontinued", "upcoming"] },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: { 200: { description: "Sub-variants list" } },
      },
    },
    "/admin/sub-variants/{id}/status": {
      patch: {
        tags: ["Sub-Variants (Admin)"],
        summary: "Update sub-variant status",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateSubVariantStatus" } } },
        },
        responses: { 200: { description: "Status updated" }, 404: { description: "Sub-variant not found" } },
      },
    },
    "/admin/sub-variants/bulk-update-status": {
      patch: {
        tags: ["Sub-Variants (Admin)"],
        summary: "Bulk update sub-variant statuses",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/BulkUpdateSubVariantStatus" } } },
        },
        responses: { 200: { description: "Statuses updated in bulk" } },
      },
    },
    "/admin/sub-variants/variant/{variantId}": {
      get: {
        tags: ["Sub-Variants (Admin)"],
        summary: "Get sub-variants by variant",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "variantId", in: "path", required: true, schema: { type: "string" } },
          { name: "offset", in: "query", schema: { type: "integer", example: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 20 } },
        ],
        responses: { 200: { description: "Sub-variants for variant" } },
      },
    },

    // ════════════════════════════════════════
    // PRICING - ADMIN
    // ════════════════════════════════════════
    "/admin/pricing/create": {
      post: {
        tags: ["Pricing (Admin)"],
        summary: "Create a pricing record",
        description: "City = null creates national base price. City-specific records override it.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreatePricing" } } },
        },
        responses: { 201: { description: "Pricing created" }, 400: { description: "Pricing already exists for this city / sub-variant" } },
      },
    },
    "/admin/pricing/{id}": {
      get: {
        tags: ["Pricing (Admin)"],
        summary: "Get pricing by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Pricing fetched" }, 404: { description: "Pricing not found" } },
      },
      put: {
        tags: ["Pricing (Admin)"],
        summary: "Update pricing",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpdatePricing" } } } },
        responses: { 200: { description: "Pricing updated" }, 404: { description: "Pricing not found" } },
      },
      delete: {
        tags: ["Pricing (Admin)"],
        summary: "Delete pricing record",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Pricing deleted" } },
      },
    },
    "/admin/pricing/get-all": {
      post: {
        tags: ["Pricing (Admin)"],
        summary: "Get all pricing records",
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/PaginationParams" },
                  {
                    type: "object",
                    properties: {
                      sub_variant_id: { type: "string" },
                      city: { type: "string" },
                      is_active: { type: "boolean" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: { 200: { description: "Pricing list" } },
      },
    },
    "/admin/pricing/sub-variant/{subVariantId}": {
      get: {
        tags: ["Pricing (Admin)"],
        summary: "Get all pricing for a sub-variant",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "subVariantId", in: "path", required: true, schema: { type: "string" } },
          { name: "city", in: "query", schema: { type: "string", description: "Filter by city" } },
        ],
        responses: { 200: { description: "Pricing records for sub-variant" } },
      },
    },

    // ════════════════════════════════════════
    // SPECIFICATIONS - ADMIN
    // ════════════════════════════════════════
    "/admin/specifications/upsert": {
      post: {
        tags: ["Specifications (Admin)"],
        summary: "Upsert specifications",
        description: "Creates specs if none exist for the sub-variant, otherwise updates the existing record.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpsertSpecifications" } } },
        },
        responses: { 200: { description: "Specifications upserted" } },
      },
    },
    "/admin/specifications/{id}": {
      get: {
        tags: ["Specifications (Admin)"],
        summary: "Get specifications by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Specifications fetched" }, 404: { description: "Specifications not found" } },
      },
      put: {
        tags: ["Specifications (Admin)"],
        summary: "Update specifications",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpsertSpecifications" } } } },
        responses: { 200: { description: "Specifications updated" } },
      },
      delete: {
        tags: ["Specifications (Admin)"],
        summary: "Delete specifications",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Specifications deleted" } },
      },
    },
    "/admin/specifications/sub-variant/{subVariantId}": {
      get: {
        tags: ["Specifications (Admin)"],
        summary: "Get specifications for a sub-variant",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "subVariantId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Specifications for sub-variant" }, 404: { description: "Specifications not found" } },
      },
    },

    // ════════════════════════════════════════
    // REVIEWS - ADMIN
    // ════════════════════════════════════════
    "/admin/reviews/create-review": {
      post: {
        tags: ["Reviews (Admin)"],
        summary: "Create a review",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateReview" } } },
        },
        responses: { 201: { description: "Review created" } },
      },
    },
    "/admin/reviews/{id}": {
      get: {
        tags: ["Reviews (Admin)"],
        summary: "Get review by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Review fetched" }, 404: { description: "Review not found" } },
      },
      put: {
        tags: ["Reviews (Admin)"],
        summary: "Update review",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CreateReview" } } } },
        responses: { 200: { description: "Review updated" } },
      },
      delete: {
        tags: ["Reviews (Admin)"],
        summary: "Delete review",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Review deleted" } },
      },
    },
    "/admin/reviews/get-all-reviews": {
      post: {
        tags: ["Reviews (Admin)"],
        summary: "Get all reviews",
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/PaginationParams" },
                  {
                    type: "object",
                    properties: {
                      sub_variant_id: { type: "string" },
                      status: { type: "string", enum: ["pending", "approved", "rejected"] },
                      min_rating: { type: "number" },
                      max_rating: { type: "number" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: { 200: { description: "Reviews list" } },
      },
    },
    "/admin/reviews/{id}/status": {
      patch: {
        tags: ["Reviews (Admin)"],
        summary: "Approve / reject review",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateReviewStatus" } } },
        },
        responses: { 200: { description: "Review status updated" } },
      },
    },
    "/admin/reviews/{id}/mark-helpful": {
      patch: {
        tags: ["Reviews (Admin)"],
        summary: "Mark review as helpful",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/MarkReviewHelpful" } } },
        },
        responses: { 200: { description: "Helpful count updated" } },
      },
    },
    "/admin/reviews/pending": {
      get: {
        tags: ["Reviews (Admin)"],
        summary: "Get all pending reviews",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Pending reviews list" } },
      },
    },
    "/admin/reviews/sub-variant/{subVariantId}": {
      get: {
        tags: ["Reviews (Admin)"],
        summary: "Get reviews for a sub-variant",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "subVariantId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Sub-variant reviews" } },
      },
    },
    "/admin/reviews/user/{userId}": {
      get: {
        tags: ["Reviews (Admin)"],
        summary: "Get reviews by user",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "User reviews list" } },
      },
    },

    // ════════════════════════════════════════
    // DEALERS - ADMIN
    // ════════════════════════════════════════
    "/admin/dealers/create-dealer": {
      post: {
        tags: ["Dealers (Admin)"],
        summary: "Create a dealer / service center",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateDealer" } } },
        },
        responses: { 201: { description: "Dealer created" } },
      },
    },
    "/admin/dealers/{id}": {
      get: {
        tags: ["Dealers (Admin)"],
        summary: "Get dealer by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Dealer fetched" }, 404: { description: "Dealer not found" } },
      },
      put: {
        tags: ["Dealers (Admin)"],
        summary: "Update dealer",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CreateDealer" } } } },
        responses: { 200: { description: "Dealer updated" } },
      },
      delete: {
        tags: ["Dealers (Admin)"],
        summary: "Delete dealer",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Dealer deleted" } },
      },
    },
    "/admin/dealers/get-all-dealers": {
      post: {
        tags: ["Dealers (Admin)"],
        summary: "Get all dealers",
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/PaginationParams" },
                  {
                    type: "object",
                    properties: {
                      city: { type: "string" },
                      state: { type: "string" },
                      status: { type: "string", enum: ["active", "inactive"] },
                      brand_id: { type: "string" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: { 200: { description: "Dealers list" } },
      },
    },
    "/admin/dealers/{id}/status": {
      patch: {
        tags: ["Dealers (Admin)"],
        summary: "Update dealer status",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: { status: { type: "string", enum: ["active", "inactive"] } },
              },
            },
          },
        },
        responses: { 200: { description: "Status updated" } },
      },
    },
    "/admin/dealers/{id}/rating": {
      patch: {
        tags: ["Dealers (Admin)"],
        summary: "Update dealer rating",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating"],
                properties: { rating: { type: "number", minimum: 0, maximum: 5, example: 4.2 } },
              },
            },
          },
        },
        responses: { 200: { description: "Rating updated" } },
      },
    },
    "/admin/dealers/{id}/services": {
      get: {
        tags: ["Dealers (Admin)"],
        summary: "Get dealer services",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Services list" } },
      },
    },
    "/admin/dealers/{id}/services/add": {
      post: {
        tags: ["Dealers (Admin)"],
        summary: "Add services to dealer",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["services"],
                properties: { services: { type: "array", items: { type: "string" }, example: ["financing"] } },
              },
            },
          },
        },
        responses: { 200: { description: "Services added" } },
      },
    },
    "/admin/dealers/{id}/services/remove": {
      post: {
        tags: ["Dealers (Admin)"],
        summary: "Remove services from dealer",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["services"],
                properties: { services: { type: "array", items: { type: "string" }, example: ["financing"] } },
              },
            },
          },
        },
        responses: { 200: { description: "Services removed" } },
      },
    },
    "/admin/dealers/brand/{brandId}": {
      get: {
        tags: ["Dealers (Admin)"],
        summary: "Get dealers by brand",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "brandId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Dealers for brand" } },
      },
    },
    "/admin/dealers/stats/overview": {
      get: {
        tags: ["Dealers (Admin)"],
        summary: "Get dealer stats overview",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Dealer statistics" } },
      },
    },
    "/admin/dealers/get-nearby": {
      post: {
        tags: ["Dealers (Admin)"],
        summary: "Get nearby dealers",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/GetNearbyDealers" } } },
        },
        responses: { 200: { description: "Nearby dealers" } },
      },
    },

    // ════════════════════════════════════════
    // STATS & ANALYTICS
    // ════════════════════════════════════════
    "/admin/stats/get-overview": {
      get: {
        tags: ["Stats & Analytics"],
        summary: "Get overview statistics",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "include_history", in: "query", schema: { type: "boolean", example: false } },
          { name: "days", in: "query", schema: { type: "integer", minimum: 1, maximum: 365, example: 30 } },
        ],
        responses: { 200: { description: "Overview stats" } },
      },
    },
    "/admin/stats/get-brands-stats": {
      get: {
        tags: ["Stats & Analytics"],
        summary: "Get brand statistics",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50, example: 20 } },
          { name: "sort_by", in: "query", schema: { type: "string", enum: ["vehicles", "views", "models", "rating"], example: "vehicles" } },
          { name: "sort_order", in: "query", schema: { type: "string", enum: ["asc", "desc"], example: "desc" } },
        ],
        responses: { 200: { description: "Brand stats" } },
      },
    },
    "/admin/stats/get-popular-vehicles": {
      get: {
        tags: ["Stats & Analytics"],
        summary: "Get popular sub-variants by view count",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50, example: 10 } },
          { name: "period", in: "query", schema: { type: "string", enum: ["day", "week", "month", "year", "all"], example: "all" } },
          { name: "brand_id", in: "query", schema: { type: "string" } },
          { name: "fuel_type", in: "query", schema: { type: "string", enum: ["Petrol", "Diesel", "EV", "Hybrid", "CNG", "PHEV"] } },
        ],
        responses: { 200: { description: "Popular sub-variants" } },
      },
    },
    "/admin/stats/reviews": {
      get: {
        tags: ["Stats & Analytics"],
        summary: "Get review statistics",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "start_date", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "end_date", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "period", in: "query", schema: { type: "string", enum: ["day", "week", "month", "quarter", "year"] } },
        ],
        responses: { 200: { description: "Review stats" } },
      },
    },
    "/admin/stats/dealers": {
      get: {
        tags: ["Stats & Analytics"],
        summary: "Get dealer statistics",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "start_date", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "end_date", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "period", in: "query", schema: { type: "string", enum: ["day", "week", "month", "quarter", "year"] } },
        ],
        responses: { 200: { description: "Dealer stats" } },
      },
    },
    "/admin/stats/users": {
      get: {
        tags: ["Stats & Analytics"],
        summary: "Get user statistics",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "start_date", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "end_date", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "period", in: "query", schema: { type: "string", enum: ["day", "week", "month", "quarter", "year"] } },
        ],
        responses: { 200: { description: "User stats" } },
      },
    },
    "/admin/stats/dashboard": {
      get: {
        tags: ["Stats & Analytics"],
        summary: "Get full dashboard statistics",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Dashboard stats (all-in-one)" } },
      },
    },

    // ════════════════════════════════════════
    // PUBLIC - BANNERS
    // ════════════════════════════════════════
    "/public/banners/active": {
      get: {
        tags: ["Public - Banners"],
        summary: "Get all active banners",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "offset", in: "query", schema: { type: "integer", example: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 20 } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "inactive"] } },
        ],
        responses: { 200: { description: "Active banners list" } },
      },
    },
    "/public/banners/position/{position}": {
      get: {
        tags: ["Public - Banners"],
        summary: "Get active banners by position",
        parameters: [
          { name: "position", in: "path", required: true, schema: { type: "string", enum: ["HOME_TOP", "HOME_MIDDLE", "HOME_BOTTOM", "POPUP", "SIDEBAR"] } },
        ],
        responses: { 200: { description: "Banners for position" } },
      },
    },
    "/public/banners/slug/{slug}": {
      get: {
        tags: ["Public - Banners"],
        summary: "Get banner by slug",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string", example: "summer-ev-sale-2025" } }],
        responses: { 200: { description: "Banner" }, 404: { description: "Banner not found" } },
      },
    },

    // ════════════════════════════════════════
    // PUBLIC - BRANDS
    // ════════════════════════════════════════
    "/public/brands/get-all": {
      get: {
        tags: ["Public - Brands"],
        summary: "Get all active brands",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "offset", in: "query", schema: { type: "integer", example: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 20 } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "inactive", "archived"] } },
          { name: "sort_by", in: "query", schema: { type: "string", enum: ["name", "created_at", "updated_at", "status", "founded"], example: "name" } },
          { name: "sort_order", in: "query", schema: { type: "string", enum: ["asc", "desc"], example: "asc" } },
        ],
        responses: { 200: { description: "Brands list" } },
      },
    },
    "/public/brands/{id}": {
      get: {
        tags: ["Public - Brands"],
        summary: "Get brand by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Brand" }, 404: { description: "Brand not found" } },
      },
    },
    "/public/brands/slug/{slug}": {
      get: {
        tags: ["Public - Brands"],
        summary: "Get brand by slug",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string", example: "tesla" } }],
        responses: { 200: { description: "Brand" }, 404: { description: "Brand not found" } },
      },
    },

    // ════════════════════════════════════════
    // PUBLIC - MODELS
    // ════════════════════════════════════════
    "/public/models/get-all": {
      get: {
        tags: ["Public - Models"],
        summary: "Get all active vehicle models",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "brand_id", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "discontinued", "upcoming"] } },
          { name: "offset", in: "query", schema: { type: "integer", example: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 20 } },
          { name: "sort_by", in: "query", schema: { type: "string" } },
          { name: "sort_order", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
        ],
        responses: { 200: { description: "Models list" } },
      },
    },

    // ════════════════════════════════════════
    // PUBLIC - VARIANTS
    // ════════════════════════════════════════
    "/public/variants/get-all": {
      get: {
        tags: ["Public - Variants"],
        summary: "Get all active variants",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "model_id", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "discontinued", "upcoming"] } },
          { name: "segment", in: "query", schema: { type: "string" } },
          { name: "launch_year", in: "query", schema: { type: "integer", example: 2024 } },
          { name: "offset", in: "query", schema: { type: "integer", example: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 20 } },
          { name: "sort_by", in: "query", schema: { type: "string" } },
          { name: "sort_order", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
        ],
        responses: { 200: { description: "Variants list" } },
      },
    },
    "/public/variants/{id}": {
      get: {
        tags: ["Public - Variants"],
        summary: "Get variant by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Variant" }, 404: { description: "Variant not found" } },
      },
    },
    "/public/variants/slug/{slug}": {
      get: {
        tags: ["Public - Variants"],
        summary: "Get variant by slug",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string", example: "model-3-long-range-awd" } }],
        responses: { 200: { description: "Variant" } },
      },
    },

    // ════════════════════════════════════════
    // PUBLIC - SUB-VARIANTS
    // ════════════════════════════════════════
    "/public/sub-variants/get-all": {
      get: {
        tags: ["Public - Sub-Variants"],
        summary: "Get all active sub-variants",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "variant_id", in: "query", schema: { type: "string" } },
          { name: "fuel_type", in: "query", schema: { type: "string", enum: ["Petrol", "Diesel", "EV", "Hybrid", "CNG", "PHEV"] } },
          { name: "transmission", in: "query", schema: { type: "string", enum: ["Manual", "Automatic", "CVT", "AMT", "DCT"] } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "discontinued", "upcoming"] } },
          { name: "min_price", in: "query", schema: { type: "number", example: 500000 } },
          { name: "max_price", in: "query", schema: { type: "number", example: 3000000 } },
          { name: "offset", in: "query", schema: { type: "integer", example: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 10 } },
          { name: "sort_by", in: "query", schema: { type: "string", example: "created_at" } },
          { name: "sort_order", in: "query", schema: { type: "string", enum: ["asc", "desc"], example: "desc" } },
        ],
        responses: { 200: { description: "Sub-variants list with pagination" } },
      },
    },
    "/public/sub-variants/get-featured": {
      get: {
        tags: ["Public - Sub-Variants"],
        summary: "Get featured sub-variants",
        parameters: [{ name: "limit", in: "query", schema: { type: "integer", example: 6 } }],
        responses: { 200: { description: "Featured sub-variants" } },
      },
    },
    "/public/sub-variants/get-latest": {
      get: {
        tags: ["Public - Sub-Variants"],
        summary: "Get latest added sub-variants",
        parameters: [{ name: "limit", in: "query", schema: { type: "integer", example: 10 } }],
        responses: { 200: { description: "Latest sub-variants" } },
      },
    },
    "/public/sub-variants/slug/{slug}": {
      get: {
        tags: ["Public - Sub-Variants"],
        summary: "Get sub-variant by slug",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string", example: "hyundai-creta-sx-petrol-mt" } }],
        responses: { 200: { description: "Sub-variant details with pricing and specs" } },
      },
    },
    "/public/sub-variants/{id}": {
      get: {
        tags: ["Public - Sub-Variants"],
        summary: "Get sub-variant by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Sub-variant details" }, 404: { description: "Sub-variant not found" } },
      },
    },
    "/public/sub-variants/variant/{variantId}": {
      get: {
        tags: ["Public - Sub-Variants"],
        summary: "Get all sub-variants for a variant",
        parameters: [
          { name: "variantId", in: "path", required: true, schema: { type: "string" } },
          { name: "offset", in: "query", schema: { type: "integer", example: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 20 } },
        ],
        responses: { 200: { description: "Sub-variants for variant, sorted by fuel type then transmission" } },
      },
    },
    "/public/compare/sub-variants": {
      post: {
        tags: ["Public - Sub-Variants"],
        summary: "Compare multiple sub-variants",
        description: "Side-by-side comparison of 2–4 sub-variants including pricing and specifications.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CompareSubVariants" } } },
        },
        responses: { 200: { description: "Side-by-side sub-variant comparison data" } },
      },
    },

    // ════════════════════════════════════════
    // PUBLIC - SEARCH & FILTERS
    // ════════════════════════════════════════
    "/public/search/vehicles": {
      get: {
        tags: ["Public - Search & Filters"],
        summary: "Search sub-variants",
        parameters: [
          { name: "query", in: "query", schema: { type: "string", example: "Hyundai", description: "Free text search query (max 100 chars)" } },
          { name: "brand_id", in: "query", schema: { type: "string" } },
          { name: "model_id", in: "query", schema: { type: "string" } },
          { name: "fuel_type", in: "query", schema: { type: "string", enum: ["Petrol", "Diesel", "EV", "Hybrid", "CNG", "PHEV"] } },
          { name: "transmission", in: "query", schema: { type: "string", enum: ["Manual", "Automatic", "CVT", "AMT", "DCT"] } },
          { name: "body_type", in: "query", schema: { type: "string", enum: ["Sedan", "SUV", "Hatchback", "Crossover", "Coupe", "Convertible", "Truck", "Van"] } },
          { name: "drivetrain", in: "query", schema: { type: "string", enum: ["AWD", "RWD", "FWD", "4WD"] } },
          { name: "min_price", in: "query", schema: { type: "number", example: 500000 } },
          { name: "max_price", in: "query", schema: { type: "number", example: 3000000 } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "discontinued", "upcoming"] } },
          { name: "offset", in: "query", schema: { type: "integer", example: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 10 } },
          { name: "sort_by", in: "query", schema: { type: "string", example: "view_count" } },
        ],
        responses: { 200: { description: "Search results" } },
      },
    },
    "/public/filters/get-all": {
      get: {
        tags: ["Public - Search & Filters"],
        summary: "Get all available filter options",
        description: "Returns filter facets: brands, fuel types, transmission types, price ranges, body types, etc.",
        parameters: [
          { name: "include_counts", in: "query", schema: { type: "boolean", example: true } },
          { name: "category", in: "query", schema: { type: "string", enum: ["all", "ev", "hybrid", "ice"], example: "all" } },
        ],
        responses: { 200: { description: "Filter options" } },
      },
    },

    // ════════════════════════════════════════
    // PUBLIC - REVIEWS
    // ════════════════════════════════════════
    "/public/reviews/sub-variant/{subVariantId}": {
      get: {
        tags: ["Public - Reviews"],
        summary: "Get approved reviews for a sub-variant",
        parameters: [
          { name: "subVariantId", in: "path", required: true, schema: { type: "string" } },
          { name: "offset", in: "query", schema: { type: "integer", example: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 10 } },
          { name: "sort_by", in: "query", schema: { type: "string", enum: ["helpful_count", "rating", "created_at"], example: "helpful_count" } },
          { name: "sort_order", in: "query", schema: { type: "string", enum: ["asc", "desc"], example: "desc" } },
          { name: "min_rating", in: "query", schema: { type: "number", minimum: 0, maximum: 5 } },
          { name: "max_rating", in: "query", schema: { type: "number", minimum: 0, maximum: 5 } },
        ],
        responses: { 200: { description: "Approved reviews" } },
      },
    },

    // ════════════════════════════════════════
    // PUBLIC - DEALERS
    // ════════════════════════════════════════
    "/public/dealers/get-nearby": {
      get: {
        tags: ["Public - Dealers"],
        summary: "Find nearby dealers",
        parameters: [
          { name: "lat", in: "query", required: true, schema: { type: "number", minimum: -90, maximum: 90, example: 19.076 } },
          { name: "lng", in: "query", required: true, schema: { type: "number", minimum: -180, maximum: 180, example: 72.8777 } },
          { name: "radius", in: "query", schema: { type: "number", minimum: 1, maximum: 100, example: 10, description: "Radius in km (default: 10)" } },
          { name: "brand_id", in: "query", schema: { type: "string" } },
          { name: "service", in: "query", schema: { type: "string", enum: ["sales", "service", "parts", "financing", "insurance", "test_drive"] } },
          { name: "limit", in: "query", schema: { type: "integer", example: 10 } },
        ],
        responses: { 200: { description: "Nearby dealers sorted by distance" } },
      },
    },
    "/public/dealers/brand/{brandId}": {
      get: {
        tags: ["Public - Dealers"],
        summary: "Get dealers by brand",
        parameters: [
          { name: "brandId", in: "path", required: true, schema: { type: "string" } },
          { name: "offset", in: "query", schema: { type: "integer", example: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 10 } },
        ],
        responses: { 200: { description: "Dealers for brand" } },
      },
    },
  },
  tags: [
    { name: "Auth", description: "Admin authentication and user management" },
    { name: "Media", description: "File upload via Bunny CDN presigned URLs" },
    { name: "Blogs (Admin)", description: "Blog content management (admin)" },
    { name: "Banners (Admin)", description: "Promotional banner management (admin)" },
    { name: "Brands (Admin)", description: "Vehicle brand management (admin)" },
    { name: "Vehicle Models (Admin)", description: "Vehicle model management (admin)" },
    { name: "Variants (Admin)", description: "Vehicle variant management (admin)" },
    { name: "Sub-Variants (Admin)", description: "Sub-variant (final sellable unit) management (admin)" },
    { name: "Pricing (Admin)", description: "City-aware pricing management (admin)" },
    { name: "Specifications (Admin)", description: "Technical specifications management (admin)" },
    { name: "Reviews (Admin)", description: "Review moderation and management (admin)" },
    { name: "Dealers (Admin)", description: "Dealer/service center management (admin)" },
    { name: "Stats & Analytics", description: "Platform-wide statistics and analytics" },
    { name: "Public - Banners", description: "Public banner endpoints" },
    { name: "Public - Brands", description: "Public brand listing" },
    { name: "Public - Models", description: "Public vehicle model listing" },
    { name: "Public - Variants", description: "Public variant listing" },
    { name: "Public - Sub-Variants", description: "Public sub-variant catalog, comparison, and detail pages" },
    { name: "Public - Search & Filters", description: "Vehicle search and filter facets" },
    { name: "Public - Reviews", description: "Public sub-variant reviews" },
    { name: "Public - Dealers", description: "Public dealer search" },
  ],
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
