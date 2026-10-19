# บัญชีรายเดือน — Android

แอป Android แบบ hybrid: หน้าจอ HTML/CSS/JavaScript อยู่ใน APK, Google authorization และการเรียก API ทำใน Android โดย token ไม่ส่งเข้า JavaScript ใช้หน้าตาและการคำนวณจากเว็บรุ่น 7

## สถานะ
- ซอร์สและ workflow สำหรับสร้าง APK ทดสอบ; ยังไม่ถือว่าทดสอบบนโทรศัพท์จริงแล้ว
- ต้องตั้ง Android OAuth client ใน Cloud project เดียวกับ Apps Script และ deploy เป็น API executable ก่อนใช้ข้อมูลจริง
- ต้องอนุญาต Google บนโทรศัพท์ ไม่มี password หรือ API key ในโค้ด
- API_DEPLOYMENT_ID เป็น GitHub Actions variable ระบุ ID ของ API executable (ไม่ใช่ URL เว็บ /exec)
- Build ที่ไม่ตั้ง ID แสดงหน้าว่ายังไม่ตั้งค่าการเชื่อมต่อ ไม่บันทึกข้อมูลจำลอง
- Debug signing key สร้างใหม่ต่อ runner; ต้องลงทะเบียน SHA-1 ของ APK ที่ทดสอบ และถอนติดตั้งก่อนลง build ที่ใช้ key ต่างกัน ห้ามใช้เป็นคีย์เผยแพร่จริง

## การสร้าง
JDK 17, Android SDK 35, Gradle 8.11.1: gradle :app:assembleDebug :app:lintDebug -PapiDeploymentId=ID
GitHub Actions → Build Android APK → Artifacts → monthly-finance-android-test

## ตั้ง Google
1. ใช้ Cloud project เดียวกันทั้ง Apps Script และ Android OAuth; เปิด Apps Script API
2. Android OAuth: package th.monthlyfinance.app, SHA-1 จาก signing-fingerprint.txt ของ build ที่จะติดตั้ง
3. เพิ่ม backend/Android.gs และปรับ installTrigger_ ใน Code.gs ตาม backend/Code.gs (รักษา UserProperties และฐานข้อมูลเดิม)
4. Deploy → API executable → ตั้งผู้เข้าถึงตามกลุ่มทดสอบ และตั้ง API_DEPLOYMENT_ID
5. ผู้ใช้กดอนุญาตด้วยบัญชีของตัวเอง ทดสอบบัญชี A/B ว่าไม่เห็นข้อมูลข้ามกันก่อนเผยแพร่

## ข้อจำกัด
ต้องออนไลน์เพื่ออ่าน/เขียน; ไม่มีฐานข้อมูล offline หรือ push background; ไม่มี Claude/OCR; รองรับแนบรูปและกรอกเอง
Apps Script API สร้าง trigger ไม่ได้: Android ตรวจรายการประจำเมื่อโหลดข้อมูล หากต้องการทำทุกวันขณะปิดแอปให้ตั้ง trigger ผ่านเว็บเดิม
ยังต้องทดสอบ Google authorization, ความเป็นเจ้าของ Sheets, การแนบรูป/ส่งออก และการกลับเข้าแอปบนอุปกรณ์จริง
OAuth อาจต้อง Google verification ก่อนเปิดให้คนทั่วไป; APK ทดสอบยังไม่ใช่ Play Store release

## ความเป็นส่วนตัว
เก็บข้อมูลใน Sheets/Drive ตามบัญชีผู้ใช้; ไม่ส่งข้อมูลการเงินไป GitHub; ไม่บันทึก token ลงไฟล์หรือส่งให้หน้าเว็บ; APK ปิด Android backup
โค้ด backend ใช้สิทธิ์ Drive และ Sheets ตามเว็บเดิม ผู้ใช้ควรอ่านหน้าความยินยอม Google ก่อนอนุญาต

## ทดสอบก่อนใช้งานจริง
ทดสอบด้วยรายการจำลองในบัญชีทดสอบ: สร้าง/แก้/ลบรายการ, จ่ายหนี้บางส่วน/งวดสุดท้าย, กรองประเภทหนี้, งบ, โหลดซ้ำหลังเครือข่ายขาด, การส่งออก JSON/CSV, รูปโปรไฟล์, สลิปหลายรูป และการแยกผู้ใช้สองบัญชี
