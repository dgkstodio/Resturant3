-- 1. Create the menu_items table
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy to allow anyone to read the menu (SELECT)
CREATE POLICY "Allow public read access" 
ON menu_items FOR SELECT 
TO public 
USING (true);

-- 4. Create Policy to allow public CRUD operations (for easy setup, we protect it via frontend PIN)
-- NOTE: In production, you should restrict write access to authenticated users only.
CREATE POLICY "Allow public write access" 
ON menu_items FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- 5. Insert sample data (Luxury Restaurant Menu - Thai & Western Fusion)
INSERT INTO menu_items (name, description, price, category, image_url, is_featured, is_available)
VALUES
    (
        'Truffle Golden Dumplings', 
        'Steamed dumplings stuffed with premium pork, topped with black truffle paste and edible 24k gold leaf.', 
        350.00, 
        'starter', 
        'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=600&auto=format&fit=crop', 
        true, 
        true
    ),
    (
        'Caviar Butter Oysters', 
        'Fresh imported oysters served chilled with French caviar and champagne-infused butter sauce.', 
        590.00, 
        'starter', 
        'https://images.unsplash.com/photo-1553618551-fba689030290?q=80&w=600&auto=format&fit=crop', 
        false, 
        true
    ),
    (
        'Wagyu Beef Massaman Curry', 
        'Slow-cooked A5 Wagyu beef in rich, aromatic southern-style Massaman curry, served with warm roti.', 
        1250.00, 
        'main', 
        'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop', 
        true, 
        true
    ),
    (
        'Lobster Pad Thai Caviar', 
        'Stir-fried rice noodles with whole Canadian lobster tail, premium tofu, sweet tamarind glaze, topped with caviar.', 
        980.00, 
        'main', 
        'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=600&auto=format&fit=crop', 
        true, 
        true
    ),
    (
        'Golden Saffron Crème Brûlée', 
        'Classic French custard infused with Persian saffron, caramelized sugar crust, and edible gold leaf.', 
        280.00, 
        'dessert', 
        'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=600&auto=format&fit=crop', 
        false, 
        true
    ),
    (
        'Royal Valrhona Chocolate Dome', 
        'Rich dark Valrhona chocolate mousse sphere, hot gold-flecked caramel sauce poured tableside.', 
        320.00, 
        'dessert', 
        'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600&auto=format&fit=crop', 
        true, 
        true
    ),
    (
        '24K Gold Espresso Martini', 
        'Premium vodka, fresh espresso, coffee liqueur, shaken and garnished with a sheet of edible 24k gold leaf.', 
        380.00, 
        'drink', 
        'https://images.unsplash.com/photo-1542849187-5ec6ea5e6a27?q=80&w=600&auto=format&fit=crop', 
        false, 
        true
    ),
    (
        'Royal Crimson Elixir', 
        'Sweet-sour herbal mocktail with hibiscus, rose water, sparkling apple cider, and golden dust.', 
        220.00, 
        'drink', 
        'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=600&auto=format&fit=crop', 
        false, 
        true
    );
