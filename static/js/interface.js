document.addEventListener('DOMContentLoaded', () => {
    // File upload handling
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name || 'No file selected';
            const label = document.createElement('div');
            label.textContent = `Selected: ${fileName}`;
            label.className = 'file-label';
            
            const existingLabel = document.querySelector('.file-label');
            if (existingLabel) {
                existingLabel.remove();
            }
            
            fileInput.parentNode.appendChild(label);
        });
    }

    // Professional alert message
    window.showAlert = (message) => {
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = 'alert-message';
        alert.textContent = message;
        document.body.appendChild(alert);

        // Trigger reflow for animation
        alert.offsetHeight;
        alert.classList.add('show');

        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    };

    // Update predict function in play_video.html
    window.predict = () => {
        const button = document.querySelector('.predict-btn');
        if (button.classList.contains('loading')) return;

        button.classList.add('loading');
        button.disabled = true;
        
        const data = {
            filename: video_filename // This should be defined in your template
        };
        
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if (res['output'] === 'Anomaly') {
                showAlert('⚠️ Anomaly Detected');
            }
        })
        .catch(err => {
            console.error(err);
            showAlert('Error processing video');
        })
        .finally(() => {
            button.classList.remove('loading');
            button.disabled = false;
        });
    };
});