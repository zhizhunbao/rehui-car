-- 008_insert_sample_cars.sql
-- 插入示例车型数据，用于测试和演示

-- =============================================
-- 示例车型数据
-- =============================================

-- 插入丰田车型
INSERT INTO public.cars (
  make, model, year_min, year_max, price_min, price_max, currency,
  category, fuel_type, description_en, description_zh,
  pros_en, pros_zh, cons_en, cons_zh, features,
  image_url, reliability_score, fuel_economy, safety_rating, is_active
) VALUES 
(
  'Toyota', 'Camry', 2020, 2024, 28000, 38000, 'CAD',
  'Sedan', 'Gasoline',
  'The Toyota Camry is a reliable mid-size sedan known for its fuel efficiency and comfortable ride.',
  '丰田凯美瑞是一款可靠的中型轿车，以燃油经济性和舒适驾乘而闻名。',
  ARRAY['Excellent reliability', 'Good fuel economy', 'Spacious interior', 'Strong resale value'],
  ARRAY['可靠性极佳', '燃油经济性好', '内部空间宽敞', '保值率高'],
  ARRAY['Road noise at highway speeds', 'CVT transmission feel'],
  ARRAY['高速行驶时路噪较大', 'CVT变速箱感受一般'],
  ARRAY['Toyota Safety Sense 2.0', 'Apple CarPlay', 'Android Auto', 'Adaptive Cruise Control'],
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
  4.5, 7.8, 4.8, true
),
(
  'Toyota', 'RAV4', 2021, 2024, 32000, 42000, 'CAD',
  'SUV', 'Gasoline',
  'The Toyota RAV4 is a compact SUV offering excellent reliability and all-weather capability.',
  '丰田RAV4是一款紧凑型SUV，提供出色的可靠性和全天候驾驶能力。',
  ARRAY['Outstanding reliability', 'All-wheel drive standard', 'Good ground clearance', 'Excellent safety ratings'],
  ARRAY['可靠性出众', '标配全轮驱动', '离地间隙良好', '安全评级优秀'],
  ARRAY['Road noise', 'Firm ride quality', 'CVT hesitation'],
  ARRAY['路噪较大', '悬挂偏硬', 'CVT变速箱响应迟缓'],
  ARRAY['Toyota Safety Sense 2.0', 'All-Wheel Drive', 'Roof Rails', 'Power Liftgate'],
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  4.6, 8.9, 4.9, true
),
(
  'Toyota', 'Prius', 2020, 2024, 29000, 35000, 'CAD',
  'Sedan', 'Hybrid',
  'The Toyota Prius is a pioneering hybrid vehicle with exceptional fuel economy.',
  '丰田普锐斯是一款开创性的混合动力车型，燃油经济性极佳。',
  ARRAY['Exceptional fuel economy', 'Environmentally friendly', 'Reliable hybrid system', 'Low running costs'],
  ARRAY['燃油经济性极佳', '环保', '混动系统可靠', '使用成本低'],
  ARRAY['Uninspiring driving experience', 'Road noise', 'Polarizing styling'],
  ARRAY['驾驶乐趣不足', '路噪较大', '外观设计争议较大'],
  ARRAY['Toyota Safety Sense 2.0', 'Hybrid Synergy Drive', 'Eco Mode', 'Regenerative Braking'],
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
  4.4, 4.2, 4.7, true
);

