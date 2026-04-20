/*
// Elemen DOM
const uploadOption = document.getElementById('upload-option');
const cameraOption = document.getElementById('camera-option');
const uploadArea = document.getElementById('upload-area');
const cameraArea = document.getElementById('camera-area');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const startCameraBtn = document.getElementById('start-camera');
const captureBtn = document.getElementById('capture-btn');
const stopCameraBtn = document.getElementById('stop-camera');
const cameraView = document.getElementById('camera-view');
const cameraCanvas = document.getElementById('camera-canvas');
const previewImage = document.getElementById('preview-image');
const noPreview = document.getElementById('no-preview');
const removeImageBtn = document.getElementById('remove-image');
const analyzeBtn = document.getElementById('analyze-btn');
const resetBtn = document.getElementById('reset-btn');
const albuminResult = document.getElementById('albumin-result');
const albuminIndicator = document.getElementById('albumin-indicator');
const albuminInfo = document.getElementById('albumin-info');
const resultStatus = document.getElementById('result-status');
const resultName = document.getElementById('result-name');
const resultAge = document.getElementById('result-age');
const resultPressure = document.getElementById('result-pressure');
const resultAlbumin = document.getElementById('result-albumin');
const resultPressureStatus = document.getElementById('result-pressure-status');
const resultAlbuminStatus = document.getElementById('result-albumin-status');
const recommendation = document.getElementById('recommendation');

// Variabel global
let stream = null;
let currentImageData = null;


// Deklarasi fungsi dulu (hoisting)
function analyzeImage() {
    if (!currentImageData) return;
    
    // Simulasi analisis gambar strip albumin
    // Pada aplikasi nyata, ini akan menggunakan model machine learning
    // Di sini kita akan menghasilkan nilai acak berdasarkan kondisi tertentu
    
    // Nilai acak untuk simulasi (30-500 mg/dL)
    const randomValue = Math.floor(Math.random() * 471) + 30;
    albuminResult.value = randomValue;
    
    // Update indikator
    updateAlbuminIndicator(randomValue);
    
    // Tentukan status albumin
    let status, info, colorClass;
    if (randomValue < 30) {
        status = "Normal";
        info = "Kadar albumin dalam urine normal";
        colorClass = "normal";
    } else if (randomValue < 100) {
        status = "Rendah";
        info = "Kadar albumin sedikit meningkat";
        colorClass = "low";
    } else if (randomValue < 300) {
        status = "Sedang";
        info = "Kadar albumin meningkat (mikroalbuminuria)";
        colorClass = "medium";
    } else {
        status = "Tinggi";
        info = "Kadar albumin tinggi (makroalbuminuria)";
        colorClass = "high";
    }
    
    albuminInfo.textContent = info;
    albuminInfo.className = `level-info ${colorClass}`;
}

function updateAlbuminIndicator(value) {
    let percentage;
    
    if (value < 30) {
        percentage = (value / 30) * 25;
    } else if (value < 100) {
        percentage = 25 + ((value - 30) / 70) * 25;
    } else if (value < 300) {
        percentage = 50 + ((value - 100) / 200) * 25;
    } else {
        percentage = 75 + ((Math.min(value, 500) - 300) / 200) * 25;
    }
    
    albuminIndicator.style.width = `${percentage}%`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
uploadOption.addEventListener('click', () => switchMode('upload'));
cameraOption.addEventListener('click', () => switchMode('camera'));
browseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);
startCameraBtn.addEventListener('click', startCamera);
captureBtn.addEventListener('click', captureImage);
stopCameraBtn.addEventListener('click', stopCamera);
removeImageBtn.addEventListener('click', removeImage);
analyzeBtn.addEventListener('click', analyzeData);
resetBtn.addEventListener('click', resetApp);

// Inisialisasi aplikasi
function initApp() {
    // Tambah event listener untuk drag & drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            const files = e.dataTransfer.files;
            const file = files[0];
            handleFileUpload({ target: { files: [file] } });
        }
    });
    
    // Tampilkan modal info setelah delay
    setTimeout(() => {
        const infoModal = document.getElementById('info-modal');
        if (infoModal) {
            infoModal.style.display = 'flex';
        }
    }, 1000);
    
    // Event listener untuk modal
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('info-modal').style.display = 'none';
        });
    }
    
    // Tutup modal jika klik di luar
    window.addEventListener('click', (e) => {
        if (e.target.id === 'info-modal') {
            document.getElementById('info-modal').style.display = 'none';
        }
    });
}

// Switch antara upload dan kamera
function switchMode(mode) {
    if (mode === 'upload') {
        uploadOption.classList.add('active');
        cameraOption.classList.remove('active');
        uploadArea.style.display = 'block';
        cameraArea.style.display = 'none';
        stopCamera();
    } else {
        cameraOption.classList.add('active');
        uploadOption.classList.remove('active');
        uploadArea.style.display = 'none';
        cameraArea.style.display = 'block';
    }
}

// Handle upload file
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        alert('Harap pilih file gambar');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        noPreview.style.display = 'none';
        currentImageData = e.target.result;
        
        // Analisis otomatis gambar
        analyzeImage();
    };
    reader.readAsDataURL(file);
}

// Start kamera
async function startCamera() {
    try {
        // Cek apakah browser mendukung getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Browser tidak mendukung akses kamera');
            return;
        }
        
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        cameraView.srcObject = stream;
        startCameraBtn.disabled = true;
        captureBtn.disabled = false;
        stopCameraBtn.disabled = false;
        
        // Tunggu sampai video siap
        cameraView.onloadedmetadata = () => {
            console.log('Kamera siap digunakan');
        };
    } catch (err) {
        console.error('Error kamera:', err);
        alert('Tidak dapat mengakses kamera: ' + err.message);
        
        // Fallback ke upload mode
        switchMode('upload');
    }
}

// Capture gambar dari kamera
function captureImage() {
    if (!stream) {
        alert('Kamera belum dihidupkan');
        return;
    }
    
    const context = cameraCanvas.getContext('2d');
    
    // Set ukuran canvas sama dengan video
    cameraCanvas.width = cameraView.videoWidth;
    cameraCanvas.height = cameraView.videoHeight;
    
    // Gambar frame video ke canvas
    context.drawImage(cameraView, 0, 0, cameraCanvas.width, cameraCanvas.height);
    
    // Konversi ke data URL
    currentImageData = cameraCanvas.toDataURL('image/png');
    previewImage.src = currentImageData;
    previewImage.style.display = 'block';
    noPreview.style.display = 'none';
    
    // Analisis otomatis gambar
    analyzeImage();
    
    // Beri feedback visual
    captureBtn.innerHTML = '<i class="fas fa-check"></i> Foto Diambil!';
    captureBtn.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        captureBtn.innerHTML = '<i class="fas fa-camera"></i> Ambil Foto';
        captureBtn.style.backgroundColor = '';
    }, 1500);
}

// Stop kamera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        cameraView.srcObject = null;
        startCameraBtn.disabled = false;
        captureBtn.disabled = true;
        stopCameraBtn.disabled = true;
        stream = null;
    }
}

// Hapus gambar
function removeImage() {
    previewImage.src = '';
    previewImage.style.display = 'none';
    noPreview.style.display = 'flex';
    currentImageData = null;
    albuminResult.value = '';
    albuminIndicator.style.width = '0%';
    albuminInfo.textContent = 'Belum ada analisis albumin';
    albuminInfo.className = 'level-info';
    
    // Reset status hasil
    const statusIcon = resultStatus.querySelector('.status-icon i');
    const statusTitle = resultStatus.querySelector('.status-text h3');
    const statusDesc = resultStatus.querySelector('.status-text p');
    
    statusIcon.className = 'fas fa-question-circle';
    statusIcon.parentElement.style.color = '';
    statusTitle.textContent = 'Menunggu Analisis';
    statusDesc.textContent = 'Silakan masukkan data tekanan darah dan upload foto strip albumin';
}

// ============================================
// FUNGSI ANALISIS DATA - VERSI PERBAIKAN
// ============================================
function analyzeData() {
    console.log('🔍 Memulai analisis data...');
    
    // ============ 1. AMBIL DAN VALIDASI INPUT ============
    // PERBAIKAN: Deklarasikan semua variabel dengan const/let
    let patientName = document.getElementById('patient-name')?.value?.trim() || "Anonim";
    const gestationalAge = document.getElementById('patient-age')?.value?.trim() || "0";
    const systolic = parseInt(document.getElementById('systolic')?.value) || 0;
    const diastolic = parseInt(document.getElementById('diastolic')?.value) || 0;
    const albuminValue = parseInt(document.getElementById('albumin-result')?.value) || 0;
    
    console.log('📋 Data Input:', { patientName, gestationalAge, systolic, diastolic, albuminValue });
    
    // Validasi tekanan darah
    if (systolic === 0 || diastolic === 0) {
        alert("❌ Harap masukkan nilai tekanan darah yang valid");
        return;
    }
    
    if (!currentImageData) {
        alert("❌ Harap upload atau ambil foto strip albumin terlebih dahulu");
        return;
    }
    
    // ============ 2. ANALISIS TEKANAN DARAH ============
    const hasHypertension = systolic >= 140 || diastolic >= 90;
    let pressureStatus, pressureColor, pressureDesc;
    
    if (hasHypertension) {
        pressureStatus = "Hipertensi";
        pressureColor = "high";
        pressureDesc = systolic >= 160 || diastolic >= 110 ? "Hipertensi Berat" : "Hipertensi Ringan-Sedang";
    } else {
        pressureStatus = "Normal";
        pressureColor = "normal";
        pressureDesc = "Tekanan darah normal";
    }
    
    // ============ 3. ANALISIS ALBUMIN ============
    const hasAlbuminuria = albuminValue >= 300;
    let albuminStatus, albuminColor, albuminDesc;
    
    if (albuminValue < 30) {
        albuminStatus = "Normal";
        albuminColor = "normal";
        albuminDesc = "Tidak ada proteinuria";
    } else if (albuminValue < 100) {
        albuminStatus = "Rendah";
        albuminColor = "low";
        albuminDesc = "Proteinuria ringan (trace)";
    } else if (albuminValue < 300) {
        albuminStatus = "Sedang";
        albuminColor = "medium";
        albuminDesc = "Proteinuria sedang (mikroalbuminuria)";
    } else {
        albuminStatus = "Tinggi";
        albuminColor = "high";
        albuminDesc = "Proteinuria berat (makroalbuminuria)";
    }
    
    // ============ 4. DIAGNOSIS PRE-EKLAMPSIA ============
    let diagnosis, diagnosisCode, recommendationText, statusIcon, statusColor, severity;
    
    // KRITERIA DIAGNOSIS Pre-Eklampsia
    if (hasHypertension && hasAlbuminuria) {
        diagnosis = "PRE-EKLAMPSIA";
        diagnosisCode = "O14.9";
        severity = albuminValue >= 500 ? "Berat" : (systolic >= 160 ? "Berat" : "Ringan");
        statusIcon = "fas fa-exclamation-triangle";
        statusColor = "#e74c3c";
        
        recommendationText = `
            <strong>⚠️ TERINDIKASI PRE-EKLAMPSIA ${severity}</strong><br><br>
            Pasien memenuhi kriteria pre-eklampsia:<br>
            • Tekanan darah: ${systolic}/${diastolic} mmHg (≥140/90)<br>
            • Proteinuria: ${albuminValue} mg/dL (≥300)<br><br>
            
            <strong>REKOMENDASI:</strong><br>
            1. SEGERA rujuk ke dokter spesialis kandungan<br>
            2. Monitor tekanan darah setiap 4-6 jam<br>
            3. Pemeriksaan laboratorium lengkap<br>
            4. Evaluasi kesejahteraan janin<br>
            5. Pertimbangkan rawat inap
        `;
        
    } else if (hasHypertension && !hasAlbuminuria) {
        diagnosis = "HIPERTENSI GESTASIONAL";
        diagnosisCode = "O13";
        severity = systolic >= 160 ? "Berat" : "Ringan";
        statusIcon = "fas fa-exclamation-circle";
        statusColor = "#e67e22";
        
        recommendationText = `
            <strong>⚠️ HIPERTENSI GESTASIONAL ${severity}</strong><br><br>
            Pasien mengalami hipertensi tanpa proteinuria.<br><br>
            
            <strong>REKOMENDASI:</strong><br>
            1. Monitor tekanan darah setiap hari<br>
            2. Periksa protein urine setiap 1-2 minggu<br>
            3. Istirahat cukup, kurangi stres<br>
            4. Batasi konsumsi garam<br>
            5. Konsultasi rutin dengan bidan/dokter
        `;
        
    } else if (!hasHypertension && hasAlbuminuria) {
        diagnosis = "PROTEINURIA ISOLATED";
        diagnosisCode = "R80";
        statusIcon = "fas fa-info-circle";
        statusColor = "#f39c12";
        
        recommendationText = `
            <strong>ℹ️ PROTEINURIA TANPA HIPERTENSI</strong><br><br>
            Pasien mengalami peningkatan protein urine dengan tekanan darah normal.<br><br>
            
            <strong>REKOMENDASI:</strong><br>
            1. Evaluasi penyebab proteinuria<br>
            2. Ulang pemeriksaan urine dalam 1 minggu<br>
            3. Monitor tekanan darah secara teratur<br>
            4. Periksa fungsi ginjal<br>
            5. Konsultasi ke dokter umum/spesialis
        `;
        
    } else {
        diagnosis = "NORMAL";
        diagnosisCode = "Z34.0";
        statusIcon = "fas fa-check-circle";
        statusColor = "#27ae60";
        
        recommendationText = `
            <strong>✅ KEHAMILAN NORMAL</strong><br><br>
            Tekanan darah dan kadar protein urine dalam batas normal.<br><br>
            
            <strong>REKOMENDASI:</strong><br>
            1. Lanjutkan perawatan kehamilan rutin<br>
            2. Kontrol ANC sesuai jadwal<br>
            3. Konsumsi makanan bergizi seimbang<br>
            4. Istirahat cukup<br>
            5. Segera ke fasilitas kesehatan jika ada keluhan
        `;
    }
    
    // ============ 5. UPDATE TAMPILAN HASIL ============
    console.log('📊 Hasil Diagnosis:', diagnosis);
    
    // Ambil element hasil
    const resultName = document.getElementById('result-name');
    const resultAge = document.getElementById('result-age');
    const resultPressure = document.getElementById('result-pressure');
    const resultAlbumin = document.getElementById('result-albumin');
    const resultPressureStatus = document.getElementById('result-pressure-status');
    const resultAlbuminStatus = document.getElementById('result-albumin-status');
    const resultStatus = document.getElementById('result-status');
    const recommendation = document.getElementById('recommendation');
    
    // UPDATE DETAIL PASIEN
    if (resultName) resultName.textContent = patientName;
    if (resultAge) resultAge.textContent = `${gestationalAge} minggu`;
    if (resultPressure) resultPressure.textContent = `${systolic}/${diastolic} mmHg`;
    if (resultAlbumin) resultAlbumin.textContent = `${albuminValue} mg/dL`;
    
    // UPDATE STATUS TEKANAN DARAH
    if (resultPressureStatus) {
        resultPressureStatus.textContent = `${pressureStatus} (${systolic}/${diastolic})`;
        resultPressureStatus.className = pressureColor;
        resultPressureStatus.style.fontWeight = 'bold';
        resultPressureStatus.style.padding = '4px 12px';
        resultPressureStatus.style.borderRadius = '20px';
    }
    
    // UPDATE STATUS ALBUMIN
    if (resultAlbuminStatus) {
        resultAlbuminStatus.textContent = `${albuminStatus} (${albuminValue} mg/dL) - ${albuminDesc}`;
        resultAlbuminStatus.className = albuminColor;
        resultAlbuminStatus.style.fontWeight = 'bold';
        resultAlbuminStatus.style.padding = '4px 12px';
        resultAlbuminStatus.style.borderRadius = '20px';
    }
    
    // UPDATE STATUS HASIL (BAGIAN ATAS)
    const statusIconElem = resultStatus?.querySelector('.status-icon i');
    const statusTitle = resultStatus?.querySelector('.status-text h3');
    const statusDesc = resultStatus?.querySelector('.status-text p');
    
    if (statusIconElem) {
        statusIconElem.className = statusIcon;
        statusIconElem.style.color = statusColor;
    }
    
    if (statusTitle) {
        statusTitle.textContent = diagnosis;
        statusTitle.style.color = statusColor;
    }
    
    if (statusDesc) {
        statusDesc.innerHTML = `
            <span style="color: ${statusColor}; font-weight: bold;">Kode ICD-10: ${diagnosisCode}</span><br>
            Tekanan darah: ${systolic}/${diastolic} mmHg (${pressureDesc})<br>
            Protein urine: ${albuminValue} mg/dL (${albuminDesc})
        `;
    }
    
    // UPDATE REKOMENDASI
    if (recommendation) {
        recommendation.innerHTML = `
            <h4 style="color: ${statusColor};">
                <i class="${statusIcon}" style="color: ${statusColor};"></i> 
                REKOMENDASI MEDIS
            </h4>
            <div style="background-color: ${statusColor}10; padding: 15px; border-radius: 8px; border-left: 5px solid ${statusColor};">
                ${recommendationText}
            </div>
            <div style="margin-top: 15px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; font-size: 0.9rem;">
                <p style="margin-bottom: 5px;"><strong>📋 KRITERIA DIAGNOSIS:</strong></p>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="color: ${hasHypertension ? '#e74c3c' : '#27ae60'};">
                        Tekanan darah: ${systolic}/${diastolic} mmHg 
                        ${hasHypertension ? '⚠️ (≥140/90)' : '✅ (Normal)'}
                    </li>
                    <li style="color: ${hasAlbuminuria ? '#e74c3c' : '#27ae60'};">
                        Protein urine: ${albuminValue} mg/dL 
                        ${hasAlbuminuria ? '⚠️ (≥300)' : '✅ (Normal)'}
                    </li>
                </ul>
                <p style="margin-top: 10px; margin-bottom: 0; font-style: italic; color: #7f8c8d;">
                    <i class="fas fa-stethoscope"></i> 
                    Diagnosis akhir harus ditentukan oleh tenaga medis profesional.
                </p>
            </div>
        `;
    }
    
    // ============ 6. SIMPAN DATA UNTUK BUTTON SAVE ============
    // PERBAIKAN: Pastikan currentAnalysisData dideklarasikan di global scope
    if (typeof currentAnalysisData !== 'undefined') {
        window.currentAnalysisData = {
            patientName: patientName,
            gestationalAge: gestationalAge,
            systolic: systolic,
            diastolic: diastolic,
            albuminValue: albuminValue,
            diagnosis: diagnosis,
            diagnosisCode: diagnosisCode,
            severity: severity || '-',
            pressureStatus: pressureStatus,
            pressureDesc: pressureDesc,
            albuminStatus: albuminStatus,
            albuminDesc: albuminDesc,
            hasHypertension: hasHypertension,
            hasAlbuminuria: hasAlbuminuria,
            timestamp: new Date().toISOString()
        };
    }
    
    // ENABLE TOMBOL SIMPAN
    const saveDataBtn = document.getElementById('save-data-btn');
    if (saveDataBtn) {
        saveDataBtn.disabled = false;
        saveDataBtn.classList.add('btn-success');
    }
    
    // ============ 7. ANIMASI & FEEDBACK ============
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.innerHTML = '<i class="fas fa-check"></i> Analisis Selesai!';
        analyzeBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            analyzeBtn.innerHTML = '<i class="fas fa-play"></i> Analisis Sekarang';
            analyzeBtn.style.backgroundColor = '';
        }, 2000);
    }
    
    // Scroll ke hasil analisis
    setTimeout(() => {
        document.querySelector('.result-section')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
    
    // Tampilkan notifikasi
    if (typeof showNotification === 'function') {
        showNotification('✅ Analisis selesai! Lihat hasil di bawah.', 'success');
    } else {
        alert('✅ Analisis selesai!');
    }
    
    console.log('✅ Analisis selesai!');
}

// Reset aplikasi
function resetApp() {
    // Reset form
    document.getElementById('patient-name').value = '';
    document.getElementById('patient-age').value = '';
    document.getElementById('systolic').value = '';
    document.getElementById('diastolic').value = '';
    
    // Reset gambar
    removeImage();
    
    // Reset hasil
    resultName.textContent = '-';
    resultAge.textContent = '- minggu';
    resultPressure.textContent = '-/- mmHg';
    resultAlbumin.textContent = '- mg/dL';
    resultPressureStatus.textContent = '-';
    resultPressureStatus.className = '';
    resultAlbuminStatus.textContent = '-';
    resultAlbuminStatus.className = '';
    
    // Reset status
    const statusIcon = resultStatus.querySelector('.status-icon i');
    const statusTitle = resultStatus.querySelector('.status-text h3');
    const statusDesc = resultStatus.querySelector('.status-text p');
    
    statusIcon.className = 'fas fa-question-circle';
    statusIcon.parentElement.style.color = '';
    statusTitle.textContent = 'Menunggu Analisis';
    statusDesc.textContent = 'Silakan masukkan data tekanan darah dan upload foto strip albumin';
    
    // Reset rekomendasi
    recommendation.innerHTML = `
        <h4><i class="fas fa-lightbulb"></i> Rekomendasi</h4>
        <p>Setelah data dimasukkan, sistem akan memberikan rekomendasi berdasarkan hasil analisis.</p>
    `;
    
    // Kembali ke mode upload
    switchMode('upload');
    
    // Beri feedback
    alert('Aplikasi telah direset. Silakan mulai analisis baru.');
}

// Konfigurasi Google Apps Script URL (GANTI DENGAN URL ANDA)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwo8ETQHve0oxkHMoIXPizw3vq5ghqAcJqO1wyR731RBKvnuwwINKDJTlMPk7g5GQ3ZBw/exec';

// Variabel untuk menyimpan status
let currentAnalysisData = null;
const saveDataBtn = document.getElementById('save-data-btn');

// Fungsi utama untuk menyimpan data ke spreadsheet
async function saveToSpreadsheet() {
    // Validasi apakah ada data untuk disimpan
    if (!currentAnalysisData) {
        showSaveStatus('Tidak ada data untuk disimpan. Lakukan analisis terlebih dahulu.', 'error');
        return;
    }

    // Disable button selama proses
    saveDataBtn.disabled = true;
    saveDataBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

    try {
        // Format data untuk dikirim
        const dataToSave = {
            timestamp: new Date().toISOString(),
            name: currentAnalysisData.patientName || 'Anonim',
            age: currentAnalysisData.gestationalAge || '0',
            systolic: currentAnalysisData.systolic || 0,
            diastolic: currentAnalysisData.diastolic || 0,
            albumin: currentAnalysisData.albuminValue || 0,
            diagnosis: currentAnalysisData.diagnosis || 'Belum dianalisis',
            pressureStatus: currentAnalysisData.pressureStatus || 'Tidak diketahui',
            albuminStatus: currentAnalysisData.albuminStatus || 'Tidak diketahui',
            hasHypertension: currentAnalysisData.hasHypertension || false,
            hasAlbuminuria: currentAnalysisData.hasAlbuminuria || false
        };

        // Kirim ke Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Untuk menghindari CORS issue
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSave)
        });

        // Simpan juga ke localStorage sebagai backup
        saveToLocalStorage(dataToSave);
        
        // Tampilkan status sukses
        showSaveStatus('✅ Data berhasil disimpan ke spreadsheet!', 'success');
        
        // Update counter data tersimpan
        updateSavedDataCounter();

    } catch (error) {
        console.error('Error saving to spreadsheet:', error);
        
        // Simpan ke localStorage sebagai fallback
        saveToLocalStorage(currentAnalysisData);
        
        // Tampilkan status error dengan opsi export
        showSaveStatusWithExport(
            '⚠️ Gagal menyimpan ke spreadsheet. Data disimpan secara lokal.',
            'error',
            () => exportToCSV()
        );
        
    } finally {
        // Enable button kembali
        saveDataBtn.disabled = false;
        saveDataBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Data ke Spreadsheet';
    }
}

// Fungsi untuk menampilkan status penyimpanan
function showSaveStatus(message, type = 'info') {
    // Hapus status sebelumnya jika ada
    const existingStatus = document.querySelector('.save-status');
    if (existingStatus) {
        existingStatus.remove();
    }

    // Buat elemen status baru
    const statusDiv = document.createElement('div');
    statusDiv.className = `save-status ${type}`;
    
    // Ikon sesuai tipe
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    statusDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // Tambahkan ke DOM setelah button
    saveDataBtn.parentNode.appendChild(statusDiv);
    
    // Auto hide setelah 5 detik untuk sukses
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.remove();
        }, 5000);
    }
}

// Fungsi untuk menampilkan status dengan tombol export
function showSaveStatusWithExport(message, type = 'error', exportCallback) {
    const existingStatus = document.querySelector('.save-status');
    if (existingStatus) {
        existingStatus.remove();
    }

    const statusDiv = document.createElement('div');
    statusDiv.className = `save-status ${type}`;
    
    statusDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <div style="flex: 1;">
            <p style="margin-bottom: 8px;">${message}</p>
            <button class="btn btn-small btn-secondary" onclick="exportToCSV()">
                <i class="fas fa-download"></i> Ekspor CSV
            </button>
            <button class="btn btn-small btn-primary" onclick="retrySave()">
                <i class="fas fa-redo"></i> Coba Lagi
            </button>
        </div>
    `;
    
    saveDataBtn.parentNode.appendChild(statusDiv);
}

// Fungsi untuk mencoba menyimpan ulang
function retrySave() {
    document.querySelector('.save-status')?.remove();
    saveToSpreadsheet();
}

// Simpan ke localStorage sebagai backup
function saveToLocalStorage(data) {
    try {
        const savedData = JSON.parse(localStorage.getItem('preeclampsiaData')) || [];
        
        // Tambah ID unik
        const newEntry = {
            ...data,
            id: Date.now(),
            savedAt: new Date().toISOString()
        };
        
        savedData.push(newEntry);
        localStorage.setItem('preeclampsiaData', JSON.stringify(savedData));
        
        console.log('Data backup tersimpan di localStorage:', newEntry);
        return true;
    } catch (error) {
        console.error('Gagal menyimpan ke localStorage:', error);
        return false;
    }
}

// Update counter data tersimpan
function updateSavedDataCounter() {
    const savedData = JSON.parse(localStorage.getItem('preeclampsiaData')) || [];
    const totalData = savedData.length;
    
    // Update badge atau counter di UI
    let counter = document.getElementById('data-counter');
    if (!counter) {
        counter = document.createElement('span');
        counter.id = 'data-counter';
        counter.className = 'data-counter';
        saveDataBtn.parentNode.appendChild(counter);
    }
    
    counter.innerHTML = `📊 Total tersimpan: ${totalData} data`;
}

// Modifikasi fungsi analyzeData untuk menyimpan data ke currentAnalysisData
function analyzeData() {
    // ... (kode analisis yang sudah ada) ...
    
    // Setelah selesai analisis, simpan hasil ke currentAnalysisData
    currentAnalysisData = {
        patientName: patientName,
        gestationalAge: gestationalAge,
        systolic: systolic,
        diastolic: diastolic,
        albuminValue: albuminValue,
        diagnosis: diagnosis,
        pressureStatus: pressureStatus,
        albuminStatus: albuminStatus,
        hasHypertension: hasHypertension,
        hasAlbuminuria: hasAlbuminuria,
        timestamp: new Date().toISOString()
    };
    
    // Enable button simpan
    saveDataBtn.disabled = false;
    
    // Tampilkan notifikasi bahwa data siap disimpan
    showSaveStatus('✓ Data siap disimpan ke spreadsheet. Klik tombol Simpan.', 'info');
    
    // ... (sisa kode analisis) ...
}

// Event listener untuk button simpan
saveDataBtn.addEventListener('click', saveToSpreadsheet);

// Disable button simpan di awal
saveDataBtn.disabled = true;

// Cek koneksi ke Apps Script
async function checkConnection() {
    const statusEl = document.getElementById('connection-status');
    
    try {
        const response = await fetch(APPS_SCRIPT_URL);
        statusEl.innerHTML = '<i class="fas fa-cloud"></i> Terhubung ke Spreadsheet';
        statusEl.className = 'connection-status online';
    } catch (error) {
        statusEl.innerHTML = '<i class="fas fa-cloud-offline"></i> Mode Offline';
        statusEl.className = 'connection-status offline';
    }
}

// Panggil saat aplikasi dimuat
checkConnection();
// Cek koneksi setiap 30 detik
setInterval(checkConnection, 30000);




// ============================================
// APLIKASI ANALISIS PRE-EKLAMPSIA
// VERSI SUPER SIMPLE - PASTI JALAN
// ============================================

// Variabel global
// let currentImageData = null;
// let currentAnalysisData = null;

// Jalankan setelah halaman siap
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplikasi siap!');
    
    // ========== AMBIL TOMBOL ANALISIS ==========
    const analyzeBtn = document.getElementById('analyze-btn');
    
    if (!analyzeBtn) {
        console.error('❌ Tombol analisis tidak ditemukan!');
        return;
    }
    
    console.log('✅ Tombol analisis ditemukan');
    
    // ========== FUNGSI ANALISIS ==========
    window.analyzeData = function() {
        console.log('🟢 Tombol ditekan!');
        
        // AMBIL NILAI DARI INPUT
        const nameInput = document.getElementById('patient-name');
        const ageInput = document.getElementById('patient-age');
        const sysInput = document.getElementById('systolic');
        const diaInput = document.getElementById('diastolic');
        const albInput = document.getElementById('albumin-result');
        
        // SET NILAI (dengan pengecekan)
        const patientName = nameInput ? (nameInput.value.trim() || 'Anonim') : 'Anonim';
        const gestationalAge = ageInput ? (ageInput.value.trim() || '0') : '0';
        const systolic = sysInput ? (parseInt(sysInput.value) || 0) : 0;
        const diastolic = diaInput ? (parseInt(diaInput.value) || 0) : 0;
        const albuminValue = albInput ? (parseInt(albInput.value) || 0) : 0;
        
        console.log('Data:', {patientName, gestationalAge, systolic, diastolic, albuminValue});
        
        // VALIDASI
        if (systolic === 0 || diastolic === 0) {
            alert('❌ Masukkan tekanan darah!');
            return;
        }
        
        // ANALISIS SEDERHANA
        const hipertensi = systolic >= 140 || diastolic >= 90;
        const proteinuria = albuminValue >= 300;
        
        let diagnosis = 'NORMAL';
        let warna = '#27ae60';
        let icon = 'fa-check-circle';
        let rekomendasi = '✅ Kehamilan normal. Lanjutkan perawatan rutin.';
        
        if (hipertensi && proteinuria) {
            diagnosis = 'PRE-EKLAMPSIA';
            warna = '#e74c3c';
            icon = 'fa-exclamation-triangle';
            rekomendasi = '⚠️ SEGERA KE DOKTER! Tanda pre-eklampsia.';
        } else if (hipertensi) {
            diagnosis = 'HIPERTENSI GESTASIONAL';
            warna = '#e67e22';
            icon = 'fa-exclamation-circle';
            rekomendasi = '📊 Monitor tensi rutin. Kurangi garam.';
        } else if (proteinuria) {
            diagnosis = 'PROTEINURIA';
            warna = '#f39c12';
            icon = 'fa-info-circle';
            rekomendasi = '🔬 Periksa ulang protein urine.';
        }
        
        // ========== UPDATE UI ==========
        // Update data pasien
        const nameEl = document.getElementById('result-name');
        if (nameEl) nameEl.textContent = patientName;
        
        const ageEl = document.getElementById('result-age');
        if (ageEl) ageEl.textContent = gestationalAge + ' minggu';
        
        const pressureEl = document.getElementById('result-pressure');
        if (pressureEl) pressureEl.textContent = systolic + '/' + diastolic + ' mmHg';
        
        const albuminEl = document.getElementById('result-albumin');
        if (albuminEl) albuminEl.textContent = albuminValue + ' mg/dL';
        
        // Update status
        const pressureStatusEl = document.getElementById('result-pressure-status');
        if (pressureStatusEl) {
            pressureStatusEl.textContent = hipertensi ? 'HIPERTENSI' : 'NORMAL';
            pressureStatusEl.className = hipertensi ? 'high' : 'normal';
        }
        
        const albuminStatusEl = document.getElementById('result-albumin-status');
        if (albuminStatusEl) {
            albuminStatusEl.textContent = proteinuria ? 'PROTEINURIA' : 'NORMAL';
            albuminStatusEl.className = proteinuria ? 'high' : 'normal';
        }
        
        // Update status utama
        const statusTitle = document.querySelector('#result-status .status-text h3');
        if (statusTitle) {
            statusTitle.textContent = diagnosis;
            statusTitle.style.color = warna;
        }
        
        const statusIcon = document.querySelector('#result-status .status-icon i');
        if (statusIcon) {
            statusIcon.className = 'fas ' + icon;
            statusIcon.style.color = warna;
        }
        
        const statusDesc = document.querySelector('#result-status .status-text p');
        if (statusDesc) {
            statusDesc.innerHTML = `Tekanan: ${systolic}/${diastolic} mmHg | Albumin: ${albuminValue} mg/dL`;
        }
        
        // Update rekomendasi
        const recEl = document.getElementById('recommendation');
        if (recEl) {
            recEl.innerHTML = `
                <h4 style="color: ${warna};">
                    <i class="fas ${icon}" style="color: ${warna};"></i> 
                    REKOMENDASI
                </h4>
                <p>${rekomendasi}</p>
            `;
        }
        
        // Simpan data untuk tombol save
        currentAnalysisData = {
            patientName: patientName,
            gestationalAge: gestationalAge,
            systolic: systolic,
            diastolic: diastolic,
            albuminValue: albuminValue,
            diagnosis: diagnosis,
            timestamp: new Date().toISOString()
        };
        
        // Enable tombol save
        const saveBtn = document.getElementById('save-data-btn');
        if (saveBtn) saveBtn.disabled = false;
        
        // Animasi tombol
        analyzeBtn.innerHTML = '<i class="fas fa-check"></i> Selesai!';
        analyzeBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            analyzeBtn.innerHTML = '<i class="fas fa-play"></i> Analisis Sekarang';
            analyzeBtn.style.backgroundColor = '';
        }, 1500);
        
        alert('✅ Analisis selesai!');
    };
    
    // ========== PASANG EVENT LISTENER ==========
    analyzeBtn.onclick = function(e) {
        e.preventDefault();
        window.analyzeData();
    };
    
    console.log('✅ Siap digunakan!');
});

// ========== FUNGSI SIMPAN DATA (OFFLINE) ==========
function saveDataLocally() {
    if (!currentAnalysisData) {
        alert('Tidak ada data untuk disimpan!');
        return;
    }
    
    let savedData = JSON.parse(localStorage.getItem('preeclampsiaData')) || [];
    
    const newData = {
        ...currentAnalysisData,
        id: Date.now(),
        saveTime: new Date().toLocaleString('id-ID')
    };
    
    savedData.push(newData);
    localStorage.setItem('preeclampsiaData', JSON.stringify(savedData));
    
    alert('✅ Data tersimpan!\nTotal: ' + savedData.length + ' data');
}

// ========== FUNGSI LIHAT DATA ==========
function viewSavedData() {
    const savedData = JSON.parse(localStorage.getItem('preeclampsiaData')) || [];
    
    if (savedData.length === 0) {
        alert('Belum ada data');
        return;
    }
    
    let message = '📊 DATA TERSIMPAN:\n\n';
    savedData.slice(-5).forEach((d, i) => {
        message += `${i+1}. ${d.patientName}: ${d.diagnosis}\n`;
    });
    message += `\nTotal: ${savedData.length} data`;
    alert(message);
    
    console.log('Semua data:', savedData);
}

// ========== FUNGSI EXPORT CSV ==========
function exportToCSV() {
    const savedData = JSON.parse(localStorage.getItem('preeclampsiaData')) || [];
    
    if (savedData.length === 0) {
        alert('Tidak ada data');
        return;
    }
    
    const headers = ['Nama','Usia','Sistolik','Diastolik','Albumin','Diagnosis','Waktu'];
    const rows = [headers.join(',')];
    
    savedData.forEach(d => {
        rows.push(`"${d.patientName}",${d.gestationalAge},${d.systolic},${d.diastolic},${d.albuminValue},"${d.diagnosis}","${d.saveTime}"`);
    });
    
    const blob = new Blob([rows.join('\n')], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-preeclampsia.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// ========== FUNGSI RESET ==========
function resetApp() {
    if (confirm('Reset semua input?')) {
        document.getElementById('patient-name').value = '';
        document.getElementById('patient-age').value = '';
        document.getElementById('systolic').value = '';
        document.getElementById('diastolic').value = '';
        document.getElementById('albumin-result').value = '';
        
        // Reset hasil
        document.getElementById('result-name').textContent = '-';
        document.getElementById('result-age').textContent = '- minggu';
        document.getElementById('result-pressure').textContent = '-/- mmHg';
        document.getElementById('result-albumin').textContent = '- mg/dL';
        document.getElementById('result-pressure-status').textContent = '-';
        document.getElementById('result-albumin-status').textContent = '-';
        
        currentAnalysisData = null;
        
        const saveBtn = document.getElementById('save-data-btn');
        if (saveBtn) saveBtn.disabled = true;
    }
}
*/

