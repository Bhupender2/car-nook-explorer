
// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Set min date for datepickers to today
    const today = new Date().toISOString().split('T')[0];
    const pickupDateInputs = document.querySelectorAll('input[type="date"][id^="pickup-date"]');
    pickupDateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
    
    const returnDateInputs = document.querySelectorAll('input[type="date"][id^="return-date"]');
    returnDateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
    
    // Handle pickup date change
    pickupDateInputs.forEach(input => {
        input.addEventListener('change', function() {
            const formId = this.closest('form').id;
            const returnDateInput = document.getElementById(formId === 'search-form' ? 'return-date' : 'return-date');
            
            if (returnDateInput) {
                returnDateInput.setAttribute('min', this.value);
                
                // If return date is before new pickup date, update it
                if (returnDateInput.value && returnDateInput.value < this.value) {
                    returnDateInput.value = this.value;
                }
                
                // Trigger change event on return date to update calculations if needed
                const event = new Event('change');
                returnDateInput.dispatchEvent(event);
            }
        });
    });
    
    // Handle form submission
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pickupLocation = document.getElementById('pickup-location').value;
            const pickupDate = document.getElementById('pickup-date').value;
            const returnDate = document.getElementById('return-date').value;
            
            // Validate form
            if (!pickupDate) {
                alert('Please select a pickup date');
                return;
            }
            
            if (!returnDate) {
                alert('Please select a return date');
                return;
            }
            
            // Redirect to cars page with search parameters
            window.location.href = `cars.html?pickup=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`;
        });
    }
    
    // Handle booking form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, we would process the booking here
            alert('Thank you for your booking! Your reservation has been confirmed.');
            
            // Optionally redirect to a confirmation page
            // window.location.href = 'booking-confirmation.html';
        });
    }
    
    // Handle header style on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            // In a real implementation, we would toggle a mobile menu
            alert('Mobile menu would open here');
            // You could implement a mobile menu like this:
            // document.querySelector('.mobile-menu').classList.toggle('active');
        });
    }
    
    // Add animation on scroll for elements with animation classes
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .testimonial-card, .car-card, .value-card, .team-card, .timeline-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state for animated elements
    document.querySelectorAll('.feature-card, .testimonial-card, .car-card, .value-card, .team-card, .timeline-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation check on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Parse URL parameters
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        
        return params;
    }
    
    // Apply URL parameters to car search if on cars page
    const carsPage = document.querySelector('.cars-page');
    if (carsPage) {
        const params = getUrlParams();
        
        // Fill in filter form with params if they exist
        if (params.pickup) {
            const pickupLocationSelect = document.getElementById('pickup-location');
            if (pickupLocationSelect) {
                for (let i = 0; i < pickupLocationSelect.options.length; i++) {
                    if (pickupLocationSelect.options[i].text.toLowerCase() === params.pickup.toLowerCase()) {
                        pickupLocationSelect.selectedIndex = i;
                        break;
                    }
                }
            }
        }
        
        // Add a banner showing the search parameters
        if (params.pickupDate && params.returnDate) {
            const searchBanner = document.createElement('div');
            searchBanner.className = 'search-banner';
            searchBanner.innerHTML = `
                <div class="container">
                    <p>
                        <strong>Your Search:</strong> 
                        Pick-up: ${params.pickup || 'Any Location'} | 
                        From: ${new Date(params.pickupDate).toLocaleDateString()} | 
                        To: ${new Date(params.returnDate).toLocaleDateString()}
                    </p>
                </div>
            `;
            
            // Insert the banner at the top of the cars page
            carsPage.insertBefore(searchBanner, carsPage.firstChild);
        }
    }
    
    // Handle filter functionality on cars page
    const filterForm = document.getElementById('filter-form');
    const carCards = document.querySelectorAll('.car-card');
    
    if (filterForm && carCards.length > 0) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const typeFilter = document.getElementById('car-type').value;
            const brandFilter = document.getElementById('brand').value;
            const priceFilter = document.getElementById('price-range').value;
            
            let visibleCount = 0;
            
            carCards.forEach(card => {
                let showCard = true;
                
                // Filter by type
                if (typeFilter && card.getAttribute('data-type') !== typeFilter) {
                    showCard = false;
                }
                
                // Filter by brand
                if (brandFilter && card.getAttribute('data-brand') !== brandFilter) {
                    showCard = false;
                }
                
                // Filter by price range
                if (priceFilter) {
                    const price = parseInt(card.getAttribute('data-price'));
                    
                    if (priceFilter === '0-100' && (price < 0 || price > 100)) {
                        showCard = false;
                    } else if (priceFilter === '100-200' && (price < 100 || price > 200)) {
                        showCard = false;
                    } else if (priceFilter === '200-300' && (price < 200 || price > 300)) {
                        showCard = false;
                    } else if (priceFilter === '300+' && price < 300) {
                        showCard = false;
                    }
                }
                
                // Show or hide card
                if (showCard) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show a message if no cars match the filters
            const noResultsMessage = document.querySelector('.no-results-message');
            if (visibleCount === 0) {
                if (!noResultsMessage) {
                    const message = document.createElement('div');
                    message.className = 'no-results-message';
                    message.innerHTML = `
                        <div class="container">
                            <p>No cars match your current filters. Please try different criteria.</p>
                        </div>
                    `;
                    carsPage.appendChild(message);
                }
            } else if (noResultsMessage) {
                noResultsMessage.remove();
            }
        });
    }
    
    // Handle car details image gallery
    const mainImage = document.getElementById('main-car-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image
                mainImage.src = this.getAttribute('data-img');
                
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Handle car booking calculator
    const pickupDateCalc = document.getElementById('pickup-date');
    const returnDateCalc = document.getElementById('return-date');
    const daysCountElement = document.getElementById('days-count');
    const addonsTotalElement = document.getElementById('addons-total');
    const taxesFeesElement = document.getElementById('taxes-fees');
    const rentalTotalElement = document.getElementById('rental-total');
    const extrasSelect = document.getElementById('extras');
    
    function calculateRental() {
        if (pickupDateCalc && returnDateCalc && pickupDateCalc.value && returnDateCalc.value) {
            const pickupDate = new Date(pickupDateCalc.value);
            const returnDate = new Date(returnDateCalc.value);
            
            // Calculate days difference
            const timeDiff = returnDate.getTime() - pickupDate.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (daysDiff >= 0 && daysCountElement) {
                // Update days count
                daysCountElement.textContent = daysDiff;
                
                // Calculate base price (using the current car's price)
                let basePrice = 110 * daysDiff; // Default price for Tesla Model 3
                
                // Apply discount for 7+ days
                if (daysDiff >= 7) {
                    basePrice = basePrice * 0.9; // 10% discount
                }
                
                // Calculate addon price
                let addonPrice = 0;
                if (extrasSelect && extrasSelect.value) {
                    if (extrasSelect.value === 'gps') {
                        addonPrice = 5 * daysDiff;
                    } else if (extrasSelect.value === 'child-seat') {
                        addonPrice = 10 * daysDiff;
                    } else if (extrasSelect.value === 'additional-driver') {
                        addonPrice = 15 * daysDiff;
                    }
                }
                
                // Calculate taxes (assumed 10%)
                const taxesFees = (basePrice + addonPrice) * 0.1;
                
                // Update display elements
                if (addonsTotalElement) addonsTotalElement.textContent = '$' + addonPrice.toFixed(2);
                if (taxesFeesElement) taxesFeesElement.textContent = '$' + taxesFees.toFixed(2);
                if (rentalTotalElement) rentalTotalElement.textContent = '$' + (basePrice + addonPrice + taxesFees).toFixed(2);
            }
        }
    }
    
    // Attach rental calculator events
    if (pickupDateCalc && returnDateCalc) {
        pickupDateCalc.addEventListener('change', calculateRental);
        returnDateCalc.addEventListener('change', calculateRental);
        if (extrasSelect) extrasSelect.addEventListener('change', calculateRental);
    }
    
    // Handle pagination (for demonstration)
    const paginationItems = document.querySelectorAll('.pagination-item');
    
    if (paginationItems.length > 0) {
        paginationItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all items
                paginationItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // In a real implementation, this would load the next page of cars
                // Scroll to top for demonstration
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }
    
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would send this data to a server
            // For demonstration, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});
