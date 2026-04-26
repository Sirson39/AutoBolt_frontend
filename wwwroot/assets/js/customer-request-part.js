(() => {
    const form = document.getElementById("partRequestForm");
    const urgency = document.getElementById("urgency");
    const quantity = document.getElementById("quantity");
    const leadTime = document.getElementById("leadTime");
    const shipping = document.getElementById("shipping");
    const priorityTag = document.getElementById("priorityTag");
    const requestMessage = document.getElementById("requestMessage");

    if (!form || !urgency || !quantity) {
        return;
    }

    const updateInsight = () => {
        const qty = Number(quantity.value || 0);
        const urgent = urgency.value === "priority";
        const shipAmount = urgent ? 650 : 300;

        leadTime.textContent = urgent ? "1-2 business days" : "3-5 business days";
        shipping.textContent = `Rs ${Math.max(1, qty) * shipAmount}`;
        priorityTag.textContent = urgent ? "Priority" : "Standard";
    };

    urgency.addEventListener("change", updateInsight);
    quantity.addEventListener("input", updateInsight);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            requestMessage.textContent = "Please complete all required fields with valid information.";
            requestMessage.className = "message error";
            form.reportValidity();
            return;
        }

        requestMessage.textContent = "Request submitted. We will notify you once the part arrives.";
        requestMessage.className = "message ok";
    });

    form.addEventListener("reset", () => {
        window.setTimeout(() => {
            requestMessage.textContent = "";
            requestMessage.className = "message";
            updateInsight();
        }, 0);
    });

    updateInsight();
})();