// ============================================
// APLIKASI ANALISIS PRE-EKLAMPSIA
// VERSI LENGKAP - SIAP PAKAI
// ============================================

// ========== VARIABEL GLOBAL ==========
let currentImageData = null;
let currentAnalysisData = null;

// ========== TUNGGU DOM SIAP ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplikasi dimulai...');
    
    // Inisialisasi semua fitur
    initApp();
    
    // Update counter data
    updateDataCounter();
});

// ========== INISIALISASI APLIKASI ==========
function initApp() {
    // Ambil semua elemen yang diperlukan
    const analyzeBtn = document.getElementById('analyze-btn');
    const browseBtn = document.getElementById('browse-btn');
    const fileInput = document.getElementById('file-input');
    const removeImageBtn = document.getElementById('remove-image');
    const uploadOption = document.getElementById('upload-option');
    const cameraOption = document.getElementById('camera-option');
    const uploadArea = document.getElementById('upload-area');
    
    // Cek koneksi ke Google Sheets (opsional)
    checkConnection();
    
    // Pasang event listener untuk tombol analisis
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            analyzeData();
        });
        console.log('✅ Tombol analisis siap');
    } else {
        console.error('❌ Tombol analisis tidak ditemukan');
    }
    
    // Event untuk upload gambar
    if (browseBtn && fileInput) {
        browseBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            handleImageUpload(e.target.files[0]);
        });
    }
    
    // Event untuk hapus gambar
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', removeImage);
    }
    
    // Drag & drop
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#3498db';
        });
        
        uploadArea.addEventListener('dragleave', function() {
            uploadArea.style.borderColor = '#ddd';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImageUpload(file);
            }
        });
    }
    
    // Switch mode upload/kamera
    if (uploadOption && cameraOption) {
        uploadOption.addEventListener('click', function() {
            uploadOption.classList.add('active');
            cameraOption.classList.remove('active');
            document.getElementById('upload-area').style.display = 'block';
        });
    }
}

