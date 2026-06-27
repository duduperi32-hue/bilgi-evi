/* =============================================
   BilgiEvi — Firebase Realtime DB Entegrasyonu
   ============================================= */

// BURAYA KENDİ FİREBASE BİLGİLERİNİ GİRMELİSİN
// Firebase Console -> Proje Ayarları -> Web Uygulaması Ekle kısmından alabilirsin.
const firebaseConfig = {
  apiKey: "BURAYA_API_KEY_GELECEK",
  authDomain: "BURAYA_AUTH_DOMAIN_GELECEK",
  databaseURL: "BURAYA_DATABASE_URL_GELECEK",
  projectId: "BURAYA_PROJECT_ID_GELECEK",
  storageBucket: "BURAYA_STORAGE_BUCKET_GELECEK",
  messagingSenderId: "BURAYA_SENDER_ID_GELECEK",
  appId: "BURAYA_APP_ID_GELECEK"
};

const FirebaseDB = {
  isConfigured: false,
  db: null,

  init() {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "BURAYA_API_KEY_GELECEK") {
      try {
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.database();
        this.isConfigured = true;
        console.log("Firebase bağlantısı başarılı!");
      } catch (e) {
        console.error("Firebase başlatılamadı:", e);
      }
    } else {
      console.warn("⚠️ Firebase ayarlanmadı! Skor tablosu 'Multiplayer' olarak DEĞİL, sadece bu cihazda yerel olarak çalışacak.");
    }
  },

  // Tüm kullanıcıları dinle ve `app.js` tarafına ilet
  listenUsers(callback) {
    if (!this.isConfigured) return; // Ayarlı değilse sessizce dön
    
    const usersRef = this.db.ref('users');
    usersRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Object to Array
        const userList = Object.values(data);
        callback(userList);
      }
    });
  },

  // Bir kullanıcının profilini veya puanını güncelle/ekle
  saveUser(userObj) {
    if (!this.isConfigured) return;
    
    // E-posta adresini Firebase key olarak kullanmak için güvenli hale getiriyoruz
    // (Firebase anahtarları '.', '#', '$', '[', veya ']' içeremez)
    const safeKey = userObj.email.replace(/[.#$[\]]/g, '_');
    
    const usersRef = this.db.ref('users/' + safeKey);
    usersRef.set(userObj);
  }
};

// Sayfa yüklendiğinde başlat
window.addEventListener('DOMContentLoaded', () => {
  FirebaseDB.init();
});
