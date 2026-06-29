export async function uploadToS3(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    // 1. Get presigned URL from backend
    const res = await fetch("/api/upload/presigned", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    const data = await res.json();
    
    if (!data.success) {
      return { success: false, message: data.message || "Failed to generate upload URL" };
    }

    // 2. Upload file directly to AWS S3 using PUT
    const uploadRes = await fetch(data.presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      return { success: false, message: "Failed to upload file to AWS S3" };
    }

    // 3. Return the final public URL
    return { success: true, url: data.finalUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Network error during upload" };
  }
}
