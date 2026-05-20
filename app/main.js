const base = '/odata/v4/catalog';
const el = id => document.getElementById(id);
let selectedSupplier = null;

async function fetchSuppliers(){
  const res = await fetch(`${base}/Suppliers`);
  const data = await res.json();
  const ul = el('suppliers'); ul.innerHTML='';
  data.value.forEach(s=>{
    const li = document.createElement('li');
    const title = document.createElement('span');
    title.textContent = s.name + ' ('+s.ID.slice(0,8)+')';
    title.style.cursor='pointer';
    title.onclick = ()=>selectSupplier(s);
    li.appendChild(title);

    const btnReview = document.createElement('button'); btnReview.textContent='Supplier Reviews';
    btnReview.style.marginLeft='8px';
    btnReview.onclick = async (e)=>{ e.stopPropagation(); await supplierReviews(s); };
    li.appendChild(btnReview);

    const del = document.createElement('button'); del.textContent='Delete';
    del.style.marginLeft='8px';
    del.onclick = async (e)=>{ e.stopPropagation(); await deleteSupplier(s.ID); };
    li.appendChild(del);

    ul.appendChild(li);
  });
}

async function supplierReviews(supplier){
  const id = supplier.ID;
  // call bound action (POST)
  const url = `${base}/Suppliers(${id})/SupplierReviews`;
  try {
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
      const txt = await res.text();
      alert('Failed to fetch review: '+txt);
      return;
    }
    const body = await res.json();
    // service returns plain string
    const review = typeof body === 'string' ? body : (body.value || JSON.stringify(body));
    // show review in a simple popup
    alert('Supplier Reviews:\n\n' + review);
  } catch (e) {
    alert('Error fetching review: '+e.message);
  }
}

async function fetchProducts(){
  const ul = el('products'); ul.innerHTML='';
  if(!selectedSupplier) return;
  const res = await fetch(`${base}/Products?$filter=supplier_ID eq '${selectedSupplier.ID}'`);
  const data = await res.json();
  data.value.forEach(p=>{
    const li = document.createElement('li');
    li.textContent = `${p.name} — $${p.price}`;
    const del = document.createElement('button'); del.textContent='Delete';
    del.onclick = async ()=>{ await deleteProduct(p.ID); };
    li.appendChild(del);
    ul.appendChild(li);
  });
}

function selectSupplier(s){
  selectedSupplier = s;
  el('selectedSupplier').textContent = s.name + ' ('+s.ID+')';
  fetchProducts();
}

async function createSupplier(){
  const name = el('newSupplierName').value.trim(); if(!name) return;
  await fetch(`${base}/Suppliers`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
  el('newSupplierName').value='';
  await fetchSuppliers();
}

async function createProduct(){
  if(!selectedSupplier) { alert('Select a supplier first'); return; }
  const name = el('newProductName').value.trim();
  const price = parseFloat(el('newProductPrice').value);
  if(!name) return;
  await fetch(`${base}/Products`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,price,supplier_ID:selectedSupplier.ID})});
  el('newProductName').value=''; el('newProductPrice').value='';
  await fetchProducts();
}

async function deleteSupplier(id){
  if(!confirm('Delete supplier?')) return;
  await fetch(`${base}/Suppliers(${id})`, {method:'DELETE'});
  selectedSupplier = null; el('selectedSupplier').textContent='None';
  await fetchSuppliers(); el('products').innerHTML='';
}

async function deleteProduct(id){
  if(!confirm('Delete product?')) return;
  await fetch(`${base}/Products(${id})`, {method:'DELETE'});
  await fetchProducts();
}

document.addEventListener('DOMContentLoaded', ()=>{
  el('createSupplier').onclick = createSupplier;
  el('createProduct').onclick = createProduct;
  fetchSuppliers();
});
