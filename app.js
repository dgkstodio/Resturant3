// ==========================================
// APPLICATION LOGIC - SUPABASE & UI HANDLERS
// ==========================================

let supabaseClient = null;
let isDemoMode = true;
let allMenuItems = [];
let currentCategory = 'all';
let searchQuery = '';

// Default mock data for Demo Mode (LocalStorage Fallback)
const defaultMockData = [
  {
    id: "mock-1",
    name: "เกี๊ยวทรัฟเฟิลทองคำ (Truffle Golden Dumplings)",
    description: "เกี๊ยวนึ่งไส้หมูคุโรบุตะระดับพรีเมียม ท็อปด้วยทรัฟเฟิลบดบริสุทธิ์และทองคำเปลว 24K เลอค่า",
    price: 350.00,
    category: "starter",
    image_url: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=600&auto=format&fit=crop",
    is_featured: true,
    is_available: true
  },
  {
    id: "mock-2",
    name: "หอยนางรมคาเวียร์แชมเปญ (Caviar Butter Oysters)",
    description: "หอยนางรมนำเข้าสดใหม่ เสิร์ฟเย็นพร้อมคาเวียร์ฝรั่งเศสชั้นเลิศและซอสเนยแชมเปญ",
    price: 590.00,
    category: "starter",
    image_url: "https://images.unsplash.com/photo-1553618551-fba689030290?q=80&w=600&auto=format&fit=crop",
    is_featured: false,
    is_available: true
  },
  {
    id: "mock-3",
    name: "มัสมั่นเนื้อวากิว A5 (Wagyu Beef Massaman)",
    description: "แกงมัสมั่นเนื้อวากิว A5 เคี่ยวจนนุ่มละมุนลิ้น รสชาติเข้มข้น หอมเครื่องเทศ เสิร์ฟพร้อมโรตีกรอบร้อนๆ",
    price: 1250.00,
    category: "main",
    image_url: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop",
    is_featured: true,
    is_available: true
  },
  {
    id: "mock-4",
    name: "ผัดไทยล็อบสเตอร์คาเวียร์ (Lobster Pad Thai Caviar)",
    description: "ผัดไทยเส้นจันท์เหนียวนุ่ม เสิร์ฟคู่กับกุ้งล็อบสเตอร์แคนาดาตัวโต ซอสมะขามสูตรลับโรยหน้าด้วยไข่ปลาคาเวียร์",
    price: 980.00,
    category: "main",
    image_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=600&auto=format&fit=crop",
    is_featured: true,
    is_available: true
  },
  {
    id: "mock-5",
    name: "เครมบรูเลหญ้าฝรั่นสีทอง (Saffron Crème Brûlée)",
    description: "เครมบรูเลสูตรคลาสสิกฝรั่งเศส หอมกลิ่นหญ้าฝรั่นสีทอง หน้าคาราเมลกรอบท็อปด้วยแผ่นทองคำเปลว",
    price: 280.00,
    category: "dessert",
    image_url: "https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=600&auto=format&fit=crop",
    is_featured: false,
    is_available: true
  },
  {
    id: "mock-6",
    name: "โดมช็อกโกแลตซอสทองคำ (Royal Valrhona Chocolate Dome)",
    description: "ช็อกโกแลตมูสโดมทำจาก Valrhona ดาร์กช็อกโกแลตเข้มข้น ราดซอสคาราเมลอุ่นผสมเกล็ดทองคำแบบตระการตา",
    price: 320.00,
    category: "dessert",
    image_url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600&auto=format&fit=crop",
    is_featured: true,
    is_available: true
  },
  {
    id: "mock-7",
    name: "เอสเพรสโซ่มาร์ตินี่ 24K (24K Gold Espresso Martini)",
    description: "วอดก้าพรีเมียมและเอสเพรสโซ่ช็อตเข้มข้น เขย่าจนเกิดฟองนุ่ม ตกแต่งด้วยแผ่นทองคำเปลวบริสุทธิ์ทานได้",
    price: 380.00,
    category: "drink",
    image_url: "https://images.unsplash.com/photo-1542849187-5ec6ea5e6a27?q=80&w=600&auto=format&fit=crop",
    is_featured: false,
    is_available: true
  }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initConnection();
  setupEventListeners();
  loadMenuItems();
  checkAdminSession();
});

