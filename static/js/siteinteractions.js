document.addEventListener('DOMContentLoaded', function () {
    // Animate process steps when visible
    const steps = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
  
    steps.forEach(step => {
      observer.observe(step);
    });
  
    // FAQ accordion logic
    const triggers = document.querySelectorAll('.accordion-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', function () {
        const targetId = this.getAttribute('data-accordion-target');
        const content = document.getElementById(targetId);
  
        // Close others
        document.querySelectorAll('.accordion-content').forEach(item => {
          if (item !== content) item.classList.add('hidden');
        });
  
        // Toggle clicked one
        content.classList.toggle('hidden');
      });
    });
  
    // Footer fade-in animation (optional)
    const footer = document.getElementById('site-footer');
    if (footer) {
      const footerObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            footer.classList.add('footer-visible');
            footerObserver.unobserve(footer);
          }
        });
      }, { threshold: 0.1 });
  
      footerObserver.observe(footer);
    }
  });
  