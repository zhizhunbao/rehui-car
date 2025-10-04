/**
 * 汽车资源常量
 * 包含汽车品牌、型号、价格范围等静态数据
 */

/**
 * 汽车品牌信息
 */
export const CAR_BRANDS = {
  // 日系品牌
  toyota: {
    name: { en: 'Toyota', zh: '丰田' },
    country: 'Japan',
    reliability: 9.2,
    price_range: { min: 20000, max: 80000 },
    popular_models: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius']
  },
  
  honda: {
    name: { en: 'Honda', zh: '本田' },
    country: 'Japan',
    reliability: 9.0,
    price_range: { min: 22000, max: 75000 },
    popular_models: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit']
  },
  
  mazda: {
    name: { en: 'Mazda', zh: '马自达' },
    country: 'Japan',
    reliability: 8.8,
    price_range: { min: 25000, max: 70000 },
    popular_models: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5']
  },
  
  subaru: {
    name: { en: 'Subaru', zh: '斯巴鲁' },
    country: 'Japan',
    reliability: 8.9,
    price_range: { min: 28000, max: 85000 },
    popular_models: ['Impreza', 'Legacy', 'Outback', 'Forester', 'WRX']
  },
  
  nissan: {
    name: { en: 'Nissan', zh: '日产' },
    country: 'Japan',
    reliability: 8.5,
    price_range: { min: 20000, max: 90000 },
    popular_models: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Leaf']
  },
  
  // 德系品牌
  bmw: {
    name: { en: 'BMW', zh: '宝马' },
    country: 'Germany',
    reliability: 8.3,
    price_range: { min: 40000, max: 150000 },
    popular_models: ['3 Series', '5 Series', 'X3', 'X5', 'i3']
  },
  
  mercedes: {
    name: { en: 'Mercedes-Benz', zh: '奔驰' },
    country: 'Germany',
    reliability: 8.4,
    price_range: { min: 45000, max: 200000 },
    popular_models: ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class']
  },
  
  audi: {
    name: { en: 'Audi', zh: '奥迪' },
    country: 'Germany',
    reliability: 8.2,
    price_range: { min: 40000, max: 180000 },
    popular_models: ['A3', 'A4', 'A6', 'Q5', 'Q7']
  },
  
  volkswagen: {
    name: { en: 'Volkswagen', zh: '大众' },
    country: 'Germany',
    reliability: 8.0,
    price_range: { min: 25000, max: 80000 },
    popular_models: ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'ID.4']
  },
  
  // 美系品牌
  ford: {
    name: { en: 'Ford', zh: '福特' },
    country: 'USA',
    reliability: 8.1,
    price_range: { min: 22000, max: 90000 },
    popular_models: ['F-150', 'Escape', 'Explorer', 'Mustang', 'Bronco']
  },
  
  chevrolet: {
    name: { en: 'Chevrolet', zh: '雪佛兰' },
    country: 'USA',
    reliability: 8.0,
    price_range: { min: 20000, max: 85000 },
    popular_models: ['Silverado', 'Equinox', 'Tahoe', 'Camaro', 'Bolt']
  },
  
  // 韩系品牌
  hyundai: {
    name: { en: 'Hyundai', zh: '现代' },
    country: 'South Korea',
    reliability: 8.6,
    price_range: { min: 18000, max: 70000 },
    popular_models: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Ioniq']
  },
  
  kia: {
    name: { en: 'Kia', zh: '起亚' },
    country: 'South Korea',
    reliability: 8.4,
    price_range: { min: 18000, max: 65000 },
    popular_models: ['Forte', 'Optima', 'Sportage', 'Sorento', 'EV6']
  }
};

/**
 * 汽车类型分类
 */
export const CAR_TYPES = {
  sedan: {
    name: { en: 'Sedan', zh: '轿车' },
    description: { en: 'Four-door passenger car with separate trunk', zh: '四门乘用车，独立后备箱' },
    characteristics: ['fuel_efficient', 'comfortable', 'practical'],
    price_range: { min: 20000, max: 80000 }
  },
  
  suv: {
    name: { en: 'SUV', zh: 'SUV' },
    description: { en: 'Sport Utility Vehicle with higher ground clearance', zh: '运动型多功能车，离地间隙较高' },
    characteristics: ['spacious', 'versatile', 'all_weather'],
    price_range: { min: 25000, max: 100000 }
  },
  
  hatchback: {
    name: { en: 'Hatchback', zh: '掀背车' },
    description: { en: 'Compact car with rear door that includes the window', zh: '紧凑型车，后门包含车窗' },
    characteristics: ['compact', 'fuel_efficient', 'easy_parking'],
    price_range: { min: 18000, max: 50000 }
  },
  
  coupe: {
    name: { en: 'Coupe', zh: '双门跑车' },
    description: { en: 'Two-door car with sporty design', zh: '两门车，运动型设计' },
    characteristics: ['sporty', 'stylish', 'performance'],
    price_range: { min: 30000, max: 120000 }
  },
  
  truck: {
    name: { en: 'Truck', zh: '卡车' },
    description: { en: 'Vehicle designed for carrying cargo', zh: '设计用于载货的车辆' },
    characteristics: ['powerful', 'practical', 'towing'],
    price_range: { min: 35000, max: 120000 }
  }
};

