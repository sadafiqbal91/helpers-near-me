const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://mxwiawnjpciagwiyseat.supabase.co','sb_publishable__Wd0J_rKiTOqecAVoXPJCA_f8KZN3p0');

(async () => {
  try {
    const r1 = await supabase.from('workers').select('*').limit(1);
    const r2 = await supabase.from('bookings').select('*').limit(1);
    console.log('workers:', r1.data ? r1.data.length + ' rows' : 'error');
    console.log('bookings:', r2.data ? r2.data.length + ' rows' : 'error');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();