/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { User } from "../types/User";

interface IModalProps {
  selectedUser: User | null;
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Modal({
  selectedUser,
  setSelectedUser,
  setIsModalOpen,
}: IModalProps) {
  // Блок скролла при монтировании
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === "modal-background") {
      closeModal();
    }
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div
      id="modal-background"
      css={modalBackgroundStyle}
      onClick={handleOutsideClick}
    >
      <div css={modalStyle}>
        <h3>Детали пользователя:</h3>
        {Object.entries({
          ID: selectedUser?.id,
          Имя: selectedUser?.firstName,
          Фамилия: selectedUser?.lastName,
          Почта: selectedUser?.email,
          Телефон: selectedUser?.phone,
        }).map(([label, value]) => (
          <p key={label}>
            <strong>{label}:</strong> {value}
          </p>
        ))}

        <h3>Адрес:</h3>
        {Object.entries({
          Улица: selectedUser?.address.streetAddress,
          Город: selectedUser?.address.city,
          Штат: selectedUser?.address.state,
          "Почтовый индекс": selectedUser?.address.zip,
        }).map(([label, value]) => (
          <p key={label}>
            <strong>{label}:</strong> {value}
          </p>
        ))}

        <h3>Описание:</h3>
        <p>{selectedUser?.description}</p>

        <button
          onClick={closeModal}
          css={closeModalButtonStyle}
          aria-label="Закрыть модальное окно"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

const modalBackgroundStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const modalStyle = css`
  background: #303030;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 450px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  p {
    padding-left: 20px;
  }
`;

const closeModalButtonStyle = css`
  padding: 10px 20px;
  background-color: #6e8efb;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 15px;

  &:hover {
    background-color: #5a7bdb;
  }
`;
