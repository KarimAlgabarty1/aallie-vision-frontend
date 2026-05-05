// Minimal interactivity for the Aallie-Vision pitch site

function smoothScrollTo(id){
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({behavior: 'smooth', block: 'start'});
}

function setStatus(msg, tone = 'info'){
  const status = document.getElementById('form-status');
  if (!status) return;
  status.textContent = msg;
  status.style.color = tone === 'ok' ? '#7CFFB2' : (tone === 'warn' ? '#FFD166' : 'rgba(234,240,255,.72)');
}

async function requestDemo(){
  try{
    const res = await fetch('/api/demo');
    if(!res.ok) throw new Error('Demo endpoint returned an error');
    const data = await res.json();
    alert(`Demo response: ${data.message || JSON.stringify(data)}`);
  }catch(err){
    console.error(err);
    alert('Demo endpoint is not reachable yet.');
  }
}

function init(){
  // Hook CTA buttons
  const scrollDemo = document.getElementById('scroll-demo');
  const scrollCall = document.getElementById('scroll-call');
  const bookDemoBtn = document.getElementById('book-demo');

  scrollDemo?.addEventListener('click', () => smoothScrollTo('platform'));
  scrollCall?.addEventListener('click', () => smoothScrollTo('call'));
  bookDemoBtn?.addEventListener('click', requestDemo);

  // Contact form
  const form = document.getElementById('call-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try{
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if(!res.ok) throw new Error('Contact endpoint returned an error');
      const data = await res.json();

      form.reset();
      setStatus(data.message || 'Request submitted.', 'ok');
    }catch(err){
      console.error(err);
      setStatus('We had trouble sending your request. Try again later.', 'warn');
    }
  });
}

window.addEventListener('DOMContentLoaded', init);