-- 插入本田车型
INSERT INTO public.cars (
  make, model, year_min, year_max, price_min, price_max, currency,
  category, fuel_type, description_en, description_zh,
  pros_en, pros_zh, cons_en, cons_zh, features,
  image_url, reliability_score, fuel_economy, safety_rating, is_active
) VALUES 
(
  'Honda', 'Civic', 2020, 2024, 25000, 32000, 'CAD',
  'Sedan', 'Gasoline',
  'The Honda Civic is a compact car known for its reliability, fuel efficiency, and sporty handling.',
  '本田思域是一款紧凑型轿车，以可靠性、燃油经济性和运动操控而闻名。',
  ARRAY['Excellent reliability', 'Sporty handling', 'Fuel efficient', 'Well-built interior'],
  ARRAY['可靠性优秀', '操控运动', '燃油经济', '内饰做工精良'],
  ARRAY['Road noise', 'Rear seat space', 'CVT transmission'],
  ARRAY['路噪较大', '后排空间一般', 'CVT变速箱'],
  ARRAY['Honda Sensing', 'Apple CarPlay', 'Android Auto', 'Turbo Engine'],
  'https://images.unsplash.com/photo-1606016159991-8b5d5c8e0b9a?w=800',
  4.3, 7.5, 4.6, true
),
(
  'Honda', 'CR-V', 2021, 2024, 33000, 43000, 'CAD',
  'SUV', 'Gasoline',
  'The Honda CR-V is a reliable compact SUV with excellent space utilization and fuel economy.',
  '本田CR-V是一款可靠的紧凑型SUV，空间利用率高，燃油经济性好。',
  ARRAY['Spacious interior', 'Excellent reliability', 'Good fuel economy', 'Practical design'],
  ARRAY['内部空间宽敞', '可靠性优秀', '燃油经济性好', '设计实用'],
  ARRAY['CVT transmission feel', 'Road noise', 'Firm suspension'],
  ARRAY['CVT变速箱感受', '路噪较大', '悬挂偏硬'],
  ARRAY['Honda Sensing', 'All-Wheel Drive Available', 'Power Tailgate', 'Remote Start'],
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
  4.4, 8.1, 4.7, true
);

-- 插入马自达车型
INSERT INTO public.cars (
  make, model, year_min, year_max, price_min, price_max, currency,
  category, fuel_type, description_en, description_zh,
  pros_en, pros_zh, cons_en, cons_zh, features,
  image_url, reliability_score, fuel_economy, safety_rating, is_active
) VALUES 
(
  'Mazda', 'CX-5', 2020, 2024, 30000, 40000, 'CAD',
  'SUV', 'Gasoline',
  'The Mazda CX-5 is a stylish compact SUV with excellent driving dynamics and premium interior.',
  '马自达CX-5是一款时尚的紧凑型SUV，驾驶动态出色，内饰高档。',
  ARRAY['Excellent handling', 'Premium interior', 'Attractive styling', 'Good fuel economy'],
  ARRAY['操控出色', '内饰高档', '外观吸引', '燃油经济性好'],
  ARRAY['Road noise', 'Rear seat space', 'Infotainment system'],
  ARRAY['路噪较大', '后排空间一般', '信息娱乐系统'],
  ARRAY['i-ACTIVSENSE Safety', 'SKYACTIV Technology', 'All-Wheel Drive Available', 'Premium Audio'],
  'https://images.unsplash.com/photo-1606016159991-8b5d5c8e0b9a?w=800',
  4.2, 8.7, 4.5, true
),
(
  'Mazda', 'Mazda3', 2020, 2024, 24000, 31000, 'CAD',
  'Sedan', 'Gasoline',
  'The Mazda3 is a compact sedan with premium interior quality and engaging driving experience.',
  '马自达3是一款紧凑型轿车，内饰品质高档，驾驶体验出色。',
  ARRAY['Premium interior', 'Excellent handling', 'Attractive design', 'Quiet cabin'],
  ARRAY['内饰高档', '操控出色', '设计吸引', '车厢安静'],
  ARRAY['Rear seat space', 'Infotainment learning curve', 'Price premium'],
  ARRAY['后排空间一般', '信息系统学习成本', '价格偏高'],
  ARRAY['i-ACTIVSENSE Safety', 'SKYACTIV-G Engine', 'Premium Audio', 'Head-Up Display'],
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  4.1, 7.9, 4.4, true
);

