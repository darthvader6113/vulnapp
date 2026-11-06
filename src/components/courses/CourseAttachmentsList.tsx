import { FiDownload } from "react-icons/fi";

export interface Attachment {
  name: string;
  url: string;
  fileType?: string;
  size?: number;
}

interface CourseAttachmentsListProps {
  attachments: Attachment[];
}

export function CourseAttachmentsList({ attachments }: CourseAttachmentsListProps) {
  return (
    <div className="space-y-3 font-mono">
      <h2 className="text-base font-bold text-white flex items-center space-x-2">
        <FiDownload className="w-4 h-4 text-sky-400" />
        <span>Course Downloads & Resources</span>
      </h2>

      {attachments && attachments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {attachments.map((file, i) => (
            <a
              key={i}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              download
              className="flex items-center justify-between p-3 rounded bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/60 transition group"
            >
              <div className="space-y-0.5 overflow-hidden">
                <div className="text-xs font-medium text-slate-200 group-hover:text-sky-400 transition truncate">
                  {file.name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Uploaded resource"}
                </div>
              </div>
              <FiDownload className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 flex-shrink-0 ml-2" />
            </a>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded text-center text-xs text-slate-500">
          No file attachments for this course.
        </div>
      )}
    </div>
  );
}

