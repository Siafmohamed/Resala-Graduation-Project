# 🐛 Bug Fix: draggingIcon Error Resolution

## Problem

The error `ReferenceError: draggingIcon is not defined` occurs because the AddModal component has mixed old and new code. The old icon file upload code references variables that no longer exist:
- `draggingIcon`
- `iconPreview`
- `iconRef`
- `setDraggingIcon`
- `setIconPreview`
- `setIconFile`
- `readFile` function

## ✅ What Was Fixed in AddModal

The AddModal component has been successfully updated with:

1. ✅ **Removed** all icon file upload code
2. ✅ **Replaced** with IconPicker component
3. ✅ **Added** Cloudinary upload function
4. ✅ **Updated** handleSubmit to upload images before submission
5. ✅ **Fixed** handleDrop to only handle images (no 'type' parameter)

## 🔧 What Still Needs Fixing: EditModal

The EditModal component (starting around line 418) also needs the same updates. Here's what to change:

### Changes Needed in EditModal:

#### 1. Update State Variables (around line 430-450)

**REMOVE:**
```typescript
const [iconFile, setIconFile] = useState<File | null>(null);
const [iconPreview, setIconPreview] = useState<string | null>(null);
const [draggingIcon, setDraggingIcon] = useState(false);
const iconRef = useRef<HTMLInputElement>(null);
```

**KEEP:**
```typescript
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [draggingImg, setDraggingImg] = useState(false);
const imgRef = useRef<HTMLInputElement>(null);
// Add these:
const [imageUrl, setImageUrl] = useState<string>(data.imageUrl || "");
const [icon, setIcon] = useState<string>(data.icon || "");
const [isUploading, setIsUploading] = useState(false);
```

#### 2. Update File Handling Functions

**REPLACE** the `validateFile` and `readFile` functions with:

```typescript
const validateImageFile = (file: File) => {
  const MAX_SIZE = 5 * 1024 * 1024;
  setError(null);

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    setError("عذراً، الامتداد غير مسموح به (JPG, PNG, WebP).");
    return false;
  }

  if (file.size > MAX_SIZE) {
    setError("حجم الملف يتجاوز 5 ميجا.");
    return false;
  }
  return true;
};

const handleImageSelect = (file: File) => {
  if (!validateImageFile(file)) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    setImagePreview(e.target?.result as string);
    setImageFile(file);
  };
  reader.readAsDataURL(file);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setDraggingImg(false);
  
  const file = e.dataTransfer.files[0];
  if (file) handleImageSelect(file);
};

const uploadImageToCloudinary = async () => {
  if (!imageFile) return null;
  
  setIsUploading(true);
  setError(null);
  
  try {
    const url = await uploadToCloudinary(imageFile, 'resala-sponsorships');
    setImageUrl(url);
    return url;
  } catch (err: any) {
    setError(err.message || 'فشل رفع الصورة');
    return null;
  } finally {
    setIsUploading(false);
  }
};
```

#### 3. Update handleSubmit

**REPLACE:**
```typescript
const handleSubmit = () => {
  // old code
}
```

**WITH:**
```typescript
const handleSubmit = async () => {
  if (!title.trim()) {
    setError("يرجى إدخال العنوان");
    return;
  }

  // Upload image if changed
  let finalImageUrl = imageUrl;
  if (imageFile && !imageUrl) {
    finalImageUrl = await uploadImageToCloudinary() || '';
  }

  if (urgent) {
    const payload = {
      title,
      description,
      imageUrl: finalImageUrl || undefined,
      targetAmount,
      // ... other fields
    };
    onSave(data.id, payload);
  } else {
    const payload = {
      name: title,
      description,
      imageUrl: finalImageUrl || undefined,
      icon: icon || undefined,
      targetAmount,
      // ... other fields
    };
    onSave(data.id, payload);
  }
};
```

#### 4. Update UI - Image Upload Section (around line 594-622)

**FIND:**
```typescript
onDrop={(e) => handleDrop(e, 'image')}
```

**REPLACE WITH:**
```typescript
onDrop={handleDrop}
```

**AND FIND:**
```typescript
<input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, 'image'); }} />
```

**REPLACE WITH:**
```typescript
<input ref={imgRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }} />
{isUploading && (
  <div className="flex items-center gap-2 text-sm text-[#00549A] font-[Cairo]">
    <Loader2 size={16} className="animate-spin" />
    جاري رفع الصورة إلى Cloudinary...
  </div>
)}
```

#### 5. Update UI - Icon Section (around line 624-655)

**REMOVE THIS ENTIRE BLOCK:**
```typescript
{!urgent && (
  <div className="space-y-2">
    <label className="text-sm font-bold text-[#495565] font-[Cairo]">الأيقونة (SVG)</label>
    <div className="...">
      {/* Old icon upload UI */}
    </div>
    <input ref={iconRef} type="file" accept=".svg,image/svg+xml" className="hidden" />
  </div>
)}
```

**REPLACE WITH:**
```typescript
{!urgent && (
  <IconPicker
    value={icon}
    onChange={setIcon}
    label="أيقونة البرنامج"
  />
)}
```

#### 6. Update Submit Button

**FIND:**
```typescript
<button onClick={handleSubmit} disabled={isSubmitting}>
```

**REPLACE WITH:**
```typescript
<button onClick={handleSubmit} disabled={isSubmitting || isUploading}>
```

**AND FIND:**
```typescript
{isSubmitting ? (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
) : (
```

**REPLACE WITH:**
```typescript
{isSubmitting || isUploading ? (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
) : (
```

## 📝 Summary

### AddModal Status: ✅ FIXED
- All references to old icon upload removed
- Cloudinary upload integrated
- IconPicker component added
- handleSubmit properly uploads images

### EditModal Status: ⚠️ NEEDS MANUAL FIX
Follow the steps above to update the EditModal component with the same changes.

### Why Both Need Fixing:
Both AddModal and EditModal had the same file upload implementation. Since we're moving to:
- Cloudinary for images (URL only to backend)
- IconPicker for icons (string value only to backend)

Both modals need to be updated consistently.

## 🧪 Testing After Fix

1. **Test Add Modal:**
   - Open "إضافة كفالة جديدة"
   - Select an image
   - Choose an icon from dropdown
   - Submit → Should upload to Cloudinary first

2. **Test Edit Modal:**
   - Click edit on existing sponsorship
   - Change image
   - Change icon
   - Submit → Should upload new image to Cloudinary

3. **Test Urgent Cases:**
   - Open "إضافة حالة حرجة"
   - Select an image
   - Submit → Should upload to Cloudinary
   - Note: No icon picker for urgent cases (only regular sponsorships)

## 🚀 Quick Fix Command

If you want me to apply these changes automatically, let me know and I'll update the EditModal section as well!
