"use client";

import { FileUpload } from "@ark-ui/react";
import { FiUpload, FiTrash2, FiFileText } from "react-icons/fi";
import { Attachment } from "./CourseAttachmentsList";

interface CourseFileUploaderProps {
  attachments: Attachment[];
  uploading: boolean;
  onFileUpload: (files: File[]) => void;
  onRemoveAttachment: (index: number) => void;
}

export function CourseFileUploader({
  attachments,
  uploading,
  onFileUpload,
  onRemoveAttachment,
}: CourseFileUploaderProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Course Materials & File Upload</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ark UI FileUpload primitive. Upload PDF notes, slides, or lab worksheets.
          </p>
        </div>
        {uploading && (
          <span className="text-xs text-sky-400 font-medium animate-pulse">
            Uploading to server...
          </span>
        )}
      </div>

      <FileUpload.Root
        maxFiles={5}
        onFileAccept={(details) => onFileUpload(details.files)}
        className="w-full"
      >
        <FileUpload.Dropzone className="border border-dashed border-slate-700 hover:border-sky-500 rounded p-6 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition flex flex-col items-center justify-center space-y-2">
          <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded">
            <FiUpload className="w-5 h-5" />
          </div>
          <div className="text-xs font-medium text-slate-200">
            Drag and drop course files here, or click to browse
          </div>
          <p className="text-[10px] text-slate-500">
            Supports PDF, DOCX, ZIP, PNG, etc.
          </p>
          <FileUpload.Trigger className="mt-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition">
            Select Files
          </FileUpload.Trigger>
        </FileUpload.Dropzone>
        <FileUpload.HiddenInput />
      </FileUpload.Root>

      {/* Uploaded Files List */}
      {attachments.length > 0 && (
        <div className="space-y-1.5 pt-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Attached Files ({attachments.length})
          </span>
          <div className="space-y-1.5">
            {attachments.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-2">
                  <FiFileText className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-medium text-slate-200 text-xs">{file.name}</span>
                  <span className="text-slate-500 text-[10px] font-mono">
                    {file.size ? `(${(file.size / 1024).toFixed(1)} KB)` : ""}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(i)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

