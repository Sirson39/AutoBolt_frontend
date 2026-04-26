(() => {
    const form = document.getElementById("appointmentForm");
    const dateInput = document.getElementById("appointmentDate");
    const serviceType = document.getElementById("serviceType");
    const estimatedCostNode = document.getElementById("estimatedCost");
    const loyaltyDiscountNode = document.getElementById("loyaltyDiscount");
    const netAmountNode = document.getElementById("netAmount");
    const slotInfoNode = document.getElementById("slotInfo");
    const formMessage = document.getElementById("formMessage");

    if (!form || !dateInput || !serviceType) {
        return;
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`;

    const renderSummary = () => {
        const selected = serviceType.options[serviceType.selectedIndex];
        const basePrice = Number(selected?.dataset.price || 0);
        const discountRate = basePrice > 5000 ? 0.1 : 0;
        const discount = Math.round(basePrice * discountRate);
        const net = basePrice - discount;

        estimatedCostNode.textContent = formatCurrency(basePrice);
        loyaltyDiscountNode.textContent = discount > 0 ? `${formatCurrency(discount)} (10%)` : "Not Eligible";
        netAmountNode.textContent = formatCurrency(net);
    };

    const updateSlotInfo = () => {
        const selectedDate = dateInput.value;
        if (!selectedDate) {
            slotInfoNode.textContent = "Select a date to view available slots.";
            return;
        }

        const day = new Date(selectedDate).getDay();
        if (day === 0) {
            slotInfoNode.textContent = "Sunday is limited: only 2 slots available.";
            return;
        }

        if (day === 6) {
            slotInfoNode.textContent = "Saturday rush: 4 slots left.";
            return;
        }

        slotInfoNode.textContent = "Weekday availability is good: 7+ slots open.";
    };

    serviceType.addEventListener("change", renderSummary);
    dateInput.addEventListener("change", updateSlotInfo);

    form.addEventListener("reset", () => {
        window.setTimeout(() => {
            renderSummary();
            updateSlotInfo();
            formMessage.textContent = "";
            formMessage.className = "form-message";
        }, 0);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            formMessage.textContent = "Please fill all required fields correctly before confirming.";
            formMessage.className = "form-message err";
            form.reportValidity();
            return;
        }

        formMessage.textContent = "Appointment submitted successfully. Our team will confirm shortly.";
        formMessage.className = "form-message ok";
    });

    renderSummary();
    updateSlotInfo();
})();