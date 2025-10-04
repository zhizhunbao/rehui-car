-- 创建汽车表
CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year_min INTEGER NOT NULL,
    year_max INTEGER NOT NULL,
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    currency TEXT DEFAULT 'CNY',
    category TEXT NOT NULL,
    fuel_type TEXT NOT NULL,
    description_en TEXT,
    description_zh TEXT,
    pros_en TEXT[],
    pros_zh TEXT[],
    cons_en TEXT[],
    cons_zh TEXT[],
    features TEXT[],
    image_url TEXT,
    reliability_score DECIMAL(3,1),
    fuel_economy DECIMAL(5,2),
    safety_rating DECIMAL(3,1),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_cars_make ON cars(make);
CREATE INDEX idx_cars_model ON cars(model);
CREATE INDEX idx_cars_category ON cars(category);
CREATE INDEX idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX idx_cars_price_range ON cars(price_min, price_max);
CREATE INDEX idx_cars_year_range ON cars(year_min, year_max);
CREATE INDEX idx_cars_active ON cars(is_active);
CREATE INDEX idx_cars_reliability ON cars(reliability_score);
CREATE INDEX idx_cars_safety ON cars(safety_rating);

-- 创建复合索引用于搜索
CREATE INDEX idx_cars_search ON cars(make, model, category, fuel_type, is_active);

-- 创建更新时间戳触发器
CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 添加行级安全策略
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- 创建策略：所有用户都可以查看汽车数据
CREATE POLICY "Anyone can view cars" ON cars
    FOR SELECT USING (true);

-- 创建视图：热门汽车
CREATE VIEW popular_cars AS
SELECT * FROM cars 
WHERE is_active = true 
ORDER BY reliability_score DESC NULLS LAST, safety_rating DESC NULLS LAST;