/**
 * 价格范围分类
 */
export const PRICE_RANGES = {
  budget: {
    name: { en: 'Budget', zh: '经济型' },
    range: { min: 15000, max: 30000 },
    description: { en: 'Affordable entry-level vehicles', zh: '经济实惠的入门级车辆' }
  },
  
  mid_range: {
    name: { en: 'Mid-Range', zh: '中档' },
    range: { min: 30000, max: 60000 },
    description: { en: 'Balanced features and value', zh: '功能与价值平衡' }
  },
  
  luxury: {
    name: { en: 'Luxury', zh: '豪华' },
    range: { min: 60000, max: 150000 },
    description: { en: 'Premium features and comfort', zh: '高端功能和舒适性' }
  },
  
  ultra_luxury: {
    name: { en: 'Ultra Luxury', zh: '超豪华' },
    range: { min: 150000, max: 500000 },
    description: { en: 'Exclusive high-end vehicles', zh: '专属高端车辆' }
  }
};

/**
 * 燃料类型
 */
export const FUEL_TYPES = {
  gasoline: {
    name: { en: 'Gasoline', zh: '汽油' },
    description: { en: 'Traditional internal combustion engine', zh: '传统内燃机' },
    pros: ['widely_available', 'proven_technology', 'lower_initial_cost'],
    cons: ['emissions', 'fuel_costs', 'maintenance']
  },
  
  hybrid: {
    name: { en: 'Hybrid', zh: '混合动力' },
    description: { en: 'Combines gasoline engine with electric motor', zh: '汽油发动机与电动机结合' },
    pros: ['fuel_efficient', 'lower_emissions', 'tax_incentives'],
    cons: ['higher_initial_cost', 'battery_replacement']
  },
  
  electric: {
    name: { en: 'Electric', zh: '电动' },
    description: { en: 'Fully electric vehicle with battery', zh: '完全电动车辆，使用电池' },
    pros: ['zero_emissions', 'low_operating_cost', 'quiet'],
    cons: ['charging_infrastructure', 'range_anxiety', 'battery_degradation']
  },
  
  diesel: {
    name: { en: 'Diesel', zh: '柴油' },
    description: { en: 'Diesel engine for better fuel economy', zh: '柴油发动机，燃油经济性更好' },
    pros: ['fuel_efficient', 'torque', 'long_range'],
    cons: ['emissions', 'higher_fuel_cost', 'maintenance']
  }
};

/**
 * 安全评级
 */
export const SAFETY_RATINGS = {
  excellent: {
    name: { en: 'Excellent', zh: '优秀' },
    score: { min: 9.0, max: 10.0 },
    description: { en: 'Top safety performance', zh: '顶级安全性能' }
  },
  
  good: {
    name: { en: 'Good', zh: '良好' },
    score: { min: 7.0, max: 8.9 },
    description: { en: 'Solid safety performance', zh: '可靠的安全性能' }
  },
  
  average: {
    name: { en: 'Average', zh: '一般' },
    score: { min: 5.0, max: 6.9 },
    description: { en: 'Acceptable safety performance', zh: '可接受的安全性能' }
  },
  
  poor: {
    name: { en: 'Poor', zh: '较差' },
    score: { min: 0.0, max: 4.9 },
    description: { en: 'Below average safety performance', zh: '低于平均水平的安全性能' }
  }
};

/**
 * 加拿大省份和地区
 */