-- 插入现代车型
INSERT INTO public.cars (
  make, model, year_min, year_max, price_min, price_max, currency,
  category, fuel_type, description_en, description_zh,
  pros_en, pros_zh, cons_en, cons_zh, features,
  image_url, reliability_score, fuel_economy, safety_rating, is_active
) VALUES 
(
  'Hyundai', 'Elantra', 2021, 2024, 22000, 28000, 'CAD',
  'Sedan', 'Gasoline',
  'The Hyundai Elantra is an affordable compact sedan with modern features and good warranty coverage.',
  '现代伊兰特是一款经济实惠的紧凑型轿车，配置现代化，质保覆盖好。',
  ARRAY['Excellent warranty', 'Modern features', 'Competitive pricing', 'Fuel efficient'],
  ARRAY['质保优秀', '配置现代', '价格有竞争力', '燃油经济'],
  ARRAY['Interior materials', 'Road noise', 'CVT transmission'],
  ARRAY['内饰材质一般', '路噪较大', 'CVT变速箱'],
  ARRAY['Hyundai SmartSense', 'Wireless Apple CarPlay', 'Digital Cluster', '10-Year Warranty'],
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
  3.9, 7.6, 4.3, true
),
(
  'Hyundai', 'Tucson', 2022, 2024, 31000, 41000, 'CAD',
  'SUV', 'Gasoline',
  'The Hyundai Tucson is a redesigned compact SUV with bold styling and advanced technology.',
  '现代途胜是一款重新设计的紧凑型SUV，造型大胆，技术先进。',
  ARRAY['Bold styling', 'Advanced technology', 'Excellent warranty', 'Spacious interior'],
  ARRAY['造型大胆', '技术先进', '质保优秀', '内部空间宽敞'],
  ARRAY['Reliability concerns', 'Fuel economy', 'Infotainment complexity'],
  ARRAY['可靠性担忧', '燃油经济性', '信息系统复杂'],
  ARRAY['Hyundai SmartSense', 'Digital Cockpit', 'Wireless Charging', 'Panoramic Sunroof'],
  'https://images.unsplash.com/photo-1606016159991-8b5d5c8e0b9a?w=800',
  3.7, 9.2, 4.2, true
);

-- 插入特斯拉车型
INSERT INTO public.cars (
  make, model, year_min, year_max, price_min, price_max, currency,
  category, fuel_type, description_en, description_zh,
  pros_en, pros_zh, cons_en, cons_zh, features,
  image_url, reliability_score, fuel_economy, safety_rating, is_active
) VALUES 
(
  'Tesla', 'Model 3', 2021, 2024, 55000, 75000, 'CAD',
  'Sedan', 'Electric',
  'The Tesla Model 3 is a premium electric sedan with cutting-edge technology and impressive performance.',
  '特斯拉Model 3是一款高端电动轿车，技术前沿，性能出色。',
  ARRAY['Zero emissions', 'Excellent performance', 'Advanced autopilot', 'Over-the-air updates'],
  ARRAY['零排放', '性能出色', '自动驾驶先进', '空中升级'],
  ARRAY['Build quality issues', 'Service network', 'Interior minimalism', 'Price premium'],
  ARRAY['制造质量问题', '服务网络', '内饰极简', '价格偏高'],
  ARRAY['Autopilot', 'Supercharger Network', 'Over-the-Air Updates', '15-inch Touchscreen'],
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  3.5, 0.0, 4.8, true
),
(
  'Tesla', 'Model Y', 2021, 2024, 65000, 85000, 'CAD',
  'SUV', 'Electric',
  'The Tesla Model Y is a compact electric SUV combining performance, technology, and practicality.',
  '特斯拉Model Y是一款紧凑型电动SUV，结合了性能、技术和实用性。',
  ARRAY['Zero emissions', 'Excellent performance', 'Advanced technology', 'Spacious interior'],
  ARRAY['零排放', '性能出色', '技术先进', '内部空间宽敞'],
  ARRAY['Build quality', 'Service availability', 'Price premium', 'Charging infrastructure'],
  ARRAY['制造质量', '服务可用性', '价格偏高', '充电基础设施'],
  ARRAY['Autopilot', 'Supercharger Network', 'Glass Roof', 'Falcon Wing Doors'],
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
  3.4, 0.0, 4.7, true
);

