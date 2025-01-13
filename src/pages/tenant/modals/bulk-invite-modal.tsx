import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

interface BulkInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => Promise<void>;
  isSubmitting: boolean;
}

type FormValues = {
  file: FileList;
};

export default function BulkInviteModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: BulkInviteModalProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const selectedFile = watch("file")?.[0];

  const onSubmitForm = async (data: FormValues) => {
    console.log("fff");

    try {
      await onSubmit(data.file[0]);
      // onClose();
    } catch (error) {
      toast.error("Failed to upload the bulk invite. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Bulk Invite Upload</h2>
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop a CSV file or click to select a file. The CSV should
            include email addresses and expiration details for bulk invites.
          </p>

          <div
            className={`border-dashed border-2 p-4 rounded-md text-center transition hover:cursor-pointer ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-100"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragActive(false);
            }}
            onClick={() => {
              const input =
                document.querySelector<HTMLInputElement>('input[type="file"]');
              input?.click();
            }}
          >
            <input
              type="file"
              accept=".csv"
              className="hidden"
              {...register("file", {
                required: "Please select a file",
                validate: {
                  isCsv: (files) => {
                    const file = files?.[0];
                    return (
                      file?.type === "text/csv" || "Only CSV files are allowed"
                    );
                  },
                },
              })}
            />
            <p className="text-sm text-gray-700">
              {selectedFile
                ? `${selectedFile.name} is ready to upload`
                : isDragActive
                ? "Drop the file here..."
                : "Drag and drop a CSV file, or click to browse"}
            </p>
          </div>

          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
          )}

          <div className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
