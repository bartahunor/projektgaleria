/*
async: azt jelenti, hogy a függvény aszinkron, tehát await-tel várhatunk a hosszabb ideig tartó műveletekre (pl. fájl betöltés).
fetch(file): lekéri a megadott HTML fájlt (header.html, footer.html, subscribe.html).
response.ok: ellenőrzi, hogy sikeres volt-e a betöltés (HTTP 200–299).
document.getElementById(id).innerHTML = await response.text(): ha sikeres, akkor a fájl tartalmát beilleszti a megadott id-jú HTML elembe.
Ha nem sikerül betölteni, a console.error kiírja, melyik fájl nem töltődött be.
*/
async function includeHTML(id, file) {  
  const response = await fetch(file);
  if (response.ok) {
    document.getElementById(id).innerHTML = await response.text();
  } else {
    console.error(`Nem sikerült betölteni: ${file}`);
  }
}

/*
DOMContentLoaded: ez az esemény akkor fut le, amikor az oldal HTML-je teljesen betöltődött, de a képek még nem feltétlenül.
await includeHTML(...): várja, hogy az adott fájl teljesen be legyen illesztve, mielőtt a következő sor futna. Így biztos, hogy a következő kód már a DOM-ban találja az újonnan beszúrt elemeket.
*/
window.addEventListener("DOMContentLoaded", async () => {
  await includeHTML("header", "header.html");
  await includeHTML("footer", "footer.html");
  await includeHTML("sub", "subscribe.html");

  const subscribePanel = document.getElementById('subscribePanel');
  const subscribeTab = document.getElementById('subscribeTab');
  const subscribeForm = document.getElementById('subscribeForm');

  /*
  if(subscribeTab && subscribePanel): ellenőrizzük, hogy az elemek léteznek. Ez fontos, mert csak a betöltés után érhetők el.
  addEventListener('click', ...): amikor a felhasználó rákattint a fülre:
  classList.toggle('active'): hozzáadja vagy eltávolítja az active osztályt a panelhez.
  A CSS-ben az active osztály jobbról beúsztatja a panelt, tehát a feliratkozó form láthatóvá válik.
  */
  if(subscribeTab && subscribePanel){
    subscribeTab.addEventListener('click', () => {
      subscribePanel.classList.toggle('active');
    });
  }

  /*
  e.preventDefault(): megakadályozza, hogy a form ténylegesen elküldje az adatokat és újratöltse az oldalt.
  subscribePanel.classList.remove('active'): bezárja a panelt.
  subscribeForm.reset(): törli a form mezőit (név, email).
  */
  if(subscribeForm){
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      subscribePanel.classList.remove('active');
      subscribeForm.reset();
    });
  }
});



window.addEventListener("scroll", function(e) {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      scrollEvent(last_known_scroll_position);
      ticking = false;
    });
  }

  ticking = true;
});



function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    );
  }

  function checkScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-anim');
    elements.forEach(el => {
      if (isInViewport(el)) {
        el.classList.add('in-view');
      } else {
        el.classList.remove('in-view');
      }
    });
  }

  document.addEventListener('scroll', checkScrollAnimations);
  document.addEventListener('DOMContentLoaded', checkScrollAnimations);



function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  saveCart(cart);
}

