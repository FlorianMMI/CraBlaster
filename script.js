const carouselContent = document.getElementById('carousel-content');
const buttons = document.querySelectorAll('#carousel_controls > div');
let currentIndex = 0;
let lightzone = false; // Assuming lightzone is defined somewhere in your code

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        currentIndex = index; // Update the current index
        updateCarousel();
        resetAutoScroll(); // Reset auto-scroll on user interaction
    });
});

function updateCarousel() {
    const offset = currentIndex * -100; // Calculate the offset in percentage
    carouselContent.style.transform = `translateX(${offset}%)`;
    updateButtons();
}

function updateButtons() {
    buttons.forEach((button, index) => {
        if (index === currentIndex) {
            button.classList.add('bg-[#04D2FF]');
            button.classList.remove('bg-white');
        } else {
            button.classList.add('bg-white');
            button.classList.remove('bg-[#04D2FF]');
        }
    });
}

let autoScroll = setInterval(() => {
    currentIndex = (currentIndex + 1) % buttons.length; // Loop to the next item
    updateCarousel();
}, 5000); // Change every 5 seconds

function resetAutoScroll() {
    clearInterval(autoScroll);
    autoScroll = setInterval(() => {
        currentIndex = (currentIndex + 1) % buttons.length; // Loop to the next item
        updateCarousel();
    }, 5000); // Change every 5 seconds
}








        
  








const menuButton = document.getElementById("menu-button");
const sideMenu = document.getElementById("side-menu");

menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("active");
});

const closeButton = document.getElementById("close-button");

closeButton.addEventListener("click", () => {
    sideMenu.classList.remove("active");
});

document.addEventListener("click", (event) => {
    if (!sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
        sideMenu.classList.remove("active");
    }
});



document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100, // Ajuste la valeur pour éviter que la navbar ne cache le titre
                behavior: "smooth"
            });
        }
    });
});