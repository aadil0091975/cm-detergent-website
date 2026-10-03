const WHATSAPP = "919142134566";

const COLLECTIONS = [
  { id: "laundry", name: "Laundry Care", line: "Bright whites, soft colours, fresh fabric.", img: "washing-soap" },
  { id: "home", name: "Home Care", line: "Sparkling dishes and shining floors.", img: "dishwash-bar" },
  { id: "hygiene", name: "Hygiene", line: "Protection for every corner of your home.", img: "black-phenyl" },
  { id: "personal", name: "Personal Care", line: "Beauty soaps and natural aromas.", img: "rose-rich-soap" },
];

const PRODUCTS = [
  { name: "Liquid Detergent", c: "laundry", img: "liquid-detergent", desc: "A rich liquid detergent for hand wash and machine wash. Dissolves fully and lifts everyday stains." },
  { name: "Liquid Concentrator", c: "laundry", img: "concentrator", desc: "Make your own liquid detergent at home. One pack gives a large quantity of washing liquid." },
  { name: "Jumbo Washing Soap", c: "laundry", img: "washing-soap", desc: "The classic DEKAY washing bar. Strong lather that makes whites whiter and colours brighter." },
  { name: "Fabric Conditioner Green", c: "laundry", img: "conditioner-green", desc: "Leaves clothes soft, smooth and fresh with a long-lasting fragrance." },
  { name: "Fabric Conditioner Pink", c: "laundry", img: "conditioner-pink", desc: "A gentle conditioner with a floral fragrance for soft, fresh-smelling clothes." },
  { name: "DK Conditioner", c: "laundry", img: "dk-conditioner", desc: "Everyday fabric conditioner for softness and freshness after every wash." },
  { name: "Fabric Stiffener", c: "laundry", img: "fabric-stiffener", desc: "Gives cotton clothes and sarees a crisp, neat finish without the fuss of starch." },
  { name: "Dishwash Bar", c: "home", img: "dishwash-bar", desc: "Cuts through grease and oil on vessels. Leaves dishes clean and shining." },
  { name: "Floor Cleaner Green", c: "home", img: "floor-cleaner-green", desc: "Cleans and shines floors and leaves a fresh fragrance in the room." },
  { name: "Floor Cleaner Red", c: "home", img: "floor-cleaner-red", desc: "A fragrant floor cleaner for tiles and marble. A sparkling finish in one wipe." },
  { name: "Disinfectant", c: "hygiene", img: "disinfectant", desc: "A disinfectant liquid for floors, bathrooms and surfaces around the home." },
  { name: "Toilet Cleaner", c: "hygiene", img: "toilet-cleaner", desc: "A thick toilet cleaner that removes stains and keeps the toilet bowl fresh." },
  { name: "Black Phenyl", c: "hygiene", img: "black-phenyl", desc: "Traditional black phenyl for drains, bathrooms and outdoor areas." },
  { name: "Bleaching Powder", c: "hygiene", img: "bleaching-powder", desc: "For cleaning bathrooms, drains and tough areas that need extra care." },
  { name: "Ant Repellent", c: "hygiene", img: "ant-repellent", desc: "Keeps ants away from your kitchen, corners and floors." },
  { name: "Glycerin Soap", c: "personal", img: "glycerin-soap", desc: "A clear glycerin bath soap with coconut oil, for soft and glowing skin." },
  { name: "Ayur Soap", c: "personal", img: "ayur-soap", desc: "A herbal bath soap inspired by Ayurveda, for daily freshness." },
  { name: "Rose Rich Beauty Soap", c: "personal", img: "rose-rich-soap", desc: "A rose-scented beauty soap for a soft feel and a gentle floral fragrance." },
  { name: "Soofi Aqua", c: "personal", img: "soofi-aqua", desc: "A fresh aqua bath soap for a cool, clean, glowing feeling." },
  { name: "Lemongrass Essential Oil", c: "personal", img: "lemongrass-oil", desc: "Pure lemongrass aroma for diffusers and a fresh, calming home." },
];

