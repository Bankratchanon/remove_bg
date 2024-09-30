let originalImage = null;
let modifiedImage = null;
let originalFileName = null;

function showHome() {
  document.getElementById('homeContent').style.display = 'block';
  document.getElementById('aboutContent').style.display = 'none';
  document.getElementById('contactContent').style.display = 'none';
}

function showAbout() {
  document.getElementById('homeContent').style.display = 'none';
  document.getElementById('aboutContent').style.display = 'block';
  document.getElementById('contactContent').style.display = 'none';
}

function showContact() {
  document.getElementById('homeContent').style.display = 'none';
  document.getElementById('aboutContent').style.display = 'none';
  document.getElementById('contactContent').style.display = 'block';
}

function showNotification(message) {
  const notification = document.querySelector('.notification');
  if (notification) {
    notification.innerHTML = `<strong>Notice:</strong> ${message}`;
    notification.style.display = 'block';
    notification.style.fontSize = '18px';

    setTimeout(() => {
      hideNotification();
    }, 4000);
  }
}

function hideNotification() {
  const notification = document.querySelector('.notification');
  if (notification) {
    notification.style.display = 'none';
  }
}

function previewImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const originalImageContainer = document.getElementById('originalImageContainer');
    const img = document.createElement('img');
    img.src = reader.result;
    img.alt = 'Uploaded Image';
    originalImage = img.src;
    originalFileName = file.name.replace(/\.[^/.]+$/, ""); // เอาชื่อไฟล์ที่อัปโหลดมาใช้
    originalImageContainer.innerHTML = '';
    originalImageContainer.appendChild(img);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

async function removeBackground() {
  const imageUrl = document.getElementById('imageUrl').value;
  let formData = new FormData();

  if (imageUrl) {
    formData.append('image_url', imageUrl);
    try {
      const urlObj = new URL(imageUrl);
      const pathname = urlObj.pathname;
      originalFileName = pathname.substring(pathname.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, ""); // เอาชื่อไฟล์จาก URL
    } catch (e) {
      originalFileName = 'image-from-url';
    }
  } else if (originalImage) {
    formData.append('image_file_b64', originalImage.split(',')[1]);
  } else {
    showNotification('Please upload an image or enter a URL first.');
    return;
  }
  const apiKey = 'f2qqJb1csMkYJDroPzvwKNjK';

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      showNotification('Failed to remove background, Please upload (png, jpeg) files ONLY');
      return;
    }

    hideNotification();

    const blob = await response.blob();
    modifiedImage = URL.createObjectURL(blob);

    const modifiedImageContainer = document.getElementById('modifiedImageContainer');
    const img = document.createElement('img');
    img.src = modifiedImage;
    img.alt = 'Modified Image';
    modifiedImageContainer.innerHTML = '';
    modifiedImageContainer.appendChild(img);

    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = modifiedImage;
    downloadLink.download = originalFileName.replace(/\s+/g, '_') + '.png';
    downloadLink.style.display = 'inline-block';
  } catch (error) {
    showNotification('An error occurred: ' + error.message);
  }
}

// เชื่อมต่อปุ่ม
document.getElementById('submitBtn').addEventListener('click', removeBackground);