-- 插入福特车型
INSERT INTO public.cars (
  make, model, year_min, year_max, price_min, price_max, currency,
  category, fuel_type, description_en, description_zh,
  pros_en, pros_zh, cons_en, cons_zh, features,
  image_url, reliability_score, fuel_economy, safety_rating, is_active
) VALUES 
(
  'Ford', 'F-150', 2021, 2024, 45000, 75000, 'CAD',
  'Truck', 'Gasoline',
  'The Ford F-150 is Americas best-selling truck, known for its capability and versatility.',
  '福特F-150是美国最畅销的皮卡，以其能力和多功能性而闻名。',
  ARRAY['Excellent towing capacity', 'Versatile bed options', 'Strong resale value', 'Proven reliability'],
  ARRAY['拖拽能力出色', '货箱选择多样', '保值率高', '可靠性经过验证'],
  ARRAY['Fuel economy', 'Ride quality', 'Interior materials', 'Price increases'],
  ARRAY['燃油经济性', '乘坐质量', '内饰材质', '价格上涨'],
  ARRAY['Ford Co-Pilot360', 'Pro Power Onboard', 'Trailer Backup Assist', 'SYNC 4'],
  'https://images.unsplash.com/photo-1606016159991-8b5d5c8e0b9a?w=800',
  4.0, 12.4, 4.3, true
),
(
  'Ford', 'Escape', 2020, 2024, 28000, 38000, 'CAD',
  'SUV', 'Gasoline',
  'The Ford Escape is a compact SUV offering good fuel economy and modern technology features.',
  '福特翼虎是一款紧凑型SUV，提供良好的燃油经济性和现代技术配置。',
  ARRAY['Good fuel economy', 'Modern technology', 'Comfortable ride', 'Competitive pricing'],
  ARRAY['燃油经济性好', '技术现代', '乘坐舒适', '价格有竞争力'],
  ARRAY['Reliability concerns', 'Interior space', 'CVT transmission', 'Road noise'],
  ARRAY['可靠性担忧', '内部空间', 'CVT变速箱', '路噪'],
  ARRAY['Ford Co-Pilot360', 'SYNC 3', 'Wireless Charging', 'Hands-Free Liftgate'],
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  3.6, 8.4, 4.1, true
);

-- =============================================
-- 示例用户数据
-- =============================================

-- 插入示例用户
INSERT INTO public.users (
  email, name, language, session_id
) VALUES 
(
  'demo@example.com', 'Demo User', 'en', 'demo-session-001'
),
(
  'test@example.com', '测试用户', 'zh', 'demo-session-002'
),
(
  NULL, NULL, 'en', 'anonymous-session-001'
);

-- =============================================
-- 示例对话数据
-- =============================================

-- 插入示例对话
INSERT INTO public.conversations (
  user_id, title, summary, language, session_id
) VALUES 
(
  (SELECT id FROM public.users WHERE email = 'demo@example.com'),
  'Looking for a reliable family car',
  'User is looking for a reliable family sedan under $35,000 with good fuel economy.',
  'en',
  'demo-session-001'
),
(
  (SELECT id FROM public.users WHERE email = 'test@example.com'),
  '寻找一款经济实用的SUV',
  '用户正在寻找一款3万加元以下的经济实用SUV，要求可靠性好。',
  'zh',
  'demo-session-002'
);

-- =============================================
-- 示例消息数据
-- =============================================