const collectionName = id => COLLECTIONS.find(c => c.id === id).name;
const colour = id => `var(--c-${id})`;
const imgPath = (name, w = 1600) => `assets/products/${name}-${w}.jpg`;
const srcset = name => `${imgPath(name, 800)} 800w, ${imgPath(name)} 1600w`;
const waLink = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;

/* ----- Render collections ----- */
document.getElementById("collectionCards").innerHTML = COLLECTIONS.map(c => {
  const count = PRODUCTS.filter(p => p.c === c.id).length;
  return `
    <button class="collection reveal" data-filter="${c.id}" style="--c: ${colour(c.id)}">
      <img src="${imgPath(c.img)}" srcset="${srcset(c.img)}" sizes="(max-width: 560px) 200vw, (max-width: 1100px) 100vw, 50vw" alt="" loading="lazy">
      <span class="collection__tag">${count} products</span>
      <span class="collection__arrow" aria-hidden="true">→</span>
      <span class="collection__body">
        <span class="collection__name">${c.name}</span>
        <span class="collection__line">${c.line}</span>
      </span>
    </button>`;
}).join("");

/* ----- Render filters + products ----- */
const filters = document.getElementById("filters");
filters.innerHTML = [{ id: "all", name: "All Products" }, ...COLLECTIONS]
  .map(c => `<button class="filter${c.id === "all" ? " is-active" : ""}" role="tab" data-filter="${c.id}">${c.name}</button>`)
  .join("");

const grid = document.getElementById("productGrid");
grid.innerHTML = PRODUCTS.map((p, i) => `
  <article class="card reveal" data-c="${p.c}" data-i="${i}" tabindex="0" role="button" aria-label="${p.name} — view details" style="--c: ${colour(p.c)}">
    <div class="card__img">
      <span class="card__idx">${String(i + 1).padStart(2, "0")}</span>
      <img src="${imgPath(p.img, 800)}" srcset="${srcset(p.img)}" sizes="(max-width: 560px) 100vw, 400px" alt="DEKAY ${p.name}" loading="lazy">
    </div>
    <div class="card__body">
      <p class="card__cat">${collectionName(p.c)}</p>
      <h3 class="card__name">${p.name}</h3>
      <p class="card__desc">${p.desc}</p>
      <span class="card__more">View &amp; enquire</span>
    </div>
  </article>`).join("");

function applyFilter(id) {
  filters.querySelectorAll(".filter").forEach(b => b.classList.toggle("is-active", b.dataset.filter === id));
  grid.querySelectorAll(".card").forEach(card => {
    card.classList.toggle("is-hidden", id !== "all" && card.dataset.c !== id);
    card.classList.add("is-in");
  });
}
filters.addEventListener("click", e => {
  const b = e.target.closest(".filter");
  if (b) applyFilter(b.dataset.filter);
});
document.getElementById("collectionCards").addEventListener("click", e => {
  const b = e.target.closest(".collection");
  if (!b) return;
  applyFilter(b.dataset.filter);
  document.getElementById("products").scrollIntoView();
});
// "See Home Care" style links in the story jump to the filtered range
document.querySelectorAll("[data-filter-link]").forEach(a =>
  a.addEventListener("click", () => applyFilter(a.dataset.filterLink)));

/* ----- Product modal ----- */
const modal = document.getElementById("modal");
function openProduct(i) {
  const p = PRODUCTS[i];
  modal.style.setProperty("--c", colour(p.c));
  document.getElementById("modalImg").src = imgPath(p.img);
  document.getElementById("modalImg").alt = `DEKAY ${p.name}`;
  document.getElementById("modalCat").textContent = collectionName(p.c);
  document.getElementById("modalTitle").textContent = p.name;
  document.getElementById("modalDesc").textContent = p.desc;
  document.getElementById("modalWa").href = waLink(`Hello C.M. Detergent, I would like to know more about DEKAY ${p.name}.`);
  modal.showModal();
}
grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (card) openProduct(card.dataset.i);
});
grid.addEventListener("keydown", e => {
  const card = e.target.closest(".card");
  if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProduct(card.dataset.i); }
});
document.getElementById("modalClose").addEventListener("click", () => modal.close());
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