/* ----------------------------
   🖼️ WEBSHOP – Termék hozzáadása
---------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.card .btn');
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const card = button.closest('.card');
      const rawId = card.dataset.id;                  // pl. "12"
      const id = 'product_' + rawId;                  // pl. "product_12" — egységes formátum
      const title = card.querySelector('.title').textContent.trim();
      const artist = card.querySelector('.cat').textContent.trim();
      const price = card.querySelector('.price .new').textContent.trim();
      const image = card.querySelector('img').getAttribute('src');

      const product = { id, title, artist, price, image, quantity: 1 };
      addToCart(product);
    });
  });
});
/* ----------------------------
   🎟️ JEGYEK – Kosárba helyezés
---------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const ticketButtons = document.querySelectorAll('.ticket-table .btn');

  ticketButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.closest('.sor');
      const title = row.querySelector('div > div:first-child').textContent.trim();
      const price = row.querySelector('.price').textContent.trim();
      const quantity = parseInt(row.querySelector('.counter-number').textContent) || 0;

      if (quantity === 0) {
        return;
      }

      const id = 'ticket_' + title.toLowerCase().replace(/\s+/g, '_');
      const ticket = { id, title, artist: 'Belépőjegy', price, image: '', quantity };

      addToCart(ticket);

      row.querySelector('.counter-number').textContent = '0';
    });
  });
});

/* ----------------------------
   🖼️ TERMÉKOLDAL – Kosárba gomb működése
---------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.querySelector('.termekleiras .btn');
  if (!addButton) return;

  addButton.addEventListener('click', () => {
    // Ha van korábban elmentett data-id (amikor a kártyára kattintottak), használjuk
    const rawId = localStorage.getItem('selectedProduct'); // pl. "12"
    const id = rawId ? ('product_' + rawId) : ('product_' + document.getElementById('ptitle').textContent.trim().toLowerCase().replace(/\s+/g,'_'));

    const title = document.getElementById('ptitle').textContent.trim();
    const artist = document.getElementById('partist').textContent.trim();
    const price = document.getElementById('pprice').textContent.trim();
    const image = document.getElementById('pimage').getAttribute('src');

    const product = { id, title, artist, price, image, quantity: 1 };

    // Kosár lekérése, frissítés (duplikáció-ellenőrzés)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity = (existing.quantity || 0) + 1;
    } else {
      cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    if (typeof updateCartCount === 'function') updateCartCount();
  });
});

/* ----------------------------
   🎁 AJÁNLOTT TERMÉKEK – Kosárba gomb működése
---------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const suggestedButtons = document.querySelectorAll('.ajanlotitemek .btn');
  if (!suggestedButtons.length) return;

  suggestedButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const images = document.querySelectorAll('.ajanlotitemek img');
      const titles = document.querySelectorAll('.ajanlotitemek h2');
      const prices = document.querySelectorAll('.ajanlotitemek h3');

      const image = images[index].getAttribute('src');
      const titleFull = titles[index].textContent.trim();
      const price = prices[index].textContent.trim();

      const [artist, title] = titleFull.split(' - ');
      const id = 'suggested_' + title.toLowerCase().replace(/\s+/g, '_');
      const product = { id, title, artist, price, image, quantity: 1 };

      // 🔹 Kosár kezelése
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(product);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      if (typeof updateCartCount === 'function') updateCartCount();
    });
  });
});

/* ----------------------------
   🛒 KOSÁR OLDAL MEGJELENÍTÉS
---------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const clearButton = document.getElementById('clear-cart');

  if (!cartContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>A kosár üres.</p>';
    return;
  }

  let total = 0;
  cartContainer.innerHTML = '';

  cart.forEach(item => {
    const priceNumber = parseInt(item.price.replace(/\D/g, '')) || 0;
    const subtotal = priceNumber * (item.quantity || 1);
    total += subtotal;

    const productDiv = document.createElement('div');
    productDiv.classList.add('cart-item');
    productDiv.innerHTML = `
      <div class="cart-item-content">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" width="100">` : ''}
        <div>
          <h3>${item.title}</h3>
          ${item.artist ? `<p>${item.artist}</p>` : ''}
          <p>${item.price}</p>
          <p>Mennyiség: ${item.quantity || 1} db</p>
        </div>
      </div>
    `;
    cartContainer.appendChild(productDiv);
  });

  cartTotal.innerHTML = `<h3>Összesen: ${total.toLocaleString('hu-HU')} Ft</h3>`;

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      localStorage.removeItem('cart');
      window.location.reload();
    });
  }
});

/* ----------------------------
   🧮 KOSÁR SZÁMLÁLÓ FRISSÍTÉSE
---------------------------- */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = count;
}

// oldal betöltéskor frissítjük
document.addEventListener('DOMContentLoaded', updateCartCount);

// és amikor bármi kosárba kerül:
const oldAddToCart = addToCart;
addToCart = function(product) {
  oldAddToCart(product);
  updateCartCount();
};