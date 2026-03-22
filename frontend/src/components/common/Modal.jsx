import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  footer,
  size = "md",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 px-4 backdrop-blur-sm">
      <div
        className={`mx-auto my-6 flex max-h-[90vh] w-full ${sizeClasses[size]} min-w-0 flex-col rounded-xl bg-white shadow-lg dark:bg-gray-900`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {showCloseButton && (
              <Button variant="secondary" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto overflow-x-hidden px-5 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
