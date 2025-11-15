// Указываем базовый URL для бекенда
const API_URL = 'http://localhost:8000';

// Функция для отправки POST-запроса при клике на первую кнопку
// БУДЕМ МЕНЯТЬ, ЭТО ВСЕ ЩАС ДЛЯ ТЕСТА
//document.getElementById("clickButton").addEventListener("click", async function() {
//    try {
//        const response = await fetch(`${API_URL}/api/submit`, {
//            method: "POST",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify({
//                action: "button_click",
//                timestamp: new Date().toISOString(),
//                message: "Кнопка нажата!"
//            })
//        });
//
//        if (!response.ok) throw new Error(`HTTP ошибка! статус: ${response.status}`);
//
//        const result = await response.json();
//        console.log("Ответ от сервера:", result);
//        alert("Кнопка работает! Смотри в консоли или на бекенде.");
//    } catch (error) {
//        console.error("Ошибка:", error);
//        alert("Ошибка отправки запроса. Посмотри консоль для деталей.");
//    }
//});
//
//// Переключение видимости первой кнопки при нажатии второй
//document.getElementById("toggleButton").addEventListener("click", function() {
//    const clickBtn = document.getElementById("clickButton");
//    if (clickBtn.style.display === "none") {
//        clickBtn.style.display = "inline-block"; // показываем кнопку
//        this.textContent = "Hide"; // меняем текст второй кнопки
//    } else {
//        clickBtn.style.display = "none"; // скрываем кнопку
//        this.textContent = "Show"; // меняем текст второй кнопки
//    }
//});

