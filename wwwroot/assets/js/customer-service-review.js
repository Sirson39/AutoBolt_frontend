(() => {
    const form = document.getElementById("reviewForm");
    const starGroup = document.getElementById("starGroup");
    const scoreValue = document.getElementById("scoreValue");
    const scoreCaption = document.getElementById("scoreCaption");
    const followup = document.getElementById("followup");
    const bonus = document.getElementById("bonus");
    const reviewMessage = document.getElementById("reviewMessage");

    if (!form || !starGroup) {
        return;
    }

    let rating = 0;

    const updateSnapshot = () => {
        scoreValue.textContent = rating ? `${rating.toFixed(1)}` : "0.0";

        if (rating >= 4) {
            scoreCaption.textContent = "Excellent feedback";
            followup.textContent = "No follow-up needed";
            bonus.textContent = "60";
            return;
        }

        if (rating >= 3) {
            scoreCaption.textContent = "Good with minor issues";
            followup.textContent = "Quality check in 2 days";
            bonus.textContent = "40";
            return;
        }

        if (rating > 0) {
            scoreCaption.textContent = "Needs improvement";
            followup.textContent = "Manager callback within 24h";
            bonus.textContent = "20";
            return;
        }

        scoreCaption.textContent = "No rating selected";
        followup.textContent = "Pending review";
        bonus.textContent = "0";
    };

    const setActiveStars = () => {
        starGroup.querySelectorAll("button").forEach((button, index) => {
            const active = index < rating;
            button.classList.toggle("active", active);
            button.setAttribute("aria-checked", active ? "true" : "false");
        });
    };

    for (let i = 1; i <= 5; i += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "star-btn";
        button.setAttribute("role", "radio");
        button.setAttribute("aria-label", `${i} star`);
        button.textContent = "★";

        button.addEventListener("click", () => {
            rating = i;
            setActiveStars();
            updateSnapshot();
        });

        starGroup.appendChild(button);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity() || rating === 0) {
            reviewMessage.textContent = "Please complete all fields and select a star rating.";
            reviewMessage.className = "message error";
            if (!form.checkValidity()) {
                form.reportValidity();
            }
            return;
        }

        reviewMessage.textContent = "Thank you. Your service review has been submitted successfully.";
        reviewMessage.className = "message ok";
    });

    form.addEventListener("reset", () => {
        window.setTimeout(() => {
            rating = 0;
            setActiveStars();
            updateSnapshot();
            reviewMessage.textContent = "";
            reviewMessage.className = "message";
        }, 0);
    });

    updateSnapshot();
})();