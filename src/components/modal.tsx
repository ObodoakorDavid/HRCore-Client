import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={cn(
          "bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-lg",
          className
        )}
      >
        <div className="flex justify-end items-center mb-4">
          <X className=" cursor-pointer" onClick={onClose} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