const carousel = document.getElementById('carousel');
        const prevBtn = document.querySelector('.carousel-control.prev');
        const nextBtn = document.querySelector('.carousel-control.next');

        const itemsPerRow = 10; // fallback original count per row (unused if DOM gives unit)

        function getMetrics() {
            const item = carousel.querySelector('.category-btn');
            const style = getComputedStyle(carousel);
            const gap = parseFloat(style.columnGap) || parseFloat(style.gap) || 12;
            const itemW = item ? item.offsetWidth : 120;
            return { itemW: itemW, gap: gap, step: itemW + gap };
        }

        // Prepend cloned set so structure is: [clone][originals][clone]
        (function prependClones() {
            const nodes = Array.from(carousel.querySelectorAll('.category-btn'));
            const originals = nodes.slice(0, itemsPerRow);
            // insert in reverse order so the original sequence is preserved
            for (let i = originals.length - 1; i >= 0; i--) {
                const c = originals[i].cloneNode(true);
                carousel.insertBefore(c, carousel.firstChild);
            }
        })();

        // Determine repeating unit length from DOM.
        // If carousel was built as [clone][original][clone], total buttons should be divisible by 3.
        function computeUnitColumns() {
            const btns = Array.from(carousel.querySelectorAll('.category-btn'));
            const totalBtns = btns.length;
            let unitLen = Math.floor(totalBtns / 3);
            if (unitLen < 1) unitLen = Math.floor(totalBtns / 2);
            // columns = items per column (2 rows per column)
            const columns = Math.ceil(unitLen / 2);
            return { totalBtns, unitLen, columns };
        }

        function totalScrollWidth() {
            const m = getMetrics();
            const cols = computeUnitColumns().columns;
            return m.step * cols;
        }

        // Start in the middle (beginning of original set)
        window.requestAnimationFrame(() => {
            carousel.style.scrollBehavior = 'auto';
            carousel.scrollLeft = totalScrollWidth();
            carousel.style.scrollBehavior = 'smooth';
        });

        // Invisible wrap: when reaching the trailing clone or leading clone, jump back
        function handleWrap() {
            const total = totalScrollWidth();
            if (carousel.scrollLeft >= total * 2 - 1) {
                // subtract one total to jump into equivalent position inside originals
                carousel.style.scrollBehavior = 'auto';
                carousel.scrollLeft = carousel.scrollLeft - total;
                carousel.style.scrollBehavior = 'smooth';
            } else if (carousel.scrollLeft <= 0) {
                carousel.style.scrollBehavior = 'auto';
                carousel.scrollLeft = carousel.scrollLeft + total;
                carousel.style.scrollBehavior = 'smooth';
            }
        }

        carousel.addEventListener('scroll', () => {
            if (!carousel._ticking) {
                window.requestAnimationFrame(() => {
                    handleWrap();
                    carousel._ticking = false;
                });
                carousel._ticking = true;
            }
        });

        // Scroll by columns (2 columns per click)
        function scrollColumns(countColumns) {
            const m = getMetrics();
            carousel.scrollBy({ left: m.step * countColumns, behavior: 'smooth' });
        }

        nextBtn.addEventListener('click', () => scrollColumns(2));
        prevBtn.addEventListener('click', () => scrollColumns(-2));

        // Content carousel - seamless infinite scroll (based on categories carousel logic)
        const contentCarousel = document.getElementById('contentCarousel');
        if (contentCarousel) {
            const images = contentCarousel.querySelectorAll('.carousel-image');
            const originalCount = 5; // First 5 are originals

            // Create structure: [clone][originals][clone]
            (function setupClones() {
                const originals = Array.from(images).slice(0, originalCount);
                // Prepend clones in reverse order
                for (let i = originals.length - 1; i >= 0; i--) {
                    const c = originals[i].cloneNode(true);
                    contentCarousel.insertBefore(c, contentCarousel.firstChild);
                }
                // Append clones at the end
                originals.forEach(img => {
                    const c = img.cloneNode(true);
                    contentCarousel.appendChild(c);
                });
            })();

            function getContentMetrics() {
                const img = contentCarousel.querySelector('.carousel-image');
                const style = getComputedStyle(contentCarousel);
                const gap = parseFloat(style.gap) || 6;
                const imgW = img ? img.offsetWidth : 0;
                return { imgW: imgW, gap: gap, step: imgW + gap };
            }

            function getContentScrollWidth() {
                const m = getContentMetrics();
                return m.step * originalCount;
            }

            // Start in the middle (beginning of original set)
            window.requestAnimationFrame(() => {
                const total = getContentScrollWidth();
                contentCarousel.style.scrollBehavior = 'auto';
                contentCarousel.scrollLeft = total;
                contentCarousel.style.scrollBehavior = 'smooth';
            });

            // Invisible wrap: when reaching the trailing clone or leading clone, jump back
            function handleContentWrap() {
                const total = getContentScrollWidth();
                if (contentCarousel.scrollLeft >= total * 2 - 1) {
                    contentCarousel.style.scrollBehavior = 'auto';
                    contentCarousel.scrollLeft = contentCarousel.scrollLeft - total;
                    contentCarousel.style.scrollBehavior = 'smooth';
                } else if (contentCarousel.scrollLeft <= 0) {
                    contentCarousel.style.scrollBehavior = 'auto';
                    contentCarousel.scrollLeft = contentCarousel.scrollLeft + total;
                    contentCarousel.style.scrollBehavior = 'smooth';
                }
            }

            contentCarousel.addEventListener('scroll', () => {
                if (!contentCarousel._ticking) {
                    window.requestAnimationFrame(() => {
                        handleContentWrap();
                        contentCarousel._ticking = false;
                    });
                    contentCarousel._ticking = true;
                }
            });
        }

        // Image Modal functionality
        const imageModal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalClose = document.getElementById('modalClose');
        const modalPrev = document.getElementById('modalPrev');
        const modalNext = document.getElementById('modalNext');

        let currentImageIndex = 0;
        let originalImages = [];

        // Get original images (middle 5, excluding clones at beginning and end)
        function getOriginalImages() {
            const carousel = document.getElementById('contentCarousel');
            if (carousel) {
                const allImages = carousel.querySelectorAll('.carousel-image');
                // After cloning, structure is: [5 clones][5 originals][5 clones]
                // So originals are at indices 5-9
                originalImages = Array.from(allImages).slice(5, 10).map(img => img.src);
            }
        }

        // Initialize original images list after carousel setup
        setTimeout(() => {
            getOriginalImages();
        }, 100);

        // Open modal with specific image
        function openModal(index) {
            if (originalImages.length === 0) return;
            currentImageIndex = index;
            modalImage.src = originalImages[currentImageIndex];
            imageModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        // Close modal
        function closeModal() {
            imageModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Show next image
        function showNext() {
            if (originalImages.length === 0) return;
            currentImageIndex = (currentImageIndex + 1) % originalImages.length;
            modalImage.src = originalImages[currentImageIndex];
        }

        // Show previous image
        function showPrev() {
            if (originalImages.length === 0) return;
            currentImageIndex = (currentImageIndex - 1 + originalImages.length) % originalImages.length;
            modalImage.src = originalImages[currentImageIndex];
        }

        // Add click handlers to carousel images
        const carouselForModal = document.getElementById('contentCarousel');
        if (carouselForModal) {
            carouselForModal.addEventListener('click', (e) => {
                const img = e.target.closest('.carousel-image');
                if (img) {
                    // Find which original image was clicked
                    const allImages = Array.from(carouselForModal.querySelectorAll('.carousel-image'));
                    const clickedIndex = allImages.indexOf(img);
                    // After cloning: [5 clones][5 originals][5 clones]
                    // Originals are at indices 5-9
                    let originalIndex;
                    if (clickedIndex >= 5 && clickedIndex < 10) {
                        originalIndex = clickedIndex - 5;
                    } else if (clickedIndex < 5) {
                        // Clicked on clone at beginning, map to corresponding original
                        originalIndex = clickedIndex;
                    } else {
                        // Clicked on clone at end, map to corresponding original
                        originalIndex = (clickedIndex - 10) % 5;
                    }
                    openModal(originalIndex);
                }
            });
        }

        // Modal controls
        modalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });

        modalNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });

        modalPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });

        // Close on background click
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!imageModal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowRight') {
                showNext();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            }
        });