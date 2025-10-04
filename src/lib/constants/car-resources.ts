/**
 * 加拿大汽车资源配置
 * 包含二手车平台、车辆信息工具等资源
 */

/**
 * 二手车平台配置
 */
export const USED_CAR_PLATFORMS = {
  AUTOTRADER: {
    name: 'AutoTrader.ca',
    url: 'https://www.autotrader.ca/',
    description: '加拿大最大二手车平台',
    type: 'marketplace',
    search_template: 'https://www.autotrader.ca/cars/{make}/{model}/',
    features: ['价格比较', '车辆历史', '经销商网络'],
    coverage: '全国',
    languages: ['en', 'fr']
  },
  CARGURUS: {
    name: 'CarGurus Canada',
    url: 'https://www.cargurus.ca/',
    description: '价格评估实用',
    type: 'marketplace',
    search_template: 'https://www.cargurus.ca/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?sourceContext=carGurusHomePageModel&entitySelectingHelper.selectedEntity={make}+{model}',
    features: ['价格分析', '市场趋势', '车辆评分'],
    coverage: '全国',
    languages: ['en', 'fr']
  },
  KIJIJI: {
    name: 'Kijiji Autos',
    url: 'https://www.kijiji.ca/b-cars-vehicles/canada/c27l0',
    description: '个人卖家常用',
    type: 'classified',
    search_template: 'https://www.kijiji.ca/b-cars-vehicles/canada/{make}-{model}/c27l0',
    features: ['个人卖家', '价格谈判', '本地交易'],
    coverage: '全国',
    languages: ['en', 'fr']
  },
  CARS_DOT_COM: {
    name: 'Cars.com Canada',
    url: 'https://www.cars.com/',
    description: '美国平台加拿大版',
    type: 'marketplace',
    search_template: 'https://www.cars.com/for-sale/searchresults.action/?mkId={make}&mdId={model}',
    features: ['详细规格', '比较工具', '融资计算器'],
    coverage: '全国',
    languages: ['en']
  }
} as const;

/**
 * 车辆信息工具配置
 */
export const VEHICLE_INFO_TOOLS = {
  CARFAX_CANADA: {
    name: 'CARFAX Canada',
    url: 'https://www.carfax.ca/',
    description: '车辆历史报告',
    type: 'history_report',
    cost_per_report: 39.99,
    features: ['事故记录', '维护历史', '所有权变更', '里程验证'],
    coverage: '加拿大',
    languages: ['en', 'fr']
  },
  KBB_CANADA: {
    name: 'Kelley Blue Book Canada',
    url: 'https://www.kbb.ca/',
    description: '车辆估值工具',
    type: 'valuation',
    cost_per_report: 0,
    free_tier: true,
    features: ['价格估算', '市场价值', '交易价值', '私人销售价值'],
    coverage: '加拿大',
    languages: ['en', 'fr']
  },
  VIN_DECODER: {
    name: 'VIN Decoder Canada',
    url: 'https://vindecoder.ca/',
    description: 'VIN码解码工具',
    type: 'decoder',
    cost_per_report: 0,
    free_tier: true,
    features: ['车辆规格', '制造信息', '安全配置', '选项包'],
    coverage: '全球',
    languages: ['en']
  },
  ICBC: {
    name: 'ICBC Vehicle Information',
    url: 'https://www.icbc.com/',
    description: 'BC省车辆信息查询',
    type: 'government',
    cost_per_report: 0,
    free_tier: true,
    features: ['注册信息', '保险历史', '事故记录', '违规记录'],
    coverage: 'BC省',
    languages: ['en']
  }
} as const;

/**
 * 汽车保险提供商配置
 */
export const INSURANCE_PROVIDERS = {
  ICBC: {
    name: 'ICBC',
    url: 'https://www.icbc.com/',
    description: 'BC省公共保险公司',
    coverage: 'BC省',
    type: 'public',
    features: ['基本保险', '可选保险', '无过错保险']
  },
  INTACT: {
    name: 'Intact Insurance',
    url: 'https://www.intact.ca/',
    description: '全国性保险公司',
    coverage: '全国',
    type: 'private',
    features: ['全险', '第三方责任', '碰撞保险', '综合保险']
  },
  TD_INSURANCE: {
    name: 'TD Insurance',
    url: 'https://www.tdinsurance.com/',
    description: 'TD银行保险部门',
    coverage: '全国',
    type: 'private',
    features: ['多车折扣', '无索赔折扣', '防盗设备折扣']
  },
  COOPERATORS: {
    name: 'The Co-operators',
    url: 'https://www.cooperators.ca/',
    description: '合作社保险公司',
    coverage: '全国',
    type: 'private',
    features: ['环保车辆折扣', '安全驾驶折扣', '多产品折扣']
  }
} as const;

/**
 * 汽车贷款提供商配置
 */
export const FINANCING_PROVIDERS = {
  BANKS: {
    RBC: {
      name: 'RBC Royal Bank',
      url: 'https://www.rbcroyalbank.com/personal/loans/auto-loans.html',
      description: '加拿大皇家银行汽车贷款',
      features: ['低利率', '灵活还款', '在线申请'],
      coverage: '全国'
    },
    TD: {
      name: 'TD Canada Trust',
      url: 'https://www.td.com/ca/en/personal-banking/loans-and-lines-of-credit/auto-loans',
      description: 'TD银行汽车贷款',
      features: ['快速审批', '在线管理', '提前还款无罚金'],
      coverage: '全国'
    },
    SCOTIABANK: {
      name: 'Scotiabank',
      url: 'https://www.scotiabank.com/ca/en/personal/loans/auto-loans.html',
      description: '丰业银行汽车贷款',
      features: ['竞争利率', '灵活期限', '在线申请'],
      coverage: '全国'
    }
  },
  CREDIT_UNIONS: {
    VANCOUVER_CITY_SAVINGS: {
      name: 'Vancity Credit Union',
      url: 'https://www.vancity.com/',
      description: '温哥华城市储蓄信用合作社',
      features: ['社区支持', '环保车辆优惠', '灵活还款'],
      coverage: 'BC省'
    }
  },
  DEALERSHIP_FINANCING: {
    GENERAL: {
      name: 'Dealership Financing',
      description: '经销商融资',
      features: ['便捷申请', '特殊促销', '一站式服务'],
      coverage: '全国'
    }
  }
} as const;