// ========== FUNGSI ANALISIS DATA (DENGAN BERAT & TINGGI) ==========
function analyzeData() {
    // Ambil nilai input (TERMASUK BERAT & TINGGI)
    const patientName = document.getElementById('patient-name')?.value?.trim() || 'Anonim';
    const gestationalAge = document.getElementById('patient-age')?.value?.trim() || '0';
    const weight = parseFloat(document.getElementById('patient-weight')?.value) || 0;
    const height = parseFloat(document.getElementById('patient-height')?.value) || 0;
    const systolic = parseInt(document.getElementById('systolic')?.value) || 0;
    const diastolic = parseInt(document.getElementById('diastolic')?.value) || 0;
    const albuminValue = parseInt(document.getElementById('albumin-result')?.value) || 0;
    
    // Hitung IMT (Indeks Massa Tubuh) jika berat dan tinggi ada
    let bmi = 0;
    let bmiCategory = '';
    if (weight > 0 && height > 0) {
        bmi = weight / ((height/100) * (height/100));
        bmi = Math.round(bmi * 10) / 10; // Pembulatan 1 desimal
        
        // Kategori IMT
        if (bmi < 18.5) bmiCategory = 'Kurus';
        else if (bmi < 25) bmiCategory = 'Normal';
        else if (bmi < 30) bmiCategory = 'Gemuk';
        else bmiCategory = 'Obesitas';
        
        // Tampilkan IMT
        document.getElementById('bmi-value').innerHTML = `${bmi} (${bmiCategory})`;
    }
    
    console.log('Data input:', {patientName, gestationalAge, weight, height, bmi, systolic, diastolic, albuminValue});
    
    // Validasi
    if (systolic === 0 || diastolic === 0) {
        alert('❌ Mohon isi tekanan darah');
        return;
    }
    
    if (!currentImageData) {
        alert('❌ Mohon upload foto strip albumin');
        return;
    }
    
    // Analisis (sama seperti sebelumnya)
    const hipertensi = systolic >= 140 || diastolic >= 90;
    const proteinuria = albuminValue >= 300;
    
    let diagnosis = 'NORMAL';
    let warna = '#27ae60';
    let icon = 'fa-check-circle';
    let rekomendasi = '✅ Kehamilan normal. Lanjutkan perawatan rutin.';
    
    if (hipertensi && proteinuria) {
        diagnosis = 'PRE-EKLAMPSIA';
        warna = '#e74c3c';
        icon = 'fa-exclamation-triangle';
        rekomendasi = '⚠️ SEGERA KE DOKTER! Tanda pre-eklampsia.';
    } else if (hipertensi) {
        diagnosis = 'HIPERTENSI GESTASIONAL';
        warna = '#e67e22';
        icon = 'fa-exclamation-circle';
        rekomendasi = '📊 Monitor tensi rutin. Kurangi garam.';
    } else if (proteinuria) {
        diagnosis = 'PROTEINURIA';
        warna = '#f39c12';
        icon = 'fa-info-circle';
        rekomendasi = '🔬 Periksa ulang protein urine.';
    }
    
    // Update UI (tambahkan berat & tinggi di tampilan hasil nanti)
    document.getElementById('result-name').textContent = patientName;
    document.getElementById('result-age').textContent = gestationalAge + ' minggu';
    
    // Bisa tambahkan elemen baru untuk menampilkan berat & tinggi
    // Atau tampilkan di detail hasil
    
    document.getElementById('result-pressure').textContent = systolic + '/' + diastolic + ' mmHg';
    document.getElementById('result-albumin').textContent = albuminValue + ' mg/dL';
    
    document.getElementById('result-pressure-status').textContent = hipertensi ? 'HIPERTENSI' : 'NORMAL';
    document.getElementById('result-pressure-status').className = hipertensi ? 'high' : 'normal';
    
    document.getElementById('result-albumin-status').textContent = proteinuria ? 'PROTEINURIA' : 'NORMAL';
    document.getElementById('result-albumin-status').className = proteinuria ? 'high' : 'normal';
    
    document.getElementById('status-title').textContent = diagnosis;
    document.getElementById('status-title').style.color = warna;
    
    document.getElementById('status-desc').innerHTML = 
        `Tekanan: ${systolic}/${diastolic} mmHg | Albumin: ${albuminValue} mg/dL`;
    
    document.getElementById('recommendation-text').innerHTML = rekomendasi;
    
    // Simpan data LENGKAP untuk tombol save (TERMASUK BERAT & TINGGI)
    currentAnalysisData = {
        patientName: patientName,
        gestationalAge: gestationalAge,
        weight: weight,
        height: height,
        bmi: bmi,
        systolic: systolic,
        diastolic: diastolic,
        albuminValue: albuminValue,
        diagnosis: diagnosis,
        hipertensi: hipertensi,
        proteinuria: proteinuria
    };
    
    // Enable tombol save
    document.getElementById('save-data-btn').disabled = false;
    
    alert('✅ Analisis selesai! Klik "Simpan Data" untuk menyimpan.');
}