-- 插入示例消息
INSERT INTO public.messages (
  conversation_id, type, content, metadata
) VALUES 
(
  (SELECT id FROM public.conversations WHERE title = 'Looking for a reliable family car'),
  'user',
  'Hi, I am looking for a reliable family car under $35,000. Fuel economy is important to me.',
  '{"user_preferences": {"budget_max": 35000, "priority": "reliability", "fuel_economy": "important"}}'
),
(
  (SELECT id FROM public.conversations WHERE title = 'Looking for a reliable family car'),
  'assistant',
  'Based on your requirements, I would recommend the Toyota Camry and Honda Civic. Both are known for excellent reliability and fuel economy within your budget.',
  '{"recommendations_provided": true, "cars_mentioned": ["Toyota Camry", "Honda Civic"]}'
),
(
  (SELECT id FROM public.conversations WHERE title = '寻找一款经济实用的SUV'),
  'user',
  '你好，我想找一款3万加元以下的SUV，主要用于城市通勤，希望可靠性好一些。',
  '{"user_preferences": {"budget_max": 30000, "category": "SUV", "usage": "城市通勤", "priority": "可靠性"}}'
),
(
  (SELECT id FROM public.conversations WHERE title = '寻找一款经济实用的SUV'),
  'assistant',
  '根据您的需求，我推荐马自达CX-5。它在您的预算范围内，可靠性不错，燃油经济性也很好，非常适合城市通勤。',
  '{"recommendations_provided": true, "cars_mentioned": ["Mazda CX-5"]}'
);

-- =============================================
-- 示例推荐数据
-- =============================================

-- 插入示例推荐
INSERT INTO public.recommendations (
  conversation_id, message_id, car_id, match_score, reasoning_en, reasoning_zh
) VALUES 
(
  (SELECT id FROM public.conversations WHERE title = 'Looking for a reliable family car'),
  (SELECT id FROM public.messages WHERE content LIKE 'Based on your requirements%'),
  (SELECT id FROM public.cars WHERE make = 'Toyota' AND model = 'Camry'),
  0.92,
  'The Toyota Camry perfectly matches your criteria with excellent reliability (4.5/5), good fuel economy (7.8L/100km), and falls within your $35,000 budget at $28,000-$38,000.',
  '丰田凯美瑞完全符合您的标准，可靠性极佳(4.5/5)，燃油经济性好(7.8升/100公里)，价格在您的3.5万预算范围内($28,000-$38,000)。'
),
(
  (SELECT id FROM public.conversations WHERE title = 'Looking for a reliable family car'),
  (SELECT id FROM public.messages WHERE content LIKE 'Based on your requirements%'),
  (SELECT id FROM public.cars WHERE make = 'Honda' AND model = 'Civic'),
  0.88,
  'The Honda Civic is another excellent choice with proven reliability (4.3/5), great fuel efficiency (7.5L/100km), and competitive pricing starting at $25,000.',
  '本田思域是另一个优秀选择，可靠性经过验证(4.3/5)，燃油效率出色(7.5升/100公里)，起价2.5万元，价格有竞争力。'
),
(
  (SELECT id FROM public.conversations WHERE title = '寻找一款经济实用的SUV'),
  (SELECT id FROM public.messages WHERE content LIKE '根据您的需求%'),
  (SELECT id FROM public.cars WHERE make = 'Mazda' AND model = 'CX-5'),
  0.85,
  'The Mazda CX-5 offers excellent handling (4.2/5 reliability), good fuel economy (8.7L/100km), and fits your budget at $30,000-$40,000.',
  '马自达CX-5操控出色(可靠性4.2/5)，燃油经济性好(8.7升/100公里)，价格在您的预算范围内($30,000-$40,000)。'
);

-- =============================================
-- 示例下一步建议数据
-- =============================================

