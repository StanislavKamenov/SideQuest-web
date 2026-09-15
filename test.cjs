const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const payload = {
  aud: 'authenticated',
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
  sub: '5d84db82-7662-42d8-a903-0048a0b404b0',
  email: 'stanislav.kamenov39@gmail.com',
  phone: '',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: {},
  role: 'authenticated'
};
const secret = 'ndafcwQmoSRQkZsOQLcGAIpUFP1IC0V9ViGpa8McxRQ';
const token = jwt.sign(payload, secret);
const supabase = createClient('https://lhymzudccfhiczgzbcfs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoeW16dWRjY2ZoaWN6Z3piY2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NjkwNjQsImV4cCI6MjA5NTA0NTA2NH0.ndafcwQmoSRQkZsOQLcGAIpUFP1IC0V9ViGpa8McxRQ', {
  global: {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
});
async function test() {
  const { data, error } = await supabase.from('missions').insert({
    title: 'Test',
    description: 'Test',
    type: 'event',
    category: 'side',
    is_global: false,
    lat: 42.6977,
    lng: 23.3219,
    radius_m: 100,
    created_by: '5d84db82-7662-42d8-a903-0048a0b404b0'
  }).select();
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
