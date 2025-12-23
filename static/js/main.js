/* ============================================================================
   Cubase Macros Hub - Main JavaScript
   ============================================================================ */

(function() {
    'use strict';

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initTooltips();
        initAlerts();
        initSmoothScroll();
        initFormValidation();
        updateCartBadge();
    });

    /* ========================================================================
       Tooltip Initialization
       ======================================================================== */
    function initTooltips() {
        // Initialize Bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }

    /* ========================================================================
       Auto-dismiss Alerts
       ======================================================================== */
    function initAlerts() {
        // Auto-dismiss alerts after 5 seconds
        var alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
        alerts.forEach(function(alert) {
            setTimeout(function() {
                if (typeof bootstrap !== 'undefined' && bootstrap.Alert) {
                    var bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                } else {
                    alert.style.transition = 'opacity 0.5s';
                    alert.style.opacity = '0';
                    setTimeout(function() {
                        alert.remove();
                    }, 500);
                }
            }, 5000);
        });
    }

    /* ========================================================================
       Smooth Scroll for Anchor Links
       ======================================================================== */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                if (href === '#' || href === '#!') {
                    return;
                }
                
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    var offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* ========================================================================
       Form Validation Enhancement
       ======================================================================== */
    function initFormValidation() {
        // Add Bootstrap validation classes on form submit
        var forms = document.querySelectorAll('.needs-validation');
        forms.forEach(function(form) {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });

        // Real-time validation feedback
        var inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });
    }

    /* ========================================================================
       Cart Badge Update
       ======================================================================== */
    function updateCartBadge() {
        var cartBadges = document.querySelectorAll('#nav-cart-badge, #cart-badge');
        cartBadges.forEach(function(badge) {
            var count = parseInt(badge.textContent) || 0;
            if (count > 0) {
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        });
    }

    /* ========================================================================
       Utility Functions
       ======================================================================== */

    // Debounce function for performance
    window.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // Show loading spinner
    window.showLoading = function(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        }
    };

    // Hide loading spinner
    window.hideLoading = function(element, originalContent) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element && originalContent) {
            element.innerHTML = originalContent;
        }
    };

    // AJAX helper function
    window.ajaxRequest = function(url, options) {
        options = options || {};
        var method = options.method || 'GET';
        var data = options.data || null;
        var onSuccess = options.onSuccess || function() {};
        var onError = options.onError || function() {};
        var headers = options.headers || {};

        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        // Set headers
        if (method === 'POST' || method === 'PUT') {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        }

        Object.keys(headers).forEach(function(key) {
            xhr.setRequestHeader(key, headers[key]);
        });

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    onSuccess(response, xhr);
                } catch (e) {
                    onSuccess(xhr.responseText, xhr);
                }
            } else {
                onError(xhr);
            }
        };

        xhr.onerror = function() {
            onError(xhr);
        };

        xhr.send(data ? JSON.stringify(data) : null);
    };

    // Get CSRF token from cookies
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Fade in elements on scroll
    if ('IntersectionObserver' in window) {
        var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.card, section').forEach(function(el) {
            observer.observe(el);
        });
    }

})();

