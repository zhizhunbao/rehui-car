-- 插入示例数据

-- 插入示例汽车数据
INSERT INTO cars (make, model, year_min, year_max, price_min, price_max, currency, category, fuel_type, description_en, description_zh, pros_en, pros_zh, cons_en, cons_zh, features, image_url, reliability_score, fuel_economy, safety_rating) VALUES

-- 经济型轿车
('Toyota', 'Camry', 2020, 2024, 180000, 250000, 'CNY', 'sedan', 'hybrid', 
 'Reliable mid-size sedan with excellent fuel economy and resale value.',
 '可靠的中型轿车，燃油经济性出色，保值率高。',
 ARRAY['Excellent reliability', 'Great fuel economy', 'High resale value', 'Comfortable ride'],
 ARRAY['可靠性出色', '燃油经济性好', '保值率高', '乘坐舒适'],
 ARRAY['Conservative styling', 'Limited tech features'],
 ARRAY['设计保守', '科技配置有限'],
 ARRAY['Lane keeping assist', 'Adaptive cruise control', 'Apple CarPlay', 'Android Auto'],
 'https://example.com/toyota-camry.jpg', 9.2, 5.8, 9.5),

('Honda', 'Civic', 2020, 2024, 120000, 180000, 'CNY', 'sedan', 'gasoline',
 'Sporty compact sedan with excellent handling and fuel efficiency.',
 '运动型紧凑轿车，操控出色，燃油效率高。',
 ARRAY['Sporty handling', 'Great fuel economy', 'Reliable', 'Good value'],
 ARRAY['操控运动', '燃油经济性好', '可靠', '性价比高'],
 ARRAY['Small back seat', 'Road noise'],
 ARRAY['后排空间小', '路噪较大'],
 ARRAY['Honda Sensing', 'Lane departure warning', 'Collision mitigation', 'Bluetooth'],
 'https://example.com/honda-civic.jpg', 8.8, 6.2, 9.0),

-- 豪华轿车
('BMW', '3 Series', 2020, 2024, 300000, 450000, 'CNY', 'sedan', 'gasoline',
 'Luxury sports sedan with excellent performance and premium features.',
 '豪华运动轿车，性能出色，配置豪华。',
 ARRAY['Excellent performance', 'Premium interior', 'Advanced tech', 'Brand prestige'],
 ARRAY['性能出色', '内饰豪华', '科技先进', '品牌价值'],
 ARRAY['Expensive maintenance', 'High insurance costs'],
 ARRAY['保养费用高', '保险费用高'],
 ARRAY['iDrive system', 'Heated seats', 'Navigation', 'Premium audio'],
 'https://example.com/bmw-3series.jpg', 8.5, 7.5, 9.2),

('Mercedes-Benz', 'C-Class', 2020, 2024, 320000, 480000, 'CNY', 'sedan', 'gasoline',
 'Luxury sedan with elegant design and advanced technology.',
 '豪华轿车，设计优雅，技术先进。',
 ARRAY['Elegant design', 'Premium materials', 'Advanced safety', 'Comfortable'],
 ARRAY['设计优雅', '用料豪华', '安全先进', '乘坐舒适'],
 ARRAY['Complex electronics', 'High repair costs'],
 ARRAY['电子系统复杂', '维修成本高'],
 ARRAY['MBUX system', 'Ambient lighting', 'Premium sound', 'Driver assistance'],
 'https://example.com/mercedes-cclass.jpg', 8.3, 7.8, 9.3),

-- SUV
('Toyota', 'RAV4', 2020, 2024, 200000, 280000, 'CNY', 'suv', 'hybrid',
 'Compact SUV with excellent reliability and fuel economy.',
 '紧凑型SUV，可靠性出色，燃油经济性好。',
 ARRAY['Excellent reliability', 'Good fuel economy', 'Spacious interior', 'All-wheel drive'],
 ARRAY['可靠性出色', '燃油经济性好', '空间宽敞', '四轮驱动'],
 ARRAY['Slower acceleration', 'Road noise'],
 ARRAY['加速较慢', '路噪较大'],
 ARRAY['Toyota Safety Sense', 'All-wheel drive', 'Power liftgate', 'Bluetooth'],
 'https://example.com/toyota-rav4.jpg', 9.0, 5.5, 9.1),