-- 插入示例下一步建议
INSERT INTO public.next_steps (
  conversation_id, message_id, title_en, title_zh, description_en, description_zh,
  priority, action_type, url, metadata
) VALUES 
(
  (SELECT id FROM public.conversations WHERE title = 'Looking for a reliable family car'),
  (SELECT id FROM public.messages WHERE content LIKE 'Based on your requirements%'),
  'Research Toyota Camry reviews',
  '研究丰田凯美瑞评测',
  'Read professional reviews and owner feedback on AutoTrader.ca and CarGurus.ca to learn more about the Toyota Camry.',
  '在AutoTrader.ca和CarGurus.ca上阅读专业评测和车主反馈，了解更多关于丰田凯美瑞的信息。',
  'high',
  'research',
  'https://www.autotrader.ca/cars/toyota/camry/',
  '{"platforms": ["AutoTrader.ca", "CarGurus.ca"], "focus": "reviews and reliability"}'
),
(
  (SELECT id FROM public.conversations WHERE title = 'Looking for a reliable family car'),
  (SELECT id FROM public.messages WHERE content LIKE 'Based on your requirements%'),
  'Visit local Toyota dealership',
  '访问当地丰田经销商',
  'Schedule a test drive at your local Toyota dealership to experience the Camry firsthand.',
  '在当地丰田经销商预约试驾，亲身体验凯美瑞。',
  'medium',
  'visit',
  NULL,
  '{"action": "test_drive", "preparation": "bring drivers license"}'
),
(
  (SELECT id FROM public.conversations WHERE title = '寻找一款经济实用的SUV'),
  (SELECT id FROM public.messages WHERE content LIKE '根据您的需求%'),
  'Compare CX-5 with competitors',
  '比较CX-5与竞争对手',
  'Compare the Mazda CX-5 with Honda CR-V and Toyota RAV4 on CarGurus.ca for features and pricing.',
  '在CarGurus.ca上比较马自达CX-5与本田CR-V和丰田RAV4的配置和价格。',
  'high',
  'research',
  'https://www.cargurus.ca/Cars/spt-used-cars',
  '{"competitors": ["Honda CR-V", "Toyota RAV4"], "comparison_focus": "features and pricing"}'
),
(
  (SELECT id FROM public.conversations WHERE title = '寻找一款经济实用的SUV'),
  (SELECT id FROM public.messages WHERE content LIKE '根据您的需求%'),
  'Check financing options',
  '查看融资选项',
  'Research financing options and calculate monthly payments for the CX-5 within your budget.',
  '研究CX-5的融资选项，计算在您预算范围内的月供。',
  'medium',
  'prepare',
  NULL,
  '{"action": "financing", "budget_max": 30000, "focus": "monthly_payments"}'
);

-- =============================================
-- 更新统计信息
-- =============================================

-- 更新表统计信息以优化查询性能
ANALYZE public.users;
ANALYZE public.conversations;
ANALYZE public.messages;
ANALYZE public.cars;
ANALYZE public.recommendations;
ANALYZE public.next_steps;

-- =============================================
-- 验证数据插入
-- =============================================

-- 验证插入的数据
DO $$
DECLARE
  car_count INTEGER;
  user_count INTEGER;
  conversation_count INTEGER;
  message_count INTEGER;
  recommendation_count INTEGER;
  next_step_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO car_count FROM public.cars WHERE is_active = true;
  SELECT COUNT(*) INTO user_count FROM public.users;
  SELECT COUNT(*) INTO conversation_count FROM public.conversations;
  SELECT COUNT(*) INTO message_count FROM public.messages;
  SELECT COUNT(*) INTO recommendation_count FROM public.recommendations;
  SELECT COUNT(*) INTO next_step_count FROM public.next_steps;
  
  RAISE NOTICE 'Sample data inserted successfully:';
  RAISE NOTICE '- Cars: % records', car_count;
  RAISE NOTICE '- Users: % records', user_count;
  RAISE NOTICE '- Conversations: % records', conversation_count;
  RAISE NOTICE '- Messages: % records', message_count;
  RAISE NOTICE '- Recommendations: % records', recommendation_count;
  RAISE NOTICE '- Next Steps: % records', next_step_count;
  
  -- 验证数据完整性
  IF car_count < 10 THEN
    RAISE WARNING 'Expected at least 10 car records, got %', car_count;
  END IF;
  
  IF user_count < 3 THEN
    RAISE WARNING 'Expected at least 3 user records, got %', user_count;
  END IF;
  
  RAISE NOTICE 'Sample data validation completed successfully!';
END $$; 