// Track GA4 Custom Events helper
function trackGA4Event(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
    console.log(`[GA4 Event] ${eventName}:`, params);
  }
}

// Initialize Supabase or fall back to Demo Mode
function initConnection() {
  const isDefaultUrl = SUPABASE_URL === "YOUR_SUPABASE_URL" || !SUPABASE_URL;
  const isDefaultKey = SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY" || !SUPABASE_ANON_KEY;

  if (isDefaultUrl || isDefaultKey) {
    isDemoMode = true;
    console.warn("Supabase credentials not configured. Running in local Demo Mode.");
    showDemoBanner();
  } else {
    try {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      isDemoMode = false;
      console.log("Supabase Client initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error);
      isDemoMode = true;
      showDemoBanner();
    }
  }
}

// Show warning banner for local Demo Mode
function showDemoBanner() {
  const banner = document.createElement('div');
  banner.id = 'demo-banner';
  banner.style.cssText = `
    background: linear-gradient(90deg, #8a6623, #d4af37);
    color: #0a0a0b;
    text-align: center;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 101;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  `;
  banner.innerHTML = `
    <i data-lucide="info" style="width: 16px; height: 16px;"></i>
    <span>ระบบทดสอบ (Local Storage Mode): กรุณาใส่ข้อมูลเชื่อมต่อ Supabase ของคุณในไฟล์ <strong>config.js</strong> เพื่อบันทึกข้อมูลแบบคลาวด์</span>
  `;
  document.body.insertBefore(banner, document.body.firstChild);
  lucide.createIcons();
}

// Check admin login session on load
function checkAdminSession() {
  const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
  const indicator = document.getElementById('admin-indicator');
  const toggleBtnText = document.getElementById('admin-btn-text');

  if (isLoggedIn) {
    indicator.style.display = 'flex';
    toggleBtnText.textContent = 'แดชบอร์ด';
  } else {
    indicator.style.display = 'none';
    toggleBtnText.textContent = 'ผู้จัดการ';
  }
  lucide.createIcons();
}

// Fetch and load items
async function loadMenuItems() {
  const featuredContainer = document.getElementById('featured-items-container');
  const menuContainer = document.getElementById('menu-items-container');

  try {
    if (isDemoMode) {
      // Local Storage Mode
      let items = localStorage.getItem('menu_items');
      if (!items) {
        localStorage.setItem('menu_items', JSON.stringify(defaultMockData));
        allMenuItems = defaultMockData;
      } else {
        allMenuItems = JSON.parse(items);
      }
    } else {
      // Supabase Cloud Mode
      const { data, error } = await supabaseClient
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      allMenuItems = data || [];
    }

    renderPublicView();
  } catch (error) {
    console.error("Error loading menu items:", error);
    menuContainer.innerHTML = `
      <div class="no-items">
        <i data-lucide="alert-triangle" style="color: #ff4d4f; margin-bottom: 0.5rem;"></i>
        <p>ไม่สามารถดึงข้อมูลเมนูอาหารได้จาก Supabase กรุณาตรวจสอบสิทธิ์การเข้าถึงฐานข้อมูล</p>
      </div>
    `;
    lucide.createIcons();
  }
}

// Render Featured and Filtered Menu Items
function renderPublicView() {
  const featuredContainer = document.getElementById('featured-items-container');
  const menuContainer = document.getElementById('menu-items-container');

  // 1. Render Featured Items
  const featuredItems = allMenuItems.filter(item => item.is_featured && item.is_available);
  if (featuredItems.length === 0) {
    featuredContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">
        ไม่มีเมนูแนะนำพิเศษในขณะนี้
      </div>
    `;
  } else {
    featuredContainer.innerHTML = featuredItems.map(item => createCardHTML(item, true)).join('');
  }

  // 2. Render Main Menu Gallery (Filtered)
  const filteredItems = allMenuItems.filter(item => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (filteredItems.length === 0) {
    menuContainer.innerHTML = `
      <div class="no-items">
        <i data-lucide="search" style="margin-bottom: 0.5rem;"></i>
        <p>ไม่พบเมนูอาหารที่ค้นหา</p>
      </div>
    `;
  } else {
    menuContainer.innerHTML = filteredItems.map(item => createCardHTML(item, false)).join('');
  }

  lucide.createIcons();
}

// Create Card HTML markup
function createCardHTML(item, isFeaturedSection) {
  const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";
  const statusHTML = item.is_available 
    ? `<span class="menu-card-status"><span class="status-dot status-available"></span>พร้อมเสิร์ฟ</span>`
    : `<span class="menu-card-status"><span class="status-dot status-unavailable"></span>หมดชั่วคราว</span>`;
  
  const formattedPrice = Number(item.price).toLocaleString('th-TH', { minimumFractionDigits: 2 });
  const categoryNames = {
    starter: 'อาหารเรียกน้ำย่อย',
    main: 'อาหารจานหลัก',
    dessert: 'ของหวาน',
    drink: 'เครื่องดื่ม'
  };

  return `
    <div class="menu-card">
      <div class="menu-card-img-wrapper">
        <img src="${item.image_url || fallbackImg}" alt="${item.name}" class="menu-card-img" onerror="this.src='${fallbackImg}'">
        ${isFeaturedSection ? `<span class="menu-card-badge">Signature</span>` : ''}
      </div>
      <div class="menu-card-content">
        <div class="menu-card-header">
          <h3 class="menu-card-title">${item.name}</h3>
          <span class="menu-card-price">${formattedPrice}.-</span>
        </div>
        <p class="menu-card-description">${item.description || 'ไม่มีคำอธิบาย'}</p>
        <div class="menu-card-footer">
          <span class="menu-card-category">${categoryNames[item.category] || item.category}</span>
          ${statusHTML}
        </div>
      </div>
    </div>
  `;
}

// Setup Application UI Action Event Listeners
function setupEventListeners() {
  // Search filter
  let searchTimeout;
  const searchInput = document.getElementById('menu-search');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPublicView();

    // Debounce search tracking to avoid spamming GA4
    clearTimeout(searchTimeout);
    if (searchQuery.trim().length > 0) {
      searchTimeout = setTimeout(() => {
        trackGA4Event('search', {
          search_term: searchQuery
        });
      }, 1000); // 1-second delay
    }
  });

  // Category filter tabs
  const tabContainer = document.getElementById('category-container');
  tabContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-tab')) {
      // Update UI active class
      document.querySelectorAll('.category-tab').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      currentCategory = e.target.getAttribute('data-category');
      renderPublicView();

      // Track category selection
      trackGA4Event('select_content', {
        content_type: 'menu_category',
        item_id: currentCategory
      });
    }
  });

  // Toggle Admin Button in Header
  const adminToggleBtn = document.getElementById('admin-toggle-btn');
  adminToggleBtn.addEventListener('click', () => {
    const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
    if (isLoggedIn) {
      openModal('dashboard-modal');
      renderAdminDashboard();
    } else {
      openModal('pin-modal');
    }
  });

  // Close modals
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modalId = btn.getAttribute('data-modal') || btn.closest('.modal-overlay').id;
      closeModal(modalId);
    });
  });

  // Admin PIN digits input focus auto-jump
  const pinInputs = document.querySelectorAll('.pin-digit');
  pinInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && index < pinInputs.length - 1) {
        pinInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        pinInputs[index - 1].focus();
      }
    });
  });

  // PIN Submission
  const pinSubmitBtn = document.getElementById('pin-submit-btn');
  pinSubmitBtn.addEventListener('click', verifyPIN);

  // Logout Admin Action
  const logoutBtn = document.getElementById('admin-logout-btn');
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_logged_in');
    checkAdminSession();
    closeModal('dashboard-modal');
    closeModal('form-modal');
    trackGA4Event('admin_logout');
    alert('ออกจากระบบผู้จัดการแล้ว');
  });

  // Add New Item Button (Opens Form)
  const addNewItemBtn = document.getElementById('add-new-item-btn');
  addNewItemBtn.addEventListener('click', () => {
    openModal('form-modal');
    document.getElementById('form-modal-title').textContent = "เพิ่มเมนูอาหารใหม่";
    document.getElementById('menu-item-form').reset();
    document.getElementById('form-item-id').value = "";
  });

  // Menu Form Submission
  const menuForm = document.getElementById('menu-item-form');
  menuForm.addEventListener('submit', handleFormSubmit);
}

// Modal open/close helpers
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  
  // Clear PIN inputs if closing PIN modal
  if (id === 'pin-modal') {
    document.querySelectorAll('.pin-digit').forEach(input => input.value = '');
    document.getElementById('pin-error').style.display = 'none';
  }
}

// PIN Verification Logic
function verifyPIN() {
  const pin = Array.from(document.querySelectorAll('.pin-digit')).map(input => input.value).join('');
  const pinError = document.getElementById('pin-error');

  if (pin === ADMIN_PIN) {
    sessionStorage.setItem('admin_logged_in', 'true');
    checkAdminSession();
    closeModal('pin-modal');
    openModal('dashboard-modal');
    renderAdminDashboard();
    
    // Track successful login
    trackGA4Event('login', { method: 'PIN', success: true });
  } else {
    pinError.style.display = 'block';
    // Clear and focus first
    document.querySelectorAll('.pin-digit').forEach((input, index) => {
      input.value = '';
      if (index === 0) input.focus();
    });
    
    // Track failed login
    trackGA4Event('login', { method: 'PIN', success: false });
  }
}

// Render Admin Dashboard Table Row Entries
function renderAdminDashboard() {
  const tbody = document.getElementById('admin-table-body');
  
  if (allMenuItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          ไม่มีรายการเมนูอาหารในระบบ กดปุ่ม "เพิ่มเมนูใหม่" ด้านบนเพื่อรังสรรค์เมนูแรก
        </td>
      </tr>
    `;
    return;
  }

  const categoryNames = {
    starter: 'เรียกน้ำย่อย',
    main: 'จานหลัก',
    dessert: 'ของหวาน',
    drink: 'เครื่องดื่ม'
  };

  tbody.innerHTML = allMenuItems.map(item => {
    const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";
    const statusText = item.is_available 
      ? '<span style="color:#52c41a;">พร้อมให้บริการ</span>' 
      : '<span style="color:#f5222d;">หมดชั่วคราว</span>';
    
    return `
      <tr>
        <td>
          <img src="${item.image_url || fallbackImg}" class="table-img" onerror="this.src='${fallbackImg}'">
        </td>
        <td>
          <div style="font-weight:600; color:var(--text-white);">${item.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
            ${item.description || 'ไม่มีคำอธิบาย'}
          </div>
          ${item.is_featured ? '<span style="font-size: 0.7rem; background: var(--gold-dark); color: var(--text-white); padding: 0.1rem 0.4rem; border-radius: 2px;">แนะนำ</span>' : ''}
        </td>
        <td style="color: var(--gold-secondary);">${categoryNames[item.category] || item.category}</td>
        <td style="font-weight:bold; color:var(--gold-primary);">${Number(item.price).toLocaleString()}</td>
        <td>${statusText}</td>
        <td>
          <div class="table-actions">
            <button class="btn-icon edit" onclick="editItem('${item.id}')" title="แก้ไข">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="btn-icon delete" onclick="deleteItem('${item.id}')" title="ลบ">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  lucide.createIcons();
}

// Window-scope triggers for dynamically generated table elements
window.editItem = function(id) {
  const item = allMenuItems.find(i => i.id === id);
  if (!item) return;

  // Pop up Form Modal and fill values
  openModal('form-modal');
  document.getElementById('form-modal-title').textContent = "แก้ไขข้อมูลเมนูอาหาร";
  document.getElementById('form-item-id').value = item.id;
  document.getElementById('form-name').value = item.name;
  document.getElementById('form-description').value = item.description || "";
  document.getElementById('form-price').value = item.price;
  document.getElementById('form-category').value = item.category;
  document.getElementById('form-image').value = item.image_url || "";
  document.getElementById('form-is-featured').checked = !!item.is_featured;
  document.getElementById('form-is-available').checked = !!item.is_available;
};

window.deleteItem = async function(id) {
  const item = allMenuItems.find(i => i.id === id);
  if (!item) return;

  if (!confirm(`คุณต้องการลบเมนู "${item.name}" ใช่หรือไม่?`)) return;

  try {
    if (isDemoMode) {
      // Local Storage Delete
      allMenuItems = allMenuItems.filter(i => i.id !== id);
      localStorage.setItem('menu_items', JSON.stringify(allMenuItems));
    } else {
      // Supabase Delete
      const { error } = await supabaseClient
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      allMenuItems = allMenuItems.filter(i => i.id !== id);
    }

    renderPublicView();
    renderAdminDashboard();
    
    // Track item deletion
    trackGA4Event('delete_menu_item', {
      item_id: id,
      item_name: item.name,
      item_category: item.category
    });
    
    alert('ลบรายการสำเร็จ');
  } catch (error) {
    console.error("Error deleting item:", error);
    alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
  }
};

// Form submit insertion/updating logic
async function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('form-item-id').value;
  const name = document.getElementById('form-name').value;
  const description = document.getElementById('form-description').value;
  const price = parseFloat(document.getElementById('form-price').value);
  const category = document.getElementById('form-category').value;
  const image_url = document.getElementById('form-image').value;
  const is_featured = document.getElementById('form-is-featured').checked;
  const is_available = document.getElementById('form-is-available').checked;

  const itemPayload = {
    name,
    description,
    price,
    category,
    image_url,
    is_featured,
    is_available
  };

  try {
    if (isDemoMode) {
      // Local Storage Write
      if (id) {
        // Edit Item
        const index = allMenuItems.findIndex(i => i.id === id);
        if (index !== -1) {
          allMenuItems[index] = { ...allMenuItems[index], ...itemPayload };
        }
      } else {
        // Create Item
        const newItem = {
          id: 'mock-' + Date.now(),
          created_at: new Date().toISOString(),
          ...itemPayload
        };
        allMenuItems.unshift(newItem);
      }
      localStorage.setItem('menu_items', JSON.stringify(allMenuItems));
    } else {
      // Supabase Cloud Write
      if (id) {
        // Edit Item
        const { error } = await supabaseClient
          .from('menu_items')
          .update(itemPayload)
          .eq('id', id);

        if (error) throw error;
        
        // Local state update
        const index = allMenuItems.findIndex(i => i.id === id);
        if (index !== -1) {
          allMenuItems[index] = { ...allMenuItems[index], ...itemPayload };
        }
      } else {
        // Create Item
        const { data, error } = await supabaseClient
          .from('menu_items')
          .insert([itemPayload])
          .select();

        if (error) throw error;
        
        // Refresh local state list
        if (data && data[0]) {
          allMenuItems.unshift(data[0]);
        } else {
          // Fallback refresh
          await loadMenuItems();
          return;
        }
      }
    }

    // Track GA4 event for add/edit operation
    if (id) {
      trackGA4Event('edit_menu_item', {
        item_id: id,
        item_name: name,
        item_category: category,
        item_price: price
      });
    } else {
      trackGA4Event('add_menu_item', {
        item_name: name,
        item_category: category,
        item_price: price
      });
    }

    renderPublicView();
    renderAdminDashboard();
    closeModal('form-modal');
    alert('บันทึกข้อมูลเรียบร้อยแล้ว');
  } catch (error) {
    console.error("Error saving menu item:", error);
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
  }
}
