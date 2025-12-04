# Dokumentasi Sistem Deteksi Crowd Fatigue

## Daftar Isi
1. [Ringkasan Proyek](#ringkasan-proyek)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Komponen Utama](#komponen-utama)
4. [Instalasi dan Setup](#instalasi-dan-setup)
5. [Penggunaan](#penggunaan)
6. [API Documentation](#api-documentation)
7. [Konfigurasi](#konfigurasi)
8. [Troubleshooting](#troubleshooting)
9. [Teknologi yang Digunakan](#teknologi-yang-digunakan)

---

## Ringkasan Proyek

Sistem Deteksi Crowd Fatigue adalah aplikasi web real-time yang menggunakan teknologi AI untuk mendeteksi:
- **Crowd Detection**: Deteksi kepadatan crowds di area tertentu
- **Fatigue Detection**: Deteksi tingkat kelelahan pada individu
- **Face Recognition**: Pengenalan wajah untuk identifikasi pengguna

Sistem ini menggunakan arsitektur microservices dengan komunikasi real-time melalui MQTT dan Socket.IO.

### Fitur Utama
- 🔍 Deteksi real-time crowd dan fatigue
- 👤 Sistem autentikasi dan autorisasi
- 📊 Dashboard monitoring
- 🏢 Manajemen area dan kapasitas
- 📱 Interface web responsif
- 🔄 Komunikasi real-time

---

## Arsitektur Sistem

### Diagram Arsitektur Sistem

![Sequence Diagram](cnfd_flowchart.png)

### Komponen Arsitektur

#### 1. **User Interface Layer**
- **Frontend Application**: React 18 dengan TypeScript dan Chakra UI
- **HTTP Client**: Axios untuk REST API calls (authentication, CRUD operations)
- **Real-time Client**: Socket.IO client untuk bidirectional communication dengan backend
- **Dashboard Monitoring**: Visualisasi data real-time crowd dan fatigue
- **User Management**: Interface untuk registrasi, login, dan profil management

#### 2. **API & Real-time Layer**
- **Backend Server**: Node.js/Express.js dengan Socket.IO server
- **REST Endpoints**: API routes untuk CRUD operations (users, areas, crowds, fatigues)
- **Authentication Service**: JWT tokens dengan bcrypt password hashing
- **Business Logic**: Controllers untuk crowd detection, fatigue detection, dan user management
- **Real-time Handler**: Socket.IO event handlers untuk real-time communication dengan frontend
- **Database ORM**: Prisma sebagai database abstraction layer
- **File Upload**: Multer untuk handling face image uploads

#### 3. **AI Processing Layer**
- **AI Engine**: Python Flask microservice dengan YOLOv11, OpenVINO optimization
- **Face Detection**: SCRFD untuk deteksi wajah real-time
- **Face Recognition**: ArcFace untuk identifikasi pengguna
- **Crowd Detection**: YOLOv11 dengan optimasi OpenVINO untuk deteksi kepadatan
- **Fatigue Detection**: Model AI khusus untuk deteksi tingkat kelelahan
- **Object Tracking**: ByteTracker untuk tracking objek bergerak

#### 4. **Data Storage Layer**
- **Primary Database**: PostgreSQL 16 dengan Prisma ORM
- **User Data**: Profile, credentials, dan security answers
- **Area Management**: Data area monitoring dengan kapasitas
- **Detection Results**: Historical data crowd dan fatigue detection
- **Face Features**: Encoded face features untuk recognition

#### 5. **Communication Layer**
- **Message Broker**: MQTT (HiveMQ/cloud atau local broker)
- **Real-time Messaging**: Publish/subscribe pattern untuk frame dan results
- **WebSocket**: Socket.IO untuk real-time UI updates

### Data Flow & Communication

#### Flow 1: User Authentication & CRUD Operations
```
Frontend (Axios/REST) → Backend API → JWT Verification → PostgreSQL → JSON Response
```

#### Flow 2: Crowd Detection Real-time Processing
```
Camera Stream → Frontend → Socket.IO → Backend → MQTT → AI Engine →
Processing Results → MQTT → Backend → Socket.IO → Frontend → UI Update
```

#### Flow 3: Fatigue Detection Real-time Processing
```
Camera Stream → Frontend → Socket.IO → Backend → MQTT → AI Engine →
Face Recognition + Fatigue Analysis → MQTT → Backend → Socket.IO → Frontend → UI Update
```

#### Flow 4: Real-time Updates
```
AI Engine → MQTT → Backend → Socket.IO → Frontend → UI Update
```
### Technology Stack

- **Frontend**: React 18, TypeScript, Chakra UI, Socket.IO Client, Axios (HTTP client)
- **Backend**: Node.js, Express.js, Prisma, PostgreSQL, Socket.IO Server, MQTT Client, JWT
- **AI Engine**: Python 3.9, Flask, PyTorch, OpenVINO, YOLOv11, OpenCV, MQTT Client
- **Communication**:
  - **REST APIs**: Axios/Express untuk CRUD operations (login, register, data management)
  - **Socket.IO**: Bidirectional real-time communication (AI processing results)
  - **MQTT**: Publish/subscribe pattern untuk inter-service communication
- **Database**: PostgreSQL 16, Prisma ORM
- **Process Management**: PM2 untuk production deployment

---

## Komponen Utama

### 1. AI Engine (`ai-engine/`)
Microservice Python yang menangani semua proses AI:

#### Model AI yang Digunakan:
- **YOLOv11**: Untuk deteksi objek (crowd dan fatigue)
- **OpenVINO**: Optimasi model untuk inferensi yang lebih cepat
- **SCRFD**: Face detection
- **ArcFace**: Face recognition
- **ByteTracker**: Object tracking

#### Fitur AI:
- `crowd_detector.py`: Deteksi kepadatan crowds
- `fatigue_detector.py`: Deteksi tingkat kelelahan
- `face_recognition/`: Sistem pengenalan wajah
- `face_tracking/`: Pelacakan objek bergerak

### 2. Backend (`backend/`)
API server Node.js yang mengatur:

#### Controllers:
- `AuthController.js`: Autentikasi dan autorisasi
- `UserController.js`: Manajemen user
- `AreaController.js`: Manajemen area
- `CrowdController.js`: Data crowd detection
- `FatigueController.js`: Data fatigue detection

#### Models:
- `UserModel.js`: Model user
- `AreaModel.js`: Model area
- `CrowdModel.js`: Model data crowd
- `FatigueModel.js`: Model data fatigue

#### Middleware:
- `authenticateJWT.js`: Middleware autentikasi JWT
- `checkAdmin.js`: Middleware check role admin
- `uploadPhotosMiddleware.js`: Middleware upload foto

### 3. Frontend (`frontend/`)
Aplikasi web React dengan fitur:

#### Halaman Utama:
- Dashboard monitoring
- Crowd Detection interface
- Fatigue Detection interface
- User management (admin only)
- Profile management

#### Hooks Custom:
- `useAuth.ts`: Hook untuk autentikasi
- `useUser.ts`: Hook untuk data user
- `useArea.ts`: Hook untuk data area
- `useCrowd.ts`: Hook untuk data crowd
- `useFatigue.ts`: Hook untuk data fatigue

---

## Instalasi dan Setup

### Prasyarat
- Node.js = v24.11.1 
- Python = v3.9.25
- PostgreSQL = v16.3
- Anaconda/Miniconda (untuk environment Python) 

### 1. Clone Repositori
```
git clone --recurse-submodules Crowd-Fatigue_detection_web_full
```

### 2. Setup Database
```sql
-- Buat database PostgreSQL
CREATE DATABASE comvis;

-- Buat user (opsional)
CREATE USER postgres WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE comvis TO postgres;
```

### 3. Setup AI Engine
```bash
# Masuk ke direktori ai-engine
cd ai-engine

# Buat environment conda
conda create -n cnfd python=3.9
conda activate cnfd

# Install dependencies
pip install -r requirements.txt
```

### 4. Setup Backend
```bash
# Masuk ke direktori backend
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env sesuai konfigurasi Anda

# Generate Prisma client
npx prisma generate

# Jalankan migrasi database
npx prisma db push

# Buat admin user
npm run create-admin
```

### 5. Setup Frontend
```bash
# Masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.development .env
# Edit .env sesuai konfigurasi Anda
```

### 6. Jalankan Semua Services
```bash
# Method 1: Menggunakan PM2 (recommended)
pm2 start ecosystem.config.js

# Method 2: Manual (di terminal terpisah)
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - AI Engine
cd ai-engine && python app.py

# Terminal 3 - Frontend
cd frontend && npm run dev
```

---

## Penggunaan

### 1. Akses Aplikasi
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **AI Service**: http://localhost:5000/health

### 2. Login
Gunakan credentials yang dibuat saat setup admin:
- Email: admin@example.com
- Password: admin123

### 3. Penggunaan Fitur

#### Crowd Detection
1. Buat area baru dengan kapasitas tertentu
2. Camera real-time
3. Sistem akan mendeteksi jumlah orang dan status kepadatan
4. Data tersimpan otomatis ke database

#### Fatigue Detection
1. Buka halaman Fatigue Detection
2. Sistem akan melakukan face recognition terlebih dahulu
3. Jika wajah dikenal, akan lanjut ke deteksi fatigue
4. Status fatigue akan muncul real-time

#### Face Recognition
1. Upload foto wajah saat registrasi
2. Sistem akan mengenali wajah secara otomatis
3. Hanya satu orang yang boleh terdeteksi untuk fatigue detection

---

## API Documentation

### Authentication Endpoints

#### POST `/login`
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/register`
Registrasi user baru
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user",
  "security_answer": "answer"
}
```

### User Management Endpoints

#### GET `/users/profile`
Get profile user yang sedang login

#### PATCH `/users/profile`
Update profile user

### Area Management Endpoints

#### GET `/areas`
Get semua area

#### POST `/areas`
Create area baru
```json
{
  "name": "Area A",
  "capacity": 100,
  "user_id": "user_id"
}
```

#### PUT `/areas/:id`
Update area

#### DELETE `/areas/:id`
Delete area

### Crowd Detection Endpoints

#### GET `/crowds`
Get semua data crowd

#### POST `/crowds`
Save data crowd detection

#### GET `/crowds/:area_id`
Get data crowd untuk area tertentu

### Fatigue Detection Endpoints

#### GET `/fatigues`
Get semua data fatigue

#### POST `/fatigues`
Save data fatigue detection

#### GET `/fatigues/users/:user_id`
Get data fatigue untuk user tertentu

---

## Konfigurasi

### Environment Variables

#### Backend (.env)
```env
PORT=4000
JWT_SECRET=your_super_secret_jwt_key_here
DATABASE_URL=postgresql://postgres:123456@localhost:5432/comvis
MQTT_BROKER=mqtt://broker.hivemq.com:1883
MQTT_PORT=1883
```

#### Frontend (.env)
```env
VITE_APP_API_URL=http://localhost:4000
VITE_APP_SOCKET_URL=ws://localhost:4000
VITE_APP_BACKEND_URL=http://localhost:4000
```

#### AI Engine
AI Engine menggunakan konfigurasi dari:
- `face_tracking/config/config_tracking.yaml`
- Model weights di `face_detection/` dan `face_recognition/`

### MQTT Topics

#### Subscription Topics
- `mqtt-crowd-frame`: Frame untuk crowd detection
- `mqtt-fatigue-frame`: Frame untuk fatigue detection
- `mqtt-face-frame`: Frame untuk face recognition

#### Publication Topics
- `mqtt-crowd-result`: Hasil crowd detection
- `mqtt-fatigue-result`: Hasil fatigue detection
- `mqtt-face-result`: Hasil face recognition

---

## Troubleshooting

### 1. AI Engine Error
**Problem**: Model tidak bisa diinisialisasi
**Solution**: 
- Pastikan semua dependencies terinstall
- Check Python environment (conda)
- Verify model weights tersedia

### 2. Database Connection Error
**Problem**: Tidak bisa connect ke PostgreSQL
**Solution**:
- Pastikan PostgreSQL running
- Check DATABASE_URL di .env
- Verify user permissions

### 3. MQTT Connection Error
**Problem**: MQTT broker tidak bisa diakses
**Solution**:
- Check MQTT_BROKER URL
- Pastikan internet connection untuk HiveMQ
- Try menggunakan local MQTT broker

### 4. Frontend Build Error
**Problem**: React app tidak bisa di-build
**Solution**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version
- Verify environment variables

### 5. Face Recognition Error
**Problem**: Face tidak terdeteksi
**Solution**:
- Check kualitas gambar
- Pastikan wajah terlihat jelas
- Verify face features sudah di-training

---

## Teknologi yang Digunakan

### Frontend
- **React 18**: Framework UI
- **TypeScript**: Type safety
- **Chakra UI**: Component library
- **Vite**: Build tool
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP client
- **React Hook Form**: Form management
- **Recharts**: Data visualization

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **Socket.IO**: Real-time communication
- **MQTT**: Message broker client
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload
- **CORS**: Cross-origin resource sharing

### AI Engine
- **Python 3.9**: Programming language
- **Flask**: Web framework
- **PyTorch**: Deep learning framework
- **OpenVINO**: Model optimization
- **YOLOv11**: Object detection
- **SCRFD**: Face detection
- **ArcFace**: Face recognition
- **ByteTracker**: Object tracking
- **MQTT**: Message broker
- **OpenCV**: Computer vision

### DevOps & Tools
- **PM2**: Process manager
- **Anaconda**: Python environment management
- **Github**: Version control
- **ESLint**: Code linting

---

## Kontribusi

Untuk berkontribusi pada proyek ini:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Lisensi

Proyek ini, pada fitur face recognition menggunakan referensi source code yang dilisensikan di bawah MIT License - lihat file [LICENSE.md](ai-engine/LICENSE.md) untuk detail.

## Kontak

Untuk pertanyaan dan support, silakan hubungi tim pengembangan.

---

*Dokumentasi ini dibuat pada: 2025-12-03*
*Versi: 1.0.0*