export const CANADIAN_PROVINCES = {
  ontario: {
    name: { en: 'Ontario', zh: '安大略省' },
    code: 'ON',
    major_cities: ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Windsor']
  },
  
  quebec: {
    name: { en: 'Quebec', zh: '魁北克省' },
    code: 'QC',
    major_cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil']
  },
  
  british_columbia: {
    name: { en: 'British Columbia', zh: '不列颠哥伦比亚省' },
    code: 'BC',
    major_cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond']
  },
  
  alberta: {
    name: { en: 'Alberta', zh: '阿尔伯塔省' },
    code: 'AB',
    major_cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'St. Albert']
  },
  
  manitoba: {
    name: { en: 'Manitoba', zh: '马尼托巴省' },
    code: 'MB',
    major_cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie']
  },
  
  saskatchewan: {
    name: { en: 'Saskatchewan', zh: '萨斯喀彻温省' },
    code: 'SK',
    major_cities: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current']
  },
  
  nova_scotia: {
    name: { en: 'Nova Scotia', zh: '新斯科舍省' },
    code: 'NS',
    major_cities: ['Halifax', 'Sydney', 'Dartmouth', 'Truro', 'New Glasgow']
  },
  
  new_brunswick: {
    name: { en: 'New Brunswick', zh: '新不伦瑞克省' },
    code: 'NB',
    major_cities: ['Moncton', 'Saint John', 'Fredericton', 'Dieppe', 'Riverview']
  },
  
  newfoundland: {
    name: { en: 'Newfoundland and Labrador', zh: '纽芬兰和拉布拉多省' },
    code: 'NL',
    major_cities: ['St. John\'s', 'Mount Pearl', 'Conception Bay South', 'Corner Brook', 'Grand Falls-Windsor']
  },
  
  prince_edward_island: {
    name: { en: 'Prince Edward Island', zh: '爱德华王子岛省' },
    code: 'PE',
    major_cities: ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague']
  }
};

/**
 * 汽车功能特性
 */
export const CAR_FEATURES = {
  safety: [
    'airbags', 'abs', 'traction_control', 'stability_control', 'blind_spot_monitoring',
    'lane_departure_warning', 'forward_collision_warning', 'automatic_emergency_braking',
    'rear_view_camera', 'parking_sensors'
  ],
  
  comfort: [
    'leather_seats', 'heated_seats', 'ventilated_seats', 'power_seats', 'memory_seats',
    'climate_control', 'dual_zone_ac', 'sunroof', 'moonroof', 'premium_audio'
  ],
  
  technology: [
    'touchscreen', 'navigation', 'bluetooth', 'usb_ports', 'wireless_charging',
    'apple_carplay', 'android_auto', 'wifi_hotspot', 'voice_control', 'head_up_display'
  ],
  
  performance: [
    'turbo_engine', 'all_wheel_drive', 'four_wheel_drive', 'sport_mode', 'paddle_shifters',
    'performance_brakes', 'sport_suspension', 'limited_slip_differential'
  ]
};

/**
 * 获取品牌信息
 */
export function getBrandInfo(brandKey: string) {
  return CAR_BRANDS[brandKey as keyof typeof CAR_BRANDS];
}

/**
 * 获取车型信息
 */
export function getCarTypeInfo(typeKey: string) {
  return CAR_TYPES[typeKey as keyof typeof CAR_TYPES];
}

/**
 * 获取价格范围信息
 */
export function getPriceRangeInfo(priceKey: string) {
  return PRICE_RANGES[priceKey as keyof typeof PRICE_RANGES];
}

/**
 * 获取燃料类型信息
 */
export function getFuelTypeInfo(fuelKey: string) {
  return FUEL_TYPES[fuelKey as keyof typeof FUEL_TYPES];
}

/**
 * 根据价格获取价格范围
 */
export function getPriceRangeByValue(price: number): string {
  for (const [key, range] of Object.entries(PRICE_RANGES)) {
    if (price >= range.range.min && price <= range.range.max) {
      return key;
    }
  }
  return 'unknown';
}

/**
 * 获取所有品牌列表
 */
export function getAllBrands(): Array<{ key: string; name: { en: string; zh: string } }> {
  return Object.entries(CAR_BRANDS).map(([key, brand]) => ({
    key,
    name: brand.name
  }));
}

/**
 * 获取所有车型列表
 */
export function getAllCarTypes(): Array<{ key: string; name: { en: string; zh: string } }> {
  return Object.entries(CAR_TYPES).map(([key, type]) => ({
    key,
    name: type.name
  }));
}

/**
 * 搜索品牌
 */
export function searchBrands(query: string): Array<{ key: string; name: { en: string; zh: string } }> {
  const lowerQuery = query.toLowerCase();
  return getAllBrands().filter(brand => 
    brand.name.en.toLowerCase().includes(lowerQuery) ||
    brand.name.zh.includes(query)
  );
}

/**
 * 搜索车型
 */
export function searchCarTypes(query: string): Array<{ key: string; name: { en: string; zh: string } }> {
  const lowerQuery = query.toLowerCase();
  return getAllCarTypes().filter(type => 
    type.name.en.toLowerCase().includes(lowerQuery) ||
    type.name.zh.includes(query)
  );
}