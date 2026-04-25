(() => {
    const yearNode = document.getElementById("year");
    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }

    const counters = document.querySelectorAll(".stat-value[data-target]");
    const animateCounter = (node) => {
        const target = Number(node.getAttribute("data-target")) || 0;
        const durationMs = 900;
        const start = performance.now();

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / durationMs, 1);
            node.textContent = String(Math.floor(progress * target));
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.45
        }
    );

    counters.forEach((counter) => observer.observe(counter));
})();