('Honda', 'CR-V', 2020, 2024, 180000, 260000, 'CNY', 'suv', 'gasoline',
 'Reliable compact SUV with spacious interior and good fuel economy.',
 '可靠的紧凑型SUV，空间宽敞，燃油经济性好。',
 ARRAY['Spacious interior', 'Good fuel economy', 'Reliable', 'Easy to drive'],
 ARRAY['空间宽敞', '燃油经济性好', '可靠', '易于驾驶'],
 ARRAY['CVT transmission', 'Road noise'],
 ARRAY['CVT变速箱', '路噪较大'],
 ARRAY['Honda Sensing', 'Lane keeping assist', 'Adaptive cruise', 'Bluetooth'],
 'https://example.com/honda-crv.jpg', 8.7, 6.0, 8.9),

-- 电动车
('Tesla', 'Model 3', 2020, 2024, 250000, 350000, 'CNY', 'sedan', 'electric',
 'Electric sedan with cutting-edge technology and impressive performance.',
 '电动轿车，技术前沿，性能出色。',
 ARRAY['Instant acceleration', 'Advanced tech', 'Low operating costs', 'Autopilot'],
 ARRAY['加速迅猛', '科技先进', '使用成本低', '自动驾驶'],
 ARRAY['Charging infrastructure', 'Build quality issues'],
 ARRAY['充电基础设施', '制造质量问题'],
 ARRAY['Autopilot', 'Over-the-air updates', 'Supercharging', 'Premium audio'],
 'https://example.com/tesla-model3.jpg', 7.8, 0.0, 9.0),

('BYD', 'Han EV', 2020, 2024, 220000, 300000, 'CNY', 'sedan', 'electric',
 'Chinese electric sedan with advanced battery technology and luxury features.',
 '中国电动轿车，电池技术先进，配置豪华。',
 ARRAY['Advanced battery tech', 'Luxury features', 'Good value', 'Long range'],
 ARRAY['电池技术先进', '配置豪华', '性价比高', '续航里程长'],
 ARRAY['Limited service network', 'Software issues'],
 ARRAY['服务网络有限', '软件问题'],
 ARRAY['Blade battery', 'NFC key', 'Rotating screen', 'Premium interior'],
 'https://example.com/byd-han.jpg', 8.0, 0.0, 8.8),

-- 跑车
('Porsche', '911', 2020, 2024, 1200000, 2000000, 'CNY', 'sports', 'gasoline',
 'Iconic sports car with exceptional performance and timeless design.',
 '标志性跑车，性能卓越，设计经典。',
 ARRAY['Exceptional performance', 'Timeless design', 'High resale value', 'Prestige'],
 ARRAY['性能卓越', '设计经典', '保值率高', '品牌价值'],
 ARRAY['Very expensive', 'High maintenance', 'Limited practicality'],
 ARRAY['价格昂贵', '保养费用高', '实用性有限'],
 ARRAY['PDK transmission', 'Sport Chrono', 'Premium audio', 'Track mode'],
 'https://example.com/porsche-911.jpg', 8.9, 12.0, 9.5);

-- 插入示例用户数据
INSERT INTO users (email, name, language, session_id) VALUES
('user1@example.com', '张三', 'zh', 'session_001'),
('user2@example.com', '李四', 'zh', 'session_002'),
('user3@example.com', 'John Smith', 'en', 'session_003');

-- 插入示例对话数据
INSERT INTO conversations (user_id, title, summary, language, session_id) VALUES
((SELECT id FROM users WHERE email = 'user1@example.com'), '寻找经济型轿车', '用户询问20万预算内的经济型轿车推荐', 'zh', 'session_001'),
((SELECT id FROM users WHERE email = 'user2@example.com'), '豪华SUV选择', '用户比较不同豪华SUV的优缺点', 'zh', 'session_002'),
((SELECT id FROM users WHERE email = 'user3@example.com'), 'Electric Car Research', 'User researching electric vehicles for daily commute', 'en', 'session_003');