/**
 * 汽车维修和保养配置
 */
export const MAINTENANCE_SERVICES = {
  DEALERSHIP_SERVICE: {
    name: 'Dealership Service Centers',
    description: '经销商服务中心',
    features: ['原厂零件', '专业技师', '保修服务'],
    coverage: '全国'
  },
  INDEPENDENT_SHOPS: {
    name: 'Independent Repair Shops',
    description: '独立维修店',
    features: ['价格竞争', '灵活服务', '本地技师'],
    coverage: '全国'
  },
  CHAIN_SHOPS: {
    MISTER_LUBE: {
      name: 'Mr. Lube',
      url: 'https://www.mrlube.com/',
      description: '快速换油服务',
      features: ['快速服务', '全国连锁', '在线预约'],
      coverage: '全国'
    },
    CANADIAN_TIRE: {
      name: 'Canadian Tire Auto Service',
      url: 'https://www.canadiantire.ca/',
      description: '加拿大轮胎汽车服务',
      features: ['全面服务', '零件供应', '全国覆盖'],
      coverage: '全国'
    }
  }
} as const;

/**
 * 汽车配件和改装配置
 */
export const ACCESSORIES_PROVIDERS = {
  CANADIAN_TIRE: {
    name: 'Canadian Tire',
    url: 'https://www.canadiantire.ca/',
    description: '汽车配件和工具',
    features: ['广泛选择', '在线购物', '店内取货'],
    coverage: '全国'
  },
  AUTOZONE: {
    name: 'AutoZone Canada',
    url: 'https://www.autozone.ca/',
    description: '汽车零件和配件',
    features: ['专业零件', '在线目录', '技术建议'],
    coverage: '全国'
  },
  NAPA: {
    name: 'NAPA Auto Parts',
    url: 'https://www.napacanada.com/',
    description: '专业汽车零件',
    features: ['专业品质', '技术支援', '全国网络'],
    coverage: '全国'
  }
} as const;

/**
 * 汽车运输和物流配置
 */
export const TRANSPORTATION_SERVICES = {
  AUTO_SHIPPING: {
    name: 'Auto Shipping Services',
    description: '汽车运输服务',
    features: ['跨省运输', '保险覆盖', '门到门服务'],
    coverage: '全国'
  },
  FERRY_SERVICES: {
    BC_FERRIES: {
      name: 'BC Ferries',
      url: 'https://www.bcferries.com/',
      description: 'BC省渡轮服务',
      features: ['车辆运输', '预订服务', '实时信息'],
      coverage: 'BC省'
    }
  }
} as const;

/**
 * 汽车环保和回收配置
 */
export const ENVIRONMENTAL_SERVICES = {
  SCRAP_IT: {
    name: 'Scrap-It Program',
    url: 'https://scrapit.ca/',
    description: '旧车回收奖励计划',
    features: ['现金奖励', '环保处理', '交通卡奖励'],
    coverage: 'BC省'
  },
  RETIRE_YOUR_RIDE: {
    name: 'Retire Your Ride',
    url: 'https://www.retireyourride.ca/',
    description: '全国旧车回收计划',
    features: ['环保奖励', '安全处理', '多种奖励'],
    coverage: '全国'
  }
} as const;

/**
 * 获取平台搜索URL
 * @param platform 平台名称
 * @param make 品牌
 * @param model 型号
 * @returns 搜索URL
 */
export function getPlatformSearchUrl(
  platform: keyof typeof USED_CAR_PLATFORMS,
  make: string,
  model: string
): string {
  const platformConfig = USED_CAR_PLATFORMS[platform];
  if (!platformConfig) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  return platformConfig.search_template
    .replace('{make}', make.toLowerCase())
    .replace('{model}', model.toLowerCase());
}

/**
 * 获取所有平台列表
 * @returns 平台列表
 */
export function getAllPlatforms(): Array<{
  key: string;
  name: string;
  url: string;
  description: string;
  type: string;
}> {
  return Object.entries(USED_CAR_PLATFORMS).map(([key, config]) => ({
    key,
    name: config.name,
    url: config.url,
    description: config.description,
    type: config.type
  }));
}

/**
 * 获取车辆信息工具列表
 * @returns 工具列表
 */
export function getVehicleInfoTools(): Array<{
  key: string;
  name: string;
  url: string;
  description: string;
  type: string;
  cost: number;
  free: boolean;
}> {
  return Object.entries(VEHICLE_INFO_TOOLS).map(([key, config]) => ({
    key,
    name: config.name,
    url: config.url,
    description: config.description,
    type: config.type,
    cost: config.cost_per_report || 0,
    free: 'free_tier' in config ? config.free_tier : false
  }));
}

/**
 * 获取保险提供商列表
 * @returns 保险提供商列表
 */
export function getInsuranceProviders(): Array<{
  key: string;
  name: string;
  url: string;
  description: string;
  coverage: string;
  type: string;
}> {
  return Object.entries(INSURANCE_PROVIDERS).map(([key, config]) => ({
    key,
    name: config.name,
    url: config.url,
    description: config.description,
    coverage: config.coverage,
    type: config.type
  }));
}
