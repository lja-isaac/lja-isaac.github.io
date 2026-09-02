const form = document.getElementById('form-ContactMe');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "3e234830-252d-4ed7-8c15-cf7fe8ddceb9");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        // const response = await fetch("https://api.web3forms.com/submit", {
        //     method: "POST",
        //     body: formData
        // });

        // const data = await response.json();
        const data = {
            message: "test error"
        }

        // if (response.ok) {
        if (true) {
            ToastExt.showToast({ message: "Thanks for reaching out! Your message has been sent successfully. I'll review it and get back to you as soon as possible.", variant: 'success' });
            // form.reset();
        } else {
            ToastExt.showToast({ message: `Your message couldn't be sent. ${data.message}`, variant: 'danger' });
        }

    } catch (error) {
        ToastExt.showToast({ message: "Something went wrong while sending your message. Please try again, or reach out to me directly by email.", variant: 'danger' });
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});