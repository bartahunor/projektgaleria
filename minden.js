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



document.addEventListener('DOMContentLoaded', () => {
    // Kiválasztjuk az összes "KOSÁRBA" gombot
    const buttons = document.querySelectorAll('.card .btn');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // ne vigyen át a termékoldalra

            const card = button.closest('.card');
            const id = card.dataset.id;
            const title = card.querySelector('.title').textContent;
            const artist = card.querySelector('.cat').textContent;
            const price = card.querySelector('.price .new').textContent;
            const image = card.querySelector('img').getAttribute('src');

            const product = { id, title, artist, price, image };

            // Kosár lekérése a localStorage-ból (ha nincs, akkor üres tömb)
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Ellenőrizzük, hogy már benne van-e
            const existing = cart.find(item => item.id === id);
            if (!existing) {
                cart.push(product);
                localStorage.setItem('cart', JSON.stringify(cart));

            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const clearButton = document.getElementById('clear-cart');

    // Ha nincs ilyen elem, akkor nem a kosár oldalon vagyunk → kilép
    if (!cartContainer) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>A kosár üres.</p>';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const priceNumber = parseInt(item.price.replace(/\D/g, ''));
        total += priceNumber;

        const productDiv = document.createElement('div');
        productDiv.classList.add('cart-item');
        productDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}" width="100">
            <div>
                <h3>${item.title}</h3>
                <p>${item.artist}</p>
                <p>${item.price}</p>
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