// ========== UPDATE UI ==========
function updateUI(data) {
    // Data pasien
    setText('result-name', data.patientName);
    setText('result-age', data.gestationalAge + ' minggu');
    setText('result-pressure', data.systolic + '/' + data.diastolic + ' mmHg');
    setText('result-albumin', data.albuminValue + ' mg/dL');
    
    // Status
    const pressureEl = document.getElementById('result-pressure-status');
    if (pressureEl) {
        pressureEl.textContent = data.hipertensi ? 'HIPERTENSI' : 'NORMAL';
        pressureEl.className = data.hipertensi ? 'high' : 'normal';
    }
    
    const albuminEl = document.getElementById('result-albumin-status');
    if (albuminEl) {
        albuminEl.textContent = data.proteinuria ? 'PROTEINURIA' : 'NORMAL';
        albuminEl.className = data.proteinuria ? 'high' : 'normal';
    }
    
    // Status utama
    const statusTitle = document.getElementById('status-title');
    if (statusTitle) {
        statusTitle.textContent = data.diagnosis;
        statusTitle.style.color = data.warna;
    }
    
    const statusIcon = document.querySelector('#result-status .status-icon i');
    if (statusIcon) {
        statusIcon.className = 'fas ' + data.icon;
        statusIcon.style.color = data.warna;
    }
    
    const statusDesc = document.getElementById('status-desc');
    if (statusDesc) {
        statusDesc.innerHTML = `Tekanan: ${data.systolic}/${data.diastolic} mmHg | Albumin: ${data.albuminValue} mg/dL`;
    }
    
    // Rekomendasi
    const recText = document.getElementById('recommendation-text');
    if (recText) {
        recText.innerHTML = data.rekomendasi;
    }
    
    const recTitle = document.querySelector('#recommendation h4');
    if (recTitle) {
        recTitle.style.color = data.warna;
        const icon = recTitle.querySelector('i');
        if (icon) icon.style.color = data.warna;
    }
}

