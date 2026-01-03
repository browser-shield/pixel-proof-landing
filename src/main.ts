import './style.css'

// Reveal page after CSS is loaded and parsed (prevents FOUC)
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('loading')
  })
})

// ============================================
// Hero Spotlight Effect (follows mouse)
// ============================================
const heroSpotlight = document.getElementById('hero-spotlight')
const hero = document.querySelector('.hero')

if (heroSpotlight && hero) {
  hero.addEventListener('mousemove', (e: Event) => {
    const mouseEvent = e as MouseEvent
    const rect = (hero as HTMLElement).getBoundingClientRect()
    const x = mouseEvent.clientX - rect.left
    const y = mouseEvent.clientY - rect.top
    heroSpotlight.style.left = `${x}px`
    heroSpotlight.style.top = `${y}px`
    heroSpotlight.style.transform = 'translate(-50%, -50%)'
  })
}

// ============================================
// Parallax Effect for Hero Shapes
// ============================================
const parallaxShapes = document.querySelectorAll('[data-parallax]')
let lastScrollY = 0
let parallaxTicking = false

const updateParallax = () => {
  parallaxShapes.forEach((shape) => {
    const el = shape as HTMLElement
    const speed = parseFloat(el.dataset.parallax || '0')
    const yPos = lastScrollY * speed
    el.style.transform = `translateY(${yPos}px)`
  })
  parallaxTicking = false
}

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY
  if (!parallaxTicking) {
    requestAnimationFrame(updateParallax)
    parallaxTicking = true
  }
}, { passive: true })

// ============================================
// Animated Counters
// ============================================
const counters = document.querySelectorAll('.stat-number[data-count]')
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target as HTMLElement
      const target = parseInt(el.dataset.count || '0', 10)
      const suffix = el.textContent?.replace(/[\d,]/g, '') || ''
      animateCounter(el, target, suffix)
      counterObserver.unobserve(el)
    }
  })
}, { threshold: 0.5 })

counters.forEach(counter => counterObserver.observe(counter))

function animateCounter(el: HTMLElement, target: number, suffix: string) {
  const duration = 2000
  const start = performance.now()
  const startValue = 0

  el.classList.add('counting')

  const update = (currentTime: number) => {
    const elapsed = currentTime - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(startValue + (target - startValue) * eased)

    el.textContent = current.toString() + suffix

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      el.classList.remove('counting')
    }
  }

  requestAnimationFrame(update)
}

// ============================================
// Magnetic Buttons
// ============================================
const magneticButtons = document.querySelectorAll('.btn-magnetic')

magneticButtons.forEach(btn => {
  const el = btn as HTMLElement
  const btnText = el.querySelector('.btn-text') as HTMLElement

  el.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    const pullStrength = 0.2
    el.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`

    if (btnText) {
      btnText.style.transform = `translate(${x * pullStrength * 0.5}px, ${y * pullStrength * 0.5}px)`
    }
  })

  el.addEventListener('mouseleave', () => {
    el.style.transform = ''
    if (btnText) {
      btnText.style.transform = ''
    }
  })
})

// ============================================
// Scroll Progress Bar
// ============================================
const scrollProgress = document.getElementById('scroll-progress')
const updateScrollProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = (scrollTop / docHeight) * 100
  if (scrollProgress) {
    scrollProgress.style.width = `${scrollPercent}%`
  }
}

// ============================================
// Scroll Animations with Intersection Observer
// ============================================
requestAnimationFrame(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-children').forEach(el => {
    observer.observe(el)
  })
})

// ============================================
// Header Scroll Effect
// ============================================
const header = document.querySelector('.header')
let scrollTicking = false

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      header?.classList.toggle('scrolled', window.scrollY > 50)
      updateScrollProgress()
      scrollTicking = false
    })
    scrollTicking = true
  }
}, { passive: true })

// ============================================
// Enhanced Card Tilt Effect
// ============================================
const cards = document.querySelectorAll('.feature-card, .analysis-card, .extension-card, .demo-preview-card')

cards.forEach(card => {
  const el = card as HTMLElement

  el.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 25
    const rotateY = (centerX - x) / 25

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  })

  el.addEventListener('mouseleave', () => {
    el.style.transform = ''
  })
})

// ============================================
// FAQ Accordion + Smooth Scroll
// ============================================
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement

  // FAQ toggle (exclusive - only one open at a time)
  const faqQuestion = target.closest('.faq-question')
  if (faqQuestion) {
    const item = faqQuestion.parentElement
    const isOpen = item?.classList.contains('open')
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'))
    if (!isOpen) item?.classList.add('open')
    return
  }

  // Smooth scroll for anchor links
  const anchor = target.closest('a[href^="#"]')
  if (anchor) {
    const href = anchor.getAttribute('href')
    if (href && href !== '#') {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
})

// ============================================
// PIXEL PROOF UNIQUE: Magnifier Effect
// ============================================
const magnifierZones = document.querySelectorAll('.magnifier-zone')

magnifierZones.forEach(zone => {
  const magnifier = zone.querySelector('.magnifier') as HTMLElement
  if (!magnifier) return

  zone.addEventListener('mousemove', (e: Event) => {
    const mouseEvent = e as MouseEvent
    const rect = (zone as HTMLElement).getBoundingClientRect()
    const x = mouseEvent.clientX - rect.left
    const y = mouseEvent.clientY - rect.top

    magnifier.style.left = `${x}px`
    magnifier.style.top = `${y}px`
  })
})

// ============================================
// PIXEL PROOF UNIQUE: Glitch Effect on Scroll
// ============================================
const glitchElements = document.querySelectorAll('.glitch-text')

const glitchObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target as HTMLElement
      el.classList.add('glitch-active')

      // Trigger glitch animation periodically
      setInterval(() => {
        el.classList.add('glitch-trigger')
        setTimeout(() => el.classList.remove('glitch-trigger'), 200)
      }, 5000)

      glitchObserver.unobserve(el)
    }
  })
}, { threshold: 0.5 })

glitchElements.forEach(el => glitchObserver.observe(el))

// ============================================
// PIXEL PROOF UNIQUE: Scan Line Animation
// ============================================
const scanOverlays = document.querySelectorAll('.scan-overlay')

const scanObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('scanning')
    }
  })
}, { threshold: 0.3 })

scanOverlays.forEach(overlay => scanObserver.observe(overlay))

// ============================================
// PIXEL PROOF UNIQUE: RGB Shift on Mouse Movement
// ============================================
const rgbShiftElements = document.querySelectorAll('.rgb-shift')

rgbShiftElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    (el as HTMLElement).style.animation = 'rgb-shift 0.2s ease-in-out'
  })

  el.addEventListener('animationend', () => {
    (el as HTMLElement).style.animation = ''
  })
})
