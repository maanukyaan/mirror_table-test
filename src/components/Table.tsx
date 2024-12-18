/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import { API_URL, columns } from "../constants";
import { User } from "../types/User";
import Modal from "./Modal";

export default function Table() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  } | null>(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTableData = async (url: string): Promise<User[]> => {
      try {
        setIsLoading(true);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных с сервера");
        }

        const data: User[] = await response.json();
        return data;
      } catch (error) {
        setError("Произошла ошибка при загрузке данных. Попробуйте позже.");
        console.error(error);
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableData(API_URL).then((data) => {
      if (data.length > 0) {
        setUsers(data);
        setFilteredUsers(data);
      }
    });
  }, []);

  const handleSort = useCallback(
    (key: keyof User) => {
      const direction =
        sortConfig?.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      setSortConfig({ key, direction });

      const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      });

      setFilteredUsers(sortedUsers);
    },
    [sortConfig, filteredUsers]
  );

  const handleSearch = useCallback(() => {
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(filterQuery.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
  }, [users, filterQuery]);

  const handleRowClick = useCallback((user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  return (
    <div>
      <div css={filterContainerStyle}>
        <input
          type="text"
          css={filterInputStyle}
          placeholder="Введите текст для фильтрации..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          disabled={!!error}
        />
        <button
          onClick={handleSearch}
          css={searchButtonStyle}
          disabled={!!error}
        >
          Найти
        </button>
      </div>
      {isLoading ? (
        <div css={loaderStyle}>Загрузка...</div>
      ) : error ? (
        <div css={errorStyle}>{error}</div>
      ) : (
        <>
          <table css={tableStyle}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    css={headerCellStyle}
                    onClick={() => handleSort(column.key as keyof User)}
                  >
                    {column.label}{" "}
                    {sortConfig?.key === column.key &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} onClick={() => handleRowClick(user)}>
                  <td css={cellStyle}>{user.id}</td>
                  <td css={cellStyle}>{user.firstName}</td>
                  <td css={cellStyle}>{user.lastName}</td>
                  <td css={cellStyle}>{user.email}</td>
                  <td css={cellStyle}>{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {isModalOpen && selectedUser && (
            <Modal
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              setIsModalOpen={setIsModalOpen}
            />
          )}
        </>
      )}
    </div>
  );
}

const errorStyle = css`
  color: #fff;
  background-color: #e74c3c;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
  margin: 20px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 500px;
`;

const filterContainerStyle = css`
  margin: 20px auto;
  text-align: center;
`;

const filterInputStyle = css`
  padding: 12px 18px;
  width: 250px;
  margin: 20px 10px 20px 0px;
  outline: none;
  border-radius: 4px;
  border: 2px solid #555;
  background-color: #333;
  color: #fff;
  font-size: 13px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: #888;
  }

  &:focus {
    border-color: #bbb;
    background-color: #444;
    box-shadow: 0 0 5px rgba(187, 187, 187, 0.5);
  }

  &::placeholder {
    color: #aaa;
    transition: color 0.3s ease;
  }

  &:focus::placeholder {
    color: #bbb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const searchButtonStyle = css`
  padding: 13px 30px;
  background-color: #6e8efb;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a7bdb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const tableStyle = css`
  width: 70%;
  margin: 0 auto;
  border-collapse: collapse;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: #ccc;
`;

const headerCellStyle = css`
  border: 2px solid #e0e0e0;
  padding: 12px 16px;
  text-align: left;
  background: linear-gradient(135deg, #6e8efb, #ff67b0);
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
`;

const cellStyle = css`
  border: 1px solid #e0e0e0;
  padding: 10px 16px;
  text-align: left;
  color: #f1f1f1;
  transition: all 0.25s ease;
  cursor: pointer;
  background-color: #1c1f2e;
  font-weight: 200;

  &:nth-of-type(even) {
    background-color: #161925;
  }

  &:hover {
    background-color: #3b4a5d;
    color: #f1f1f1;
  }
`;

const loaderStyle = css`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin: 40px 0;
  color: #6e8efb;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;
