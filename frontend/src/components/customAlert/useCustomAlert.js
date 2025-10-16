// src/hooks/useCustomAlert.js
import { useState } from "react";
import CustomAlert from "./CustomAlert";

export function useCustomAlert() {
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showAlert = ({ title, message, onConfirm }) => {
    setAlertConfig({ open: true, title, message, onConfirm });
  };

  const AlertComponent = (
    <CustomAlert
      open={alertConfig.open}
      title={alertConfig.title}
      message={alertConfig.message}
      onConfirm={() => {
        alertConfig.onConfirm();
        setAlertConfig((prev) => ({ ...prev, open: false }));
      }}
      onCancel={() => setAlertConfig((prev) => ({ ...prev, open: false }))}
    />
  );

  return [showAlert, AlertComponent];
}
