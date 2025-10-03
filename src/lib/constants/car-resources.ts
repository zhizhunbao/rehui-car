/**
 * 加拿大汽车资源配置
 * 包含各种汽车购买平台、经销商、金融服务等信息
 */

// 二手车平台配置
export const USED_CAR_PLATFORMS = {
  // 主流平台
  AUTOTRADER: {
    name: 'AutoTrader.ca',
    url: 'https://www.autotrader.ca/',
    description: '加拿大最大二手车平台，新车+二手车，覆盖面最广',
    type: 'marketplace',
    features: ['new_cars', 'used_cars', 'dealer_network', 'price_alerts'],
    search_template: 'https://www.autotrader.ca/cars/{make}/{model}/'
  },
  CARGURUS: {
    name: 'CarGurus Canada',
    url: 'https://www.cargurus.ca/Cars/spt-used-cars',
    description: 'CarGurus加拿大站，价格评估(Fair/Good/Bad Deal)很实用',
    type: 'marketplace',
    features: ['price_analysis', 'deal_rating', 'market_insights'],
    search_template: 'https://www.cargurus.ca/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?sourceContext=carGurusHomePageModel&entitySelectingHelper.selectedEntity={make}'
  },
  CARPAGES: {
    name: 'CarPages.ca',
    url: 'https://www.carpages.ca/',
    description: '本地化二手车网站，车源覆盖全国但偏地方车商',
    type: 'marketplace',
    features: ['local_dealers', 'nationwide_coverage'],
    search_template: 'https://www.carpages.ca/used-cars/{make}/{model}/'
  },
  CLUTCH: {
    name: 'Clutch.ca',
    url: 'https://www.clutch.ca/',
    description: '在线零售商，提供整备车+送车到家服务',
    type: 'online_retailer',
    features: ['home_delivery', 'vehicle_preparation', 'warranty'],
    search_template: 'https://www.clutch.ca/cars/{make}/{model}/'
  },
  CANADA_DRIVES: {
    name: 'Canada Drives',
    url: 'https://www.canadadrives.ca/',
    description: '在线购车平台，支持车辆送货上门',
    type: 'online_retailer',
    features: ['home_delivery', 'financing', 'trade_in'],
    search_template: 'https://www.canadadrives.ca/cars/{make}/{model}/'
  },
  KIJIJI: {
    name: 'Kijiji Autos',
    url: 'https://www.kijiji.ca/b-cars-vehicles/canada/c27l0',
    description: 'Kijiji分类广告，个人卖家和小车行常用',
    type: 'classified',
    features: ['private_sellers', 'local_deals', 'negotiable_prices'],
    search_template: 'https://www.kijiji.ca/b-cars-vehicles/canada/{make}+{model}/k0c27l0'
  },
  FACEBOOK_MARKETPLACE: {
    name: 'Facebook Marketplace',
    url: 'https://www.facebook.com/marketplace/category/vehicles/',
    description: 'Facebook Marketplace，本地人气最高的私人卖车渠道',
    type: 'classified',
    features: ['private_sellers', 'local_focus', 'social_verification'],
    search_template: 'https://www.facebook.com/marketplace/category/vehicles/'
  },
  BRICK_AND_MOTOR: {
    name: 'Brick and Motor',
    url: 'https://www.brickandmotor.ca/',
    description: '新兴线上零售商，主打"整备好"的车辆',
    type: 'online_retailer',
    features: ['quality_assurance', 'vehicle_preparation', 'home_delivery'],
    search_template: 'https://www.brickandmotor.ca/inventory/{make}/{model}/'
  },
  AUTOTEMPEST: {
    name: 'AutoTempest',
    url: 'https://www.autotempest.com/',
    description: '聚合搜索平台，可同时搜索多个网站（Autotrader/eBay/Kijiji等）',
    type: 'aggregator',
    features: ['multi_site_search', 'price_comparison', 'alert_system'],
    search_template: 'https://www.autotempest.com/results/?make={make}&model={model}&zip=Canada'
  },
  EBAY_MOTORS: {
    name: 'eBay Motors Canada',
    url: 'https://www.ebay.ca/b/Cars-Trucks/6001/bn_1865117',
    description: 'eBay Motors加拿大站，个人卖家较少，但偶尔能淘到车',
    type: 'auction',
    features: ['auction_format', 'buy_it_now', 'unique_finds'],
    search_template: 'https://www.ebay.ca/sch/Cars-Trucks/6001/i.html?_nkw={make}+{model}'
  }
} as const;

