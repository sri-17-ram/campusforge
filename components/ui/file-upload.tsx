'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText, Image as ImageIcon, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react'
import { Button } from './button'

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept: string;
  maxSizeMB: number;
  label?: string;
  uploading?: boolean;
  progress?: number;
  success?: boolean;
  error?: string | null;
  onRetry?: () => void;
  previewUrl?: string | null;
}

export function FileUpload({
  onFileSelect,
  accept,
  maxSizeMB,
  label = "Upload File",
  uploading = false,
  progress = 0,
  success = false,
  error = null,
  onRetry,
  previewUrl = null
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(previewUrl)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const validateFile = (file: File): boolean => {
    setLocalError(null)
    
    // Check extension for executable bypass
    const invalidExt = ['.exe', '.bat', '.sh', '.js']
    if (invalidExt.some(ext => file.name.toLowerCase().endsWith(ext))) {
      setLocalError("Executable or script files are strictly prohibited.")
      return false
    }

    // Check Max Size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size exceeds the ${maxSizeMB}MB limit.`)
      return false
    }

    return true
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        processFile(file)
      }
    }
  }, [maxSizeMB])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        processFile(file)
      }
    }
  }

  const processFile = (file: File) => {
    setSelectedFile(file)
    onFileSelect(file)
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setLocalPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setLocalPreview(null)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setLocalPreview(null)
    setLocalError(null)
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="w-full space-y-4">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      
      {/* Upload Zone */}
      {!selectedFile && !previewUrl && !success && (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${
            dragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50 hover:bg-muted/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
            disabled={uploading}
          />
          <div className="p-4 bg-muted/50 rounded-full mb-4">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Click to upload or drag and drop</h3>
          <p className="text-xs text-muted-foreground">
            {accept === "image/*" ? "SVG, PNG, JPG or WEBP" : accept.includes('zip') ? "ZIP, RAR, PDF, DOCX, PPTX (Max " + maxSizeMB + "MB)" : "PDF, PNG, JPG (Max " + maxSizeMB + "MB)"}
          </p>
        </div>
      )}

      {/* Error Message */}
      {(localError || error) && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{localError || error}</span>
          {onRetry && (
            <Button variant="ghost" size="sm" onClick={onRetry} className="ml-auto h-6 px-2 text-destructive hover:bg-destructive/20">
              <RefreshCw className="w-3 h-3 mr-1" /> Retry
            </Button>
          )}
        </div>
      )}

      {/* Selected File State */}
      {(selectedFile || previewUrl) && !success && (
        <div className="relative border rounded-xl overflow-hidden bg-card">
          {/* Image Preview */}
          {(localPreview || (previewUrl && accept.includes('image'))) ? (
            <div className="relative aspect-video w-full bg-muted/20">
              <img src={localPreview || previewUrl || ''} alt="Preview" className="w-full h-full object-cover" />
              {!uploading && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full backdrop-blur-sm shadow-sm transition-colors"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              )}
            </div>
          ) : (
            /* Document Preview */
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {selectedFile?.name || "Uploaded Document.pdf"}
                  </p>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          )}

          {/* Uploading State */}
          {uploading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <div className="w-full max-w-xs space-y-2 text-center">
                <p className="text-sm font-medium text-foreground">Uploading...</p>
                {progress > 0 && (
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {success && (
        <div className="p-6 border border-emerald-500/30 bg-emerald-500/10 rounded-xl flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
          <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">Upload Complete!</h3>
          <Button variant="outline" size="sm" onClick={removeFile} className="mt-4">
            Upload Another
          </Button>
        </div>
      )}
    </div>
  )
}
