const products = [
  {
    id: "insta360-x4-bekas",
    category: "hobi-koleksi",
    name: "Insta360 X4 (Second)",
    store: "Lokasi: Tanjung Barat, Jakarta Selatan",
    desc: `Pemakaian 2 bulan, pembelian 12 April 2025.
Garansi sampai 12 April 2026.

Kelengkapan:
- Insta360 x4 + Dus
- Double charger Kingma
- 3 Baterai (1 ORI, 2 Kingma)
- Invisible Stick 2.5m & 1.5m
- Tripod Handle 2in1
- Aksesoris lengkap (silicon, lens guard, tas)
- Memori Sandisk 512GB & Vivan 64GB`,
    price: "Rp 7.500.000",
    images: [
      "assets/1kameraInsta360X4.jpeg",
      "assets/2kameraInsta360X4.jpeg",
      "assets/3kameraInsta360X4.jpeg",
      "assets/kameraInsta360X4.jpeg",
    ],
    whatsappNumber: "6289528830675",
  },
];

let currentSlideIndex = 0;
let currentProduct = null;

function displayProducts(productsToDisplay) {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  if (productsToDisplay.length === 0) {
    container.innerHTML = "<p>Tidak ada produk ditemukan.</p>";
    return;
  }

  productsToDisplay.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    const shareIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path></svg>`;

    card.innerHTML = `
            <button class="share-btn" title="Salin Link Produk" onclick="shareProduct(event, '${product.id}', this)">
                ${shareIconSVG}
            </button>
            <div class="card-clickable-area" onclick="openPopup('${product.id}')">
              <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
              <div class="info">
                <h4>${product.name}</h4>
                <p>${product.price}</p>
              </div>
            </div>
          `;
    container.appendChild(card);
  });
}

function shareProduct(event, productId, buttonElement) {
  event.stopPropagation(); // Mencegah popup terbuka saat klik share
  const url = `${window.location.origin}${window.location.pathname}?product=${productId}`;

  navigator.clipboard.writeText(url).then(
    () => {
      // Beri feedback visual ke pengguna
      const originalContent = buttonElement.innerHTML;
      buttonElement.innerHTML = `&#10003;`; // Tanda centang
      buttonElement.classList.add("success");

      setTimeout(() => {
        buttonElement.innerHTML = originalContent;
        buttonElement.classList.remove("success");
      }, 2000); // Kembali normal setelah 2 detik
    },
    (err) => {
      console.error("Gagal menyalin link: ", err);
      alert("Gagal menyalin link.");
    }
  );
}

function showSlide(index) {
  const popup = document.getElementById("popup");
  const slider = popup.querySelector(".image-slider");
  if (!slider) return;

  const images = slider.querySelectorAll("img");
  const dotsContainer = popup.querySelector(".slider-dots");

  if (index >= images.length) currentSlideIndex = 0;
  else if (index < 0) currentSlideIndex = images.length - 1;
  else currentSlideIndex = index;

  images.forEach(
    (img, i) => (img.style.opacity = i === currentSlideIndex ? "1" : "0")
  );
  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === currentSlideIndex)
    );
  }
}

function openPopup(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  currentProduct = product;
  const popup = document.getElementById("popup");
  popup.innerHTML = ""; // Hapus konten lama

  const popupContent = document.createElement("div");
  popupContent.className = "popup-content";

  let sliderHTML = `<div class="image-slider-container">
                            <div class="image-slider">`;
  product.images.forEach((imgSrc) => {
    sliderHTML += `<img src="${imgSrc}" alt="${product.name}">`;
  });
  sliderHTML += `</div>`;

  if (product.images.length > 1) {
    sliderHTML += `<div class="slider-nav">
                              <button class="prev" onclick="showSlide(currentSlideIndex - 1)">&#10094;</button>
                              <button class="next" onclick="showSlide(currentSlideIndex + 1)">&#10095;</button>
                           </div>
                           <div class="slider-dots">`;
    product.images.forEach((_, i) => {
      sliderHTML += `<span class="dot" onclick="showSlide(${i})"></span>`;
    });
    sliderHTML += `</div>`;
  }
  sliderHTML += `</div>`;

  const message = encodeURIComponent(
    `Halo, saya tertarik dengan produk "${product.name}". Apakah masih tersedia?`
  );
  const whatsappLink = `https://wa.me/${product.whatsappNumber}?text=${message}`;

  const detailsHTML = `<div class="details">
                                <h2 id="popupName">${product.name}</h2>
                                <p id="popupStore">${product.store}</p>
                                <p id="popupDesc">${product.desc}</p>
                                <span id="popupPrice">${product.price}</span>
                                <a href="${whatsappLink}" target="_blank" class="whatsapp-btn">
                                  Hubungi Penjual via WhatsApp
                                </a>
                             </div>`;

  popupContent.innerHTML =
    `<span class="close-btn-inside" onclick="closePopup()">&times;</span>` +
    sliderHTML +
    detailsHTML;
  popup.appendChild(popupContent);

  popup.style.display = "flex";

  // Update URL tanpa reload halaman
  const newUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
  window.history.pushState({ path: newUrl }, "", newUrl);

  currentSlideIndex = 0;
  showSlide(currentSlideIndex);

  document.addEventListener("keydown", handleKeydown);
}

function handleKeydown(e) {
  if (!currentProduct) return;
  if (e.key === "Escape") closePopup();
  if (currentProduct.images.length > 1) {
    if (e.key === "ArrowRight") showSlide(currentSlideIndex + 1);
    else if (e.key === "ArrowLeft") showSlide(currentSlideIndex - 1);
  }
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";
  popup.innerHTML = "";

  // Kembalikan URL ke state semula
  const originalUrl = `${window.location.origin}${window.location.pathname}`;
  window.history.pushState({ path: originalUrl }, "", originalUrl);

  document.removeEventListener("keydown", handleKeydown);
  currentProduct = null;
}

function toggleTheme() {
  const htmlEl = document.documentElement;
  const currentTheme = htmlEl.getAttribute("data-theme");
  if (currentTheme === "dark") {
    htmlEl.removeAttribute("data-theme");
    document.querySelector(".theme-toggle").textContent = "Mode Gelap";
  } else {
    htmlEl.setAttribute("data-theme", "dark");
    document.querySelector(".theme-toggle").textContent = "Mode Terang";
  }
}

function filterAndDisplay() {
  const category = document.getElementById("category").value;
  const keyword = document.getElementById("search").value.toLowerCase();

  const filtered = products.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (p.name.toLowerCase().includes(keyword) ||
        p.desc.toLowerCase().includes(keyword))
  );
  displayProducts(filtered);
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("category")
    .addEventListener("change", filterAndDisplay);
  document.getElementById("search").addEventListener("input", filterAndDisplay);

  // Cek apakah ada parameter produk di URL saat load
  const urlParams = new URLSearchParams(window.location.search);
  const productIdFromUrl = urlParams.get("product");

  if (productIdFromUrl) {
    const productExists = products.some((p) => p.id === productIdFromUrl);
    if (productExists) {
      openPopup(productIdFromUrl);
    } else {
      // Jika produk tidak ditemukan, tampilkan semua
      filterAndDisplay();
    }
  } else {
    // Tampilkan semua produk jika tidak ada parameter
    filterAndDisplay();
  }
});
