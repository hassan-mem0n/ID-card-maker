const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");
const savePhotoButton = document.getElementById("savePhoto");
const saveDetailsButton = document.getElementById("saveDetails");
const downloadCardButton = document.getElementById("downloadCard");
const capturePhotoButton = document.getElementById("capturePhoto");
const camera = document.getElementById("camera");

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

const nameInput = document.getElementById("name");
const fatherNameInput = document.getElementById("fatherName");
const emailInput = document.getElementById("email");
const dobInput = document.getElementById("dob");
const cardCanvas = document.getElementById("cardCanvas");

let photoURL = null;
let stream = null;

// Step 1: Initialize Camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then((mediaStream) => {
        stream = mediaStream;
        camera.srcObject = mediaStream;
    })
    .catch((err) => {
        console.error("Camera access denied:", err);
        alert("Unable to access camera. Please check permissions.");
    });

// Step 1.1: Capture Photo from Camera
capturePhotoButton.addEventListener("click", () => {
    const ctx = photoPreview.getContext("2d");
    ctx.drawImage(camera, 0, 0, 150, 150);
    photoURL = photoPreview.toDataURL();
});

// Step 1.2: Upload Photo
photoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const ctx = photoPreview.getContext("2d");
                ctx.clearRect(0, 0, 150, 150);
                ctx.drawImage(img, 0, 0, 150, 150);
                photoURL = e.target.result;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Step 1.3: Save Photo
savePhotoButton.addEventListener("click", () => {
    if (photoURL) {
        // Stop the camera
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        step1.style.display = "none";
        step2.style.display = "block";
    } else {
        alert("Please capture or upload a photo first.");
    }
});

// Step 2: Save Details
saveDetailsButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const fatherName = fatherNameInput.value.trim();
    const email = emailInput.value.trim();
    const dob = dobInput.value.trim();

    if (name && fatherName && email && dob) {
        step2.style.display = "none";
        step3.style.display = "block";

        generateIDCard(name, fatherName, email, dob);
    } else {
        alert("Please fill in all the details.");
    }
});

// Step 3: Generate QR Code and ID Card
function generateIDCard(name, fatherName, email, dob) {
    const ctx = cardCanvas.getContext("2d");

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 300, 400);

    // Add Photo
    if (photoURL) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 75, 20, 150, 150);
        };
        img.src = photoURL;
    }

    // Add Name, Father's Name, Email, and DOB
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Name: ${name}`, 20, 200);
    ctx.fillText(`Father: ${fatherName}`, 20, 230);
    ctx.fillText(`Email: ${email}`, 20, 260);
    ctx.fillText(`DOB: ${dob}`, 20, 290);

    // Generate QR Code
    const qrCanvas = document.createElement("canvas");
    const qrData = `Name: ${name}\nFather: ${fatherName}\nEmail: ${email}\nDOB: ${dob}`;
    QRCode.toCanvas(qrCanvas, qrData, { width: 100 }, (error) => {
        if (error) console.error(error);

        const qrImage = new Image();
        qrImage.onload = () => {
            ctx.drawImage(qrImage, 100, 300, 100, 100);
        };
        qrImage.src = qrCanvas.toDataURL();
    });
}

// Step 4: Download ID Card
downloadCardButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "ID_Card.png";
    link.href = cardCanvas.toDataURL("image/png");
    link.click();
});