// ========== HANDLE UPLOAD GAMBAR ==========
function handleImageUpload(file) {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('❌ File harus berupa gambar');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('preview-image');
        const noPreview = document.getElementById('no-preview');
        
        preview.src = e.target.result;
        preview.style.display = 'block';
        noPreview.style.display = 'none';
        
        currentImageData = e.target.result;
        
        // Simulasi analisis albumin
        const randomAlbumin = Math.floor(Math.random() * 300) + 50;
        document.getElementById('albumin-result').value = randomAlbumin;
        
        console.log('✅ Gambar diupload, kadar albumin:', randomAlbumin);
    };
    reader.readAsDataURL(file);
}

// ========== HAPUS GAMBAR ==========
function removeImage() {
    const preview = document.getElementById('preview-image');
    const noPreview = document.getElementById('no-preview');
    const albuminInput = document.getElementById('albumin-result');
    
    preview.src = '';
    preview.style.display = 'none';
    noPreview.style.display = 'flex';
    albuminInput.value = '';
    currentImageData = null;
}

// ========== FUNGSI SET TEXT ==========
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// ========== FUNGSI SIMPAN DATA ==========
// ========== FUNGSI SIMPAN DATA (DENGAN BERAT & TINGGI) ==========
async function saveData() {
    // Ambil langsung dari input HTML (TERMASUK BERAT & TINGGI)
    const patientName = document.getElementById('patient-name')?.value?.trim() || 'Anonim';
    const gestationalAge = document.getElementById('patient-age')?.value?.trim() || '0';
    const weight = parseFloat(document.getElementById('patient-weight')?.value) || 0;
    const height = parseFloat(document.getElementById('patient-height')?.value) || 0;
    const systolic = parseInt(document.getElementById('systolic')?.value) || 0;
    const diastolic = parseInt(document.getElementById('diastolic')?.value) || 0;
    const albuminValue = parseInt(document.getElementById('albumin-result')?.value) || 0;
    
    // Hitung IMT
    let bmi = 0;
    if (weight > 0 && height > 0) {
        bmi = weight / ((height/100) * (height/100));
        bmi = Math.round(bmi * 10) / 10;
    }
    
    // Hitung diagnosis
    const hipertensi = systolic >= 140 || diastolic >= 90;
    const proteinuria = albuminValue >= 300;
    
    let diagnosis = 'NORMAL';
    if (hipertensi && proteinuria) diagnosis = 'PRE-EKLAMPSIA';
    else if (hipertensi) diagnosis = 'HIPERTENSI GESTASIONAL';
    else if (proteinuria) diagnosis = 'PROTEINURIA';
    
    // Data LENGKAP untuk disimpan
    const dataToSave = {
        patientName: patientName,
        gestationalAge: gestationalAge,
        weight: weight,
        height: height,
        bmi: bmi,
        systolic: systolic,
        diastolic: diastolic,
        albuminValue: albuminValue,
        diagnosis: diagnosis,
        hipertensi: hipertensi,
        proteinuria: proteinuria
    };
    
    console.log('💾 MENYIMPAN DATA LENGKAP:', dataToSave);
    
    // Simpan ke localStorage
    let savedData = JSON.parse(localStorage.getItem('preeclampsiaData')) || [];
    savedData.push(dataToSave);
    localStorage.setItem('preeclampsiaData', JSON.stringify(savedData));
    
    // Kirim ke SheetDB
    const saveBtn = document.getElementById('save-data-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    
    const success = await saveToSpreadsheet(dataToSave);
    
    if (success) {
        alert(`✅ DATA TERSIMPAN:\n
Nama: ${patientName}
Usia: ${gestationalAge} minggu
Berat: ${weight} kg
Tinggi: ${height} cm
IMT: ${bmi}
Tekanan: ${systolic}/${diastolic} mmHg
Albumin: ${albuminValue} mg/dL
Diagnosis: ${diagnosis}`);
    } else {
        alert(`⚠️ DATA TERSIMPAN LOKAL:\n
Nama: ${patientName}
Usia: ${gestationalAge} minggu
Berat: ${weight} kg
Tinggi: ${height} cm
IMT: ${bmi}
Tekanan: ${systolic}/${diastolic} mmHg
Albumin: ${albuminValue} mg/dL
Diagnosis: ${diagnosis}
\n(Cloud bermasalah)`);
    }
    
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Data';
    updateDataCounter();
}

/// ========== SIMPAN KE SHEETDB (DENGAN BERAT & TINGGI) ==========
async function saveToSpreadsheet(data) {
    const SHEETDB_URL = 'https://sheetdb.io/api/v1/eyegrdjma1gmw'; // GANTI URL ANDA!
    
    try {
        // Format data dengan kolom BARU
        const rowData = {
            timestamp: new Date().toLocaleString('id-ID'),
            nama: data.patientName,
            usia: String(data.gestationalAge),
            berat: String(data.weight || '0'),
            tinggi: String(data.height || '0'),
            imt: String(data.bmi || '0'),
            sistolik: String(data.systolic),
            diastolik: String(data.diastolic),
            albumin: String(data.albuminValue),
            diagnosis: data.diagnosis,
            hipertensi: data.hipertensi ? 'Ya' : 'Tidak',
            proteinuria: data.proteinuria ? 'Ya' : 'Tidak'
        };
        
        console.log('📤 MENGIRIM KE SHEETDB:', rowData);
        
        const response = await fetch(SHEETDB_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([rowData])
        });
        
        const result = await response.json();
        console.log('✅ RESPONSE SHEETDB:', result);
        return true;
        
    } catch (error) {
        console.error('❌ GAGAL KIRIM KE SHEETDB:', error);
        return false;
    }
}