// 拍卖平台配置
export const AUCTION_PLATFORMS = {
  COPART: {
    name: 'Copart Canada',
    url: 'https://www.copart.ca/',
    description: 'Copart，加拿大事故车/修复车拍卖平台，适合懂车的人',
    type: 'salvage_auction',
    features: ['salvage_vehicles', 'damaged_cars', 'professional_buyers'],
    registration_required: true,
    target_audience: 'experienced_buyers'
  },
  ADESA: {
    name: 'ADESA Canada',
    url: 'https://www.adesa.ca/',
    description: 'Adesa，加拿大大型汽车拍卖平台，主要供经销商使用',
    type: 'dealer_auction',
    features: ['dealer_only', 'wholesale_pricing', 'fleet_vehicles'],
    registration_required: true,
    dealer_license_required: true
  },
  GOVDEALS: {
    name: 'GovDeals Canada',
    url: 'https://www.govdeals.ca/',
    description: '政府及机构车辆拍卖平台，能找到退役警车/公务车',
    type: 'government_auction',
    features: ['government_vehicles', 'police_cars', 'fleet_vehicles'],
    registration_required: true,
    target_audience: 'general_public'
  }
} as const;

// 车辆信息工具配置
export const VEHICLE_INFO_TOOLS = {
  KBB_CANADA: {
    name: 'Kelley Blue Book Canada',
    url: 'https://www.kbb.ca/',
    description: 'Kelley Blue Book Canada，车辆估值工具，买车前查行情',
    type: 'valuation',
    features: ['vehicle_valuation', 'market_analysis', 'trade_in_value'],
    free_tier: true,
    api_available: false
  },
  CARFAX_CANADA: {
    name: 'CARFAX Canada',
    url: 'https://www.carfax.ca/',
    description: 'CARFAX Canada，车辆历史报告，查询事故/保养/贷款记录',
    type: 'history_report',
    features: ['accident_history', 'service_records', 'lien_check', 'ownership_history'],
    free_tier: false,
    api_available: true,
    cost_per_report: 39.99
  }
} as const;

// 金融服务配置
export const FINANCIAL_SERVICES = {
  BANKS: {
    RBC: {
      name: 'RBC Royal Bank',
      url: 'https://www.rbcroyalbank.com/personal/loans/auto-loans.html',
      description: 'RBC汽车贷款，利率竞争力强',
      features: ['auto_loans', 'lease_options', 'online_application']
    },
    TD: {
      name: 'TD Canada Trust',
      url: 'https://www.td.com/ca/en/personal-banking/personal-loans/auto-loans',
      description: 'TD汽车贷款，审批快速',
      features: ['auto_loans', 'pre_approval', 'flexible_terms']
    },
    SCOTIABANK: {
      name: 'Scotiabank',
      url: 'https://www.scotiabank.com/ca/en/personal/loans/auto-loans.html',
      description: 'Scotiabank汽车贷款，多种选择',
      features: ['auto_loans', 'new_used_cars', 'competitive_rates']
    }
  },
  CREDIT_UNIONS: {
    DESJARDINS: {
      name: 'Desjardins',
      url: 'https://www.desjardins.com/ca/personal/loans/auto-loans/',
      description: 'Desjardins汽车贷款，魁北克地区优势',
      features: ['auto_loans', 'member_benefits', 'local_service']
    }
  },
  FINANCE_COMPANIES: {
    GM_FINANCIAL: {
      name: 'GM Financial',
      url: 'https://www.gmfinancial.ca/',
      description: 'GM Financial，通用汽车金融服务',
      features: ['gm_vehicles', 'lease_programs', 'special_offers']
    },
    FORD_CREDIT: {
      name: 'Ford Credit',
      url: 'https://www.ford.ca/financing/',
      description: 'Ford Credit，福特汽车金融服务',
      features: ['ford_vehicles', 'financing_options', 'incentives']
    }
  }
} as const;

// 保险服务配置
export const INSURANCE_SERVICES = {
  MAJOR_INSURERS: {
    INTACT: {
      name: 'Intact Insurance',
      url: 'https://www.intact.ca/',
      description: 'Intact保险，加拿大最大财产保险公司',
      features: ['auto_insurance', 'online_quotes', 'claims_service']
    },
    TD_INSURANCE: {
      name: 'TD Insurance',
      url: 'https://www.tdinsurance.com/',
      description: 'TD保险，银行背景，服务全面',
      features: ['auto_insurance', 'multi_policy_discounts', 'online_management']
    },
    DESJARDINS_INSURANCE: {
      name: 'Desjardins Insurance',
      url: 'https://www.desjardins.com/ca/personal/insurance/auto/',
      description: 'Desjardins保险，魁北克地区优势',
      features: ['auto_insurance', 'member_benefits', 'local_service']
    }
  },
  COMPARISON_SITES: {
    RATESDOTCA: {
      name: 'Rates.ca',
      url: 'https://www.rates.ca/',
      description: 'Rates.ca，保险比较网站',
      features: ['quote_comparison', 'multiple_insurers', 'online_quotes']
    },
    KANETIX: {
      name: 'Kanetix',
      url: 'https://www.kanetix.ca/',
      description: 'Kanetix，保险比较平台',
      features: ['insurance_comparison', 'instant_quotes', 'savings_calculator']
    }
  }
} as const;

