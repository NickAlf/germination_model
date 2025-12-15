// Connect to Google Drive to fetch images
export interface DriveFile {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  webViewLink?: string
  createdTime: string
}

export async function listDriveImages(folderId: string): Promise<DriveFile[]> {
  try {
    // Using Google Drive API with the DRIVE_FOLDER_ID env var
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY

    if (!apiKey) {
      console.warn("Google Drive API key not set, returning empty list")
      return []
    }

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,mimeType,thumbnailLink,webViewLink,createdTime)&key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Drive API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.files || []
  } catch (error) {
    console.error("Failed to fetch Drive images:", error)
    return []
  }
}

export async function getDriveImageUrl(fileId: string): Promise<string> {
  // Generate a public URL for the image
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}