/* ----- Dealer form -> WhatsApp ----- */
document.getElementById("dealerForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const text = [
    "Hello C.M. Detergent, I am interested in becoming a DEKAY dealer.",
    `Name: ${f.get("name")}`,
    f.get("shop") ? `Shop: ${f.get("shop")}` : "",
    `District: ${f.get("district")}`,
  ].filter(Boolean).join("\n");
  window.open(waLink(text), "_blank", "noopener");
});

/* ----- Header + mobile menu ----- */
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("load", onScroll);
onScroll();

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.addEventListener("click", e => { if (e.target.tagName === "A") setMenu(false); });

/* ----- Intro screen ----- */
const loader = document.getElementById("loader");
function finishLoading() {
  if (document.documentElement.classList.contains("is-loaded")) return;
  loader.classList.add("is-done");
  document.documentElement.classList.add("is-loaded");
  setTimeout(() => loader.classList.add("is-gone"), 1300);
}
if (reduceMotion) finishLoading();
else {
  window.addEventListener("load", () => setTimeout(finishLoading, 700));
  setTimeout(finishLoading, 3000); // never block the page on a slow image
}

/* ----- Scroll reveals + number counters ----- */
function countUp(el) {
  const target = +el.dataset.count, suffix = el.dataset.suffix || "";
  if (reduceMotion) return;
  const start = performance.now(), dur = 1600;
  const tick = now => {
    const t = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))).toLocaleString("en-IN") + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    setTimeout(() => { en.target.style.transitionDelay = ""; }, 1400);
    en.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(en.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
  io.observe(el);
});

/* ----- Story: swap the full-screen photo as each step scrolls in ----- */
const storyImgs = document.querySelectorAll("#storyMedia img");
const storySteps = document.querySelectorAll(".story__step");
const storyNum = document.getElementById("storyNum");
const storyBar = document.getElementById("storyBar");
const storyIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const n = +en.target.dataset.step;
    storySteps.forEach(s => s.classList.toggle("is-active", s === en.target));
    storyImgs.forEach((img, i) => img.classList.toggle("is-active", i === n));
    storyNum.textContent = String(n + 1).padStart(2, "0");
    storyBar.style.transform = `scaleY(${(n + 1) / storySteps.length})`;
  });
}, { threshold: 0.55 });
storySteps.forEach(s => storyIO.observe(s));

/* ----- Motion extras (skipped when the user prefers less motion) ----- */
if (!reduceMotion) {
  // Soap bubbles in every .bubbles layer (fewer on phones)
  const small = matchMedia("(max-width: 900px), (pointer: coarse)").matches;
  document.querySelectorAll(".bubbles").forEach(layer => {
    const n = Math.ceil((+layer.dataset.bubbles || 12) * (small ? .4 : 1));
    for (let i = 0; i < n; i++) {
      const b = document.createElement("span");
      const size = 12 + Math.random() * 70;
      b.className = "bubble";
      b.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;` +
        `animation-duration:${11 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s;`;
      layer.appendChild(b);
    }
  });

  // Pause animations in blocks that are off screen
  const animIO = new IntersectionObserver(entries => {
    entries.forEach(en => en.target.classList.toggle("is-offscreen", !en.isIntersecting));
  });
  document.querySelectorAll(".hero, .ribbons, .numbers, .dealer, .footer, .section--navy, #about")
    .forEach(el => animIO.observe(el));

  // Hero image crossfade with product name and dots
  const slides = document.querySelectorAll("#heroSlides img");
  const dots = document.querySelectorAll("#heroDots i");
  const slideName = document.getElementById("slideName");
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
    slideName.classList.add("is-fading");
    setTimeout(() => {
      slideName.textContent = slides[current].alt.replace("DEKAY ", "");
      slideName.classList.remove("is-fading");
    }, 400);
  }, 4200);

  if (finePointer) {
    // Magnetic buttons
    document.querySelectorAll(".btn--gold, .btn--glass").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });

    // 3D tilt on product and collection cards
    document.querySelectorAll(".card, .collection").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });

    // Soft cursor glow
    const glow = document.querySelector(".cursor-glow");
    window.addEventListener("mousemove", e => {
      glow.classList.add("is-on");
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
