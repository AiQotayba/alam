## auth

```ts
GET /api/auth
Headers:{ "token": "user_jwt_token" }
Response: { "typeUser": "admin" }
```

```ts
POST /api/auth
Body:{ "fullname": "John Doe", "phone": "+123456789", "email": "user@example.com", "password": "SecurePassword123" }
Response:{ "token": "generated_jwt_token" }
```

```ts
PUT /api/auth
Body:{ "email": "user@example.com", "password": "SecurePassword123" }
Response:{ "token": "generated_jwt_token", "typeUser": "admin" }
```

## password

### 1. التحقق من الصلاحيات (GET)

```ts
GET /api/pass
Headers: { "token": "user_jwt_token" }
Response: {
  "data": ["user", "isAdmin"] | false,
  "status": "Permissions Retrieved"
}
```

الوظيفة:

- التحقق من صحة التوكن وعرض صلاحيات المستخدم
- الصلاحيات تشمل: أدوار المستخدم، حالة الحظر، الصلاحيات الإدارية

---

### 2. تغيير كلمة المرور (POST)

```ts
POST /api/pass
Body: { "password": "NewSecurePassword123" }
Headers: { "Authorization": "Bearer user_jwt_token" }
Response: {
  "token": "new_jwt_token",
  "msg": "تم تغيير كلمة السر"
}
```

الوظيفة:

- تحديث كلمة المرور للمستخدم المسجل دخوله
- إصدار توكن جديد بعد التحديث

---

### 3. إعادة تعيين كلمة المرور (PATCH)

```ts
PATCH /api/pass
Body: { "email": "user@example.com" }
Response: {
  "msg": "تم ارسال رابط اعادة التعيين بنجاح",
  "state": true
}
```

الوظيفة:

- إرسال رابط إعادة تعيين عبر البريد الإلكتروني
- يحتوي الرابط على توكن مؤقت صالح لمرة واحدة

---

### 4. تأكيد كلمة المرور الجديدة (PUT)

```ts
PUT /api/pass
Body: {
  "password": "OldPassword123",
  "newpassword": "NewSecurePassword456"
}
Headers: { "Authorization": "Bearer user_jwt_token" }
Response: { "msg": "تم تحديث كلمة المرور" }
```

الوظيفة:

- التحقق من كلمة المرور القديمة قبل التحديث
- تطبيق التغيير بعد التحقق الناجح

---

## تحليل نقاط نهاية API لقسم إعلانات الدورات:

---

### 1. عرض جميع الإعلانات النشطة (للعملاء)

```ts
GET / api / client / course - ads;
Response: [
  {
    _id: "course_id",
    title: "اسم الدورة",
    image: "رابط الصورة",
    // ...حقول أخرى (بدون part, register, bio)
  },
];
```

**الوظيفة**:

- استرجاع جميع إعلانات الدورات المفعّلة (`display: true`).
- مُرتّبة حسب الحقل `sort`.
- **ملاحظة**: لا تُعاد الحقول الحساسة مثل `part` أو `register`.

---

### 2. عرض تفاصيل إعلان مُحدد (للعملاء)

```ts
GET /api/client/course-ads/:course_id
Response: {
  "_id": "course_id",
  "title": "اسم الدورة",
  "description": "وصف الدورة",
  "image": "رابط الصورة",
  // ...جميع الحقول (ما عدا part, register, bio)
}
```

**الوظيفة**:

- الحصول على تفاصيل كاملة لدورة محددة باستخدام `_id`.

---

### 3. إدارة الدورات (للمشرفين)

```ts
GET /api/courses
Headers: { "Authorization": "Bearer admin_token" }
Response: [
  {
    "_id": "course_id",
    "title": "اسم الدورة",
    "teacher": { "fullname": "اسم المدرب" },
    // ...جميع الحقول
  }
]
```

**الوظيفة**:

- استرجاع جميع الدورات (مخصص للمشرفين).
- تتطلب صلاحية إدارية (`admin`).

---

### 4. إدارة جلسات الدورة

#### أ. إنشاء جلسة جديدة

```ts
POST /api/courses/:course_id/session
Body: {
  "title": "اسم الجلسة",
  "time_start": "10:00",
  "date_start": "2023-10-01",
  "teacher_id": "teacher_id"
}
Response: {
  "msg": "تم اضافة الجلسة",
  "data": { ...تفاصيل الجلسة }
}
```

**الوظيفة**:

- إضافة جلسة جديدة لدورة محددة.

#### ب. حذف جلسة

```ts
DELETE /api/courses/:course_id/session?session_id=session_id
Response: { "msg": "تم حذف الجلسة" }
```

#### ج. عرض حضور الجلسة

```ts
GET /api/courses/:course_id/session?session_id=session_id
Response: {
  "session": { ...تفاصيل الجلسة },
  "attendance": [
    {
      "name": "اسم الطالب",
      "absence": false,
      "feedback": "ملاحظات المدرب"
    }
  ]
}
```

---

### 5. واجهة المعلمين

#### أ. عرض الدورات المُسندة للمعلم

```ts
GET /api/teacher
Headers: { "Authorization": "Bearer teacher_token" }
Response: [
  {
    "_id": "course_id",
    "title": "اسم الدورة",
    "image": "رابط الصورة"
  }
]
```

**الوظيفة**:

- استرجاع الدورات النشطة التي يُدرّسها المعلم.

#### ب. إضافة تقييم للطالب

```ts
PUT /api/teacher/:course_id/:session_id
Body: {
  "child_id": "student_id",
  "feedback": "أداء ممتاز",
  "absence": false
}
Response: { "msg": "تم اضافة الحضور [اسم الطالب]" }
```

---

### 6. واجهة العائلات

#### أ. عرض بيانات الأطفال المُسجلين

```ts
GET /api/family
Headers: { "Authorization": "Bearer family_token" }
Response: {
  "childs": [ { "name": "اسم الطفل", "age": 8 } ],
  "coins": 150, // النقاط المتاحة
  "attendants": [ ...قائمة الحضور ]
}
```

#### ب. تفاصيل دورة الطفل

```ts
GET /api/family/:child_id/:course_id
Response: {
  "course": { "title": "اسم الدورة", "teacher": "اسم المدرب" },
  "attendants": [ ...حضور الطفل في الجلسات ]
}
```

--- 