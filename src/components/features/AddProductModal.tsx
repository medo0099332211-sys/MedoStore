const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const saved: Product = {
      id: product?.id || generateId(),
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      price: Number(form.price),
      image: form.image,
      colors: parseList(form.colorsInput),
      sizes: parseList(form.sizesInput),
      descriptionAr: form.descriptionAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      createdAt: product?.createdAt || Date.now(),
    };

    // إضافة سطر للتأكد من تحديث الحالة فوراً
    console.log("Saving product...", saved); 
    onSave(saved);
  };
