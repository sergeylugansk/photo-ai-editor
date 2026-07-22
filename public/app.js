let uploadedImagePath = '';
let editedImagePath = '';

const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const previewSection = document.getElementById('previewSection');
const editSection = document.getElementById('editSection');
const downloadSection = document.getElementById('downloadSection');
const originalImage = document.getElementById('originalImage');
const editedImage = document.getElementById('editedImage');
const promptInput = document.getElementById('promptInput');
const editButton = document.getElementById('editButton');
const statusDiv = document.getElementById('status');
const downloadBtn = document.getElementById('downloadBtn');
const quickEditBtns = document.querySelectorAll('.edit-btn');

// Upload handling
uploadArea.addEventListener('click', () => imageInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#4CAF50';
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ddd';
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ddd';
    handleFile(e.dataTransfer.files[0]);
});

imageInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

async function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        updateStatus('Загрузка файла...', 'loading');
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            uploadedImagePath = data.path;
            originalImage.src = uploadedImagePath;
            previewSection.style.display = 'block';
            editSection.style.display = 'block';
            updateStatus('✅ Фото загружено успешно!', 'success');
            downloadSection.style.display = 'none';
        }
    } catch (error) {
        updateStatus('❌ Ошибка при загрузке', 'error');
        console.error('Upload error:', error);
    }
}

// Quick edit buttons
quickEditBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const prompt = btn.getAttribute('data-prompt');
        await editImage(prompt);
    });
});

// Edit button
editButton.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('Пожалуйста, введите промт');
        return;
    }
    await editImage(prompt);
});

async function editImage(prompt) {
    if (!uploadedImagePath) {
        alert('Пожалуйста, загрузите фото сначала');
        return;
    }

    try {
        updateStatus('⏳ Редактирование фото...', 'loading');
        
        const response = await fetch('/api/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imagePath: uploadedImagePath,
                prompt: prompt
            })
        });

        const data = await response.json();
        if (data.success) {
            editedImagePath = data.path;
            editedImage.src = editedImagePath + '?t=' + Date.now();
            downloadBtn.href = editedImagePath;
            downloadBtn.download = 'edited_photo.jpg';
            downloadSection.style.display = 'block';
            updateStatus('✅ Фото успешно отредактировано!', 'success');
        }
    } catch (error) {
        updateStatus('❌ Ошибка при редактировании', 'error');
        console.error('Edit error:', error);
    }
}

function updateStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
}