// 资源类型定义
export type PlatformType = 'marketplace' | 'online_retailer' | 'classified' | 'aggregator' | 'auction' | 'salvage_auction' | 'dealer_auction' | 'government_auction' | 'valuation' | 'history_report';

export interface CarResource {
  name: string;
  url: string;
  description: string;
  type: PlatformType;
  features: readonly string[];
  search_template?: string;
  registration_required?: boolean;
  dealer_license_required?: boolean;
  target_audience?: string;
  free_tier?: boolean;
  api_available?: boolean;
  cost_per_report?: number;
}

/**
 * 根据用户需求推荐相关网站
 */
export function getRecommendedPlatforms(userPreferences: {
  budget: 'low' | 'medium' | 'high';
  experience: 'beginner' | 'intermediate' | 'expert';
  buying_preference: 'dealer' | 'private' | 'any';
}): CarResource[] {
  const recommendations: CarResource[] = [];

  // 基于预算推荐平台
  if (userPreferences.budget === 'low') {
    recommendations.push(
      USED_CAR_PLATFORMS.KIJIJI,
      USED_CAR_PLATFORMS.FACEBOOK_MARKETPLACE,
      AUCTION_PLATFORMS.GOVDEALS
    );
  } else if (userPreferences.budget === 'medium') {
    recommendations.push(
      USED_CAR_PLATFORMS.AUTOTRADER,
      USED_CAR_PLATFORMS.CARGURUS,
      USED_CAR_PLATFORMS.CARPAGES
    );
  } else {
    recommendations.push(
      USED_CAR_PLATFORMS.CLUTCH,
      USED_CAR_PLATFORMS.CANADA_DRIVES,
      USED_CAR_PLATFORMS.BRICK_AND_MOTOR
    );
  }

  // 基于经验推荐
  if (userPreferences.experience === 'expert') {
    recommendations.push(AUCTION_PLATFORMS.COPART);
  }

  // 总是推荐信息工具
  recommendations.push(
    VEHICLE_INFO_TOOLS.KBB_CANADA,
    VEHICLE_INFO_TOOLS.CARFAX_CANADA
  );

  return recommendations;
}

/**
 * 生成搜索链接
 */
export function generateSearchLinks(make: string, model: string): Record<string, string> {
  const links: Record<string, string> = {};
  
  Object.entries(USED_CAR_PLATFORMS).forEach(([key, platform]) => {
    if (platform.search_template) {
      links[key] = platform.search_template
        .replace('{make}', encodeURIComponent(make.toLowerCase()))
        .replace('{model}', encodeURIComponent(model.toLowerCase()));
    }
  });

  return links;
}

/**
 * 获取所有平台类型
 */
export function getAllPlatformTypes(): PlatformType[] {
  return [
    'marketplace',
    'online_retailer', 
    'classified',
    'aggregator',
    'auction',
    'salvage_auction',
    'dealer_auction',
    'government_auction',
    'valuation',
    'history_report'
  ];
}

/**
 * 根据平台类型筛选资源
 */
export function getResourcesByType(type: PlatformType): CarResource[] {
  const allResources: CarResource[] = [
    ...Object.values(USED_CAR_PLATFORMS),
    ...Object.values(AUCTION_PLATFORMS),
    ...Object.values(VEHICLE_INFO_TOOLS)
  ];
  
  return allResources.filter(resource => resource.type === type);
}

/**
 * 获取免费资源
 */
export function getFreeResources(): CarResource[] {
  const allResources: CarResource[] = [
    ...Object.values(USED_CAR_PLATFORMS),
    ...Object.values(AUCTION_PLATFORMS),
    ...Object.values(VEHICLE_INFO_TOOLS)
  ];
  
  return allResources.filter(resource => resource.free_tier === true);
}

/**
 * 获取需要注册的资源
 */
export function getRegistrationRequiredResources(): CarResource[] {
  const allResources: CarResource[] = [
    ...Object.values(USED_CAR_PLATFORMS),
    ...Object.values(AUCTION_PLATFORMS),
    ...Object.values(VEHICLE_INFO_TOOLS)
  ];
  
  return allResources.filter(resource => resource.registration_required === true);
}