// ========== LIHAT DATA ==========
function viewData() {
    const savedData = JSON.parse(localStorage.getItem('preeclampsiaData')) || [];
    
    if (savedData.length === 0) {
        alert('📭 Belum ada data tersimpan');
        return;
    }
    
    let message = '📊 DATA TERSIMPAN:\n\n';
    savedData.slice(-5).reverse().forEach((d, i) => {
        message += `${i+1}. ${d.patientName}: ${d.diagnosis}\n`;
        message += `   ${d.systolic}/${d.diastolic} mmHg | ${d.albuminValue} mg/dL\n\n`;
    });
    message += `Total: ${savedData.length} data\nLihat detail di Console (F12)`;
    
    alert(message);
    console.log('Semua data:', savedData);
}

// ========== EXPORT CSV ==========
function exportData() {
    const savedData = JSON.parse(localStorage.getItem('preeclampsiaData')) || [];
    
    if (savedData.length === 0) {
        alert('📭 Tidak ada data untuk diexport');
        return;
    }
    
    const headers = ['Nama','Usia','Sistolik','Diastolik','Albumin','Diagnosis','Waktu'];
    const rows = [headers.join(',')];
    
    savedData.forEach(d => {
        rows.push(`"${d.patientName}",${d.gestationalAge},${d.systolic},${d.diastolic},${d.albuminValue},"${d.diagnosis}","${d.saveTime}"`);
    });
    
    const blob = new Blob([rows.join('\n')], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preeclampsia-data-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ========== RESET FORM ==========
function resetForm() {
    if (confirm('Reset semua data input?')) {
        document.getElementById('patient-name').value = '';
        document.getElementById('patient-age').value = '';
        document.getElementById('systolic').value = '';
        document.getElementById('diastolic').value = '';
        removeImage();
        
        // Reset hasil
        setText('result-name', '-');
        setText('result-age', '- minggu');
        setText('result-pressure', '-/- mmHg');
        setText('result-albumin', '- mg/dL');
        setText('result-pressure-status', '-');
        setText('result-albumin-status', '-');
        setText('status-title', 'Menunggu Analisis');
        setText('status-desc', 'Masukkan data dan klik Analisis');
        setText('recommendation-text', 'Klik Analisis untuk melihat hasil');
        
        const statusIcon = document.querySelector('#result-status .status-icon i');
        if (statusIcon) {
            statusIcon.className = 'fas fa-question-circle';
            statusIcon.style.color = '';
        }
        
        currentAnalysisData = null;
        document.getElementById('save-data-btn').disabled = true;
    }
}

// ========== UPDATE COUNTER ==========
function updateDataCounter() {
    const savedData = JSON.parse(localStorage.getItem('preeclampsiaData')) || [];
    const counter = document.getElementById('data-counter');
    if (counter) {
        counter.textContent = savedData.length;
    }
}

// ========== CEK KONEKSI ==========
async function checkConnection() {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;
    
    const icon = statusEl.querySelector('i');
    const text = statusEl.querySelector('span');
    
    if (navigator.onLine) {
        statusEl.className = 'connection-status online';
        icon.className = 'fas fa-cloud';
        text.textContent = 'Tersimpan di Cloud & Lokal';
    } else {
        statusEl.className = 'connection-status offline';
        icon.className = 'fas fa-cloud-offline';
        text.textContent = 'Mode Offline (Data Lokal)';
    }
}

 // ========== FUNGSI POPUP PANDUAN ==========
    
    // Cek apakah panduan sudah pernah ditampilkan
    function isGuideShown() {
        return localStorage.getItem('guideShown') === 'true';
    }
    
    // Sembunyikan modal
    function hideGuide() {
        const modal = document.getElementById('guideModal');
        modal.classList.add('hidden');
        localStorage.setItem('guideShown', 'true');
    }
    
    // Tampilkan modal (panggil jika ingin manual)
    function showGuide() {
        const modal = document.getElementById('guideModal');
        modal.classList.remove('hidden');
    }
    
    // Reset status panduan (agar muncul lagi - untuk testing)
    function resetGuide() {
        localStorage.removeItem('guideShown');
        showGuide();
    }
    
    // Event listener untuk tombol
    document.getElementById('startAppBtn').addEventListener('click', function() {
        hideGuide();
        // Setelah tutup, bisa arahkan ke halaman login atau konten utama
        // Contoh: window.location.href = 'login.html';
        console.log('Panduan ditutup, lanjut ke aplikasi');
    });
    
    document.getElementById('skipGuideBtn').addEventListener('click', function() {
        hideGuide();
        console.log('Panduan dilewati');
    });
    
    // Inisialisasi: tampilkan panduan hanya jika belum pernah dilihat
    if (!isGuideShown()) {
        // Tampilkan modal
        document.getElementById('guideModal').classList.remove('hidden');
    } else {
        document.getElementById('guideModal').classList.add('hidden');
    }

// Inisialisasi popup panduan
document.addEventListener('DOMContentLoaded', function() {
    const guideModal = document.getElementById('guideModal');
    const startBtn = document.getElementById('startAppBtn');
    const skipBtn = document.getElementById('skipGuideBtn');
    
    function hideGuide() {
        guideModal.classList.add('hidden');
        localStorage.setItem('guideShown', 'true');
    }
    
    function showGuide() {
        if (!localStorage.getItem('guideShown')) {
            guideModal.classList.remove('hidden');
        }
    }
    
    if (startBtn) startBtn.addEventListener('click', hideGuide);
    if (skipBtn) skipBtn.addEventListener('click', hideGuide);
    
    showGuide();
});

// ========== CEK KONEKSI SETIAP 30 DETIK ==========
setInterval(checkConnection, 30000);

// ========== PANGGIL UPDATE COUNTER ==========
updateDataCounter();