-- 插入示例消息数据
INSERT INTO messages (conversation_id, type, content, metadata) VALUES
((SELECT id FROM conversations WHERE title = '寻找经济型轿车'), 'user', '我想买一辆20万以内的经济型轿车，有什么推荐吗？', '{"budget": 200000, "category": "sedan"}'),
((SELECT id FROM conversations WHERE title = '寻找经济型轿车'), 'assistant', '根据您的预算，我推荐以下几款经济型轿车：1. 丰田凯美瑞 - 可靠性出色，保值率高 2. 本田思域 - 运动操控，燃油经济性好', '{"recommendations": ["toyota-camry", "honda-civic"]}'),
((SELECT id FROM conversations WHERE title = '豪华SUV选择'), 'user', '我想了解豪华SUV的选择，预算在30-50万之间', '{"budget_min": 300000, "budget_max": 500000, "category": "suv"}'),
((SELECT id FROM conversations WHERE title = 'Electric Car Research'), 'user', 'I am looking for an electric car for daily commuting, budget around 300k CNY', '{"budget": 300000, "category": "electric", "usage": "commuting"}');

-- 插入示例推荐数据
INSERT INTO recommendations (conversation_id, message_id, car_id, match_score, reasoning_en, reasoning_zh) VALUES
((SELECT id FROM conversations WHERE title = '寻找经济型轿车'), 
 (SELECT id FROM messages WHERE content LIKE '%我想买一辆20万以内的经济型轿车%'),
 (SELECT id FROM cars WHERE make = 'Toyota' AND model = 'Camry'),
 0.95, 'Excellent reliability and fuel economy within budget', '可靠性出色，燃油经济性好，在预算范围内'),
((SELECT id FROM conversations WHERE title = '寻找经济型轿车'),
 (SELECT id FROM messages WHERE content LIKE '%我想买一辆20万以内的经济型轿车%'),
 (SELECT id FROM cars WHERE make = 'Honda' AND model = 'Civic'),
 0.90, 'Sporty handling and great value for money', '操控运动，性价比高'),
((SELECT id FROM conversations WHERE title = 'Electric Car Research'),
 (SELECT id FROM messages WHERE content LIKE '%I am looking for an electric car%'),
 (SELECT id FROM cars WHERE make = 'Tesla' AND model = 'Model 3'),
 0.88, 'Advanced technology and excellent performance for commuting', '技术先进，通勤性能出色'),
((SELECT id FROM conversations WHERE title = 'Electric Car Research'),
 (SELECT id FROM messages WHERE content LIKE '%I am looking for an electric car%'),
 (SELECT id FROM cars WHERE make = 'BYD' AND model = 'Han EV'),
 0.85, 'Good value with advanced battery technology', '性价比高，电池技术先进');

-- 插入示例下一步行动数据
INSERT INTO next_steps (conversation_id, message_id, title_en, title_zh, description_en, description_zh, priority, action_type, url) VALUES
((SELECT id FROM conversations WHERE title = '寻找经济型轿车'),
 (SELECT id FROM messages WHERE content LIKE '%我想买一辆20万以内的经济型轿车%'),
 'Schedule Test Drive', '安排试驾',
 'Contact local Toyota and Honda dealers to schedule test drives',
 '联系当地丰田和本田经销商安排试驾',
 'high', 'schedule', 'https://example.com/dealers'),
((SELECT id FROM conversations WHERE title = '寻找经济型轿车'),
 (SELECT id FROM messages WHERE content LIKE '%我想买一辆20万以内的经济型轿车%'),
 'Compare Features', '比较配置',
 'Create a detailed comparison of Camry vs Civic features',
 '创建凯美瑞与思域的详细配置对比',
 'medium', 'compare', 'https://example.com/compare'),
((SELECT id FROM conversations WHERE title = 'Electric Car Research'),
 (SELECT id FROM messages WHERE content LIKE '%I am looking for an electric car%'),
 'Research Charging Infrastructure', '研究充电基础设施',
 'Check charging station availability in your area',
 '检查您所在地区的充电站可用性',
 'high', 'research', 'https://example.com/charging-stations');
