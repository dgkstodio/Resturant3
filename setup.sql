-- 1. สร้างตาราง menu_items
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL, -- 'starter', 'main', 'dessert', 'drink'
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- 3. สร้างสิทธิ์การเข้าถึงให้อ่านข้อมูลเมนูได้ฟรี (SELECT) สำหรับทุกคน
CREATE POLICY "Allow public read access" 
ON menu_items FOR SELECT 
TO public 
USING (true);

-- 4. สร้างสิทธิ์การเข้าถึงให้สามารถแก้ไขข้อมูลได้ (สำหรับนำไปพัฒนาร่วมกับ PIN บนหน้าเว็บ)
-- หมายเหตุ: สำหรับการใช้งานจริงระดับโปรดักชัน ควรตั้งค่าสิทธิ์ให้เฉพาะผู้ที่ล็อกอินผ่าน Supabase Auth เท่านั้น
CREATE POLICY "Allow public write access" 
ON menu_items FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- 5. ใส่ข้อมูลตัวอย่างเมนูอาหาร (เมนูฟิวชันสุดหรูหรา - ดำทอง)
INSERT INTO menu_items (name, description, price, category, image_url, is_featured, is_available)
VALUES
    (
        'เกี๊ยวทรัฟเฟิลทองคำ (Truffle Golden Dumplings)', 
        'เกี๊ยวนึ่งไส้หมูคุโรบุตะระดับพรีเมียม ท็อปด้วยทรัฟเฟิลบดบริสุทธิ์และทองคำเปลว 24K เลอค่า', 
        350.00, 
        'starter', 
        'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=600&auto=format&fit=crop', 
        true, 
        true
    ),
    (
        'หอยนางรมคาเวียร์แชมเปญ (Caviar Butter Oysters)', 
        'หอยนางรมนำเข้าสดใหม่ เสิร์ฟเย็นพร้อมคาเวียร์ฝรั่งเศสชั้นเลิศและซอสเนยแชมเปญอุ่น', 
        590.00, 
        'starter', 
        'https://images.unsplash.com/photo-1553618551-fba689030290?q=80&w=600&auto=format&fit=crop', 
        false, 
        true
    ),
    (
        'มัสมั่นเนื้อวากิว A5 (Wagyu Beef Massaman)', 
        'แกงมัสมั่นเนื้อวากิว A5 เคี่ยวจนนุ่มละมุนลิ้น รสชาติเข้มข้น หอมเครื่องเทศ เสิร์ฟพร้อมโรตีกรอบร้อนๆ', 
        1250.00, 
        'main', 
        'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop', 
        true, 
        true
    ),
    (
        'ผัดไทยล็อบสเตอร์คาเวียร์ (Lobster Pad Thai Caviar)', 
        'ผัดไทยเส้นจันท์เหนียวนุ่ม เสิร์ฟคู่กับกุ้งล็อบสเตอร์แคนาดาตัวโต ซอสมะขามสูตรลับโรยหน้าด้วยไข่ปลาคาเวียร์', 
        980.00, 
        'main', 
        'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=600&auto=format&fit=crop', 
        true, 
        true
    ),
    (
        'เครมบรูเลหญ้าฝรั่นสีทอง (Saffron Crème Brûlée)', 
        'เครมบรูเลสูตรคลาสสิกฝรั่งเศส หอมกลิ่นหญ้าฝรั่นสีทอง หน้าคาราเมลกรอบท็อปด้วยแผ่นทองคำเปลวบริสุทธิ์', 
        280.00, 
        'dessert', 
        'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=600&auto=format&fit=crop', 
        false, 
        true
    ),
    (
        'โดมช็อกโกแลตซอสทองคำ (Royal Valrhona Chocolate Dome)', 
        'ช็อกโกแลตมูสโดมทำจาก Valrhona ดาร์กช็อกโกแลตเข้มข้น ราดซอสคาราเมลอุ่นผสมเกล็ดทองคำแบบตระการตา', 
        320.00, 
        'dessert', 
        'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600&auto=format&fit=crop', 
        true, 
        true
    ),
    (
        'เอสเพรสโซ่มาร์ตินี่ 24K (24K Gold Espresso Martini)', 
        'วอดก้าพรีเมียมและเอสเพรสโซ่ช็อตเข้มข้น เขย่าจนเกิดฟองนุ่ม ตกแต่งด้วยแผ่นทองคำเปลวบริสุทธิ์ทานได้', 
        380.00, 
        'drink', 
        'https://images.unsplash.com/photo-1542849187-5ec6ea5e6a27?q=80&w=600&auto=format&fit=crop', 
        false, 
        true
    ),
    (
        'โรยัล คริมสัน เอลิกเซอร์ (Royal Crimson Elixir)', 
        'ม็อกเทลสมุนไพรรสเปรี้ยวหวานจากกระเจี๊ยบ น้ำกุหลาบ แอปเปิ้ลไซเดอร์ และผงประกายทองเปล่งประกาย', 
        220.00, 
        'drink', 
        'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=600&auto=format&fit=crop', 
        false, 
        true
    );
