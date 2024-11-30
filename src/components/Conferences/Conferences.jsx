import { useEffect, useState } from "react";
import styles from "./Conferences.module.css";
import { Loader } from "../../components";

export const Conferences = () => {
  const [conferences, setConferences] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const conferencesPerPage = 15; // Количество конференций на страницу
  const maxVisibleButtons = 5; // Максимальное количество видимых кнопок пагинации

  const fetchConferences = async () => {
    setLoading(true); // Устанавливаем состояние загрузки
    console.log("Fetching conferences..."); // Логгер для проверки
    try {
      const response = await fetch("http://localhost:5002/conferences");
      const data = await response.json();
      setConferences(data);
      localStorage.setItem("conferences", JSON.stringify(data)); // Сохраняем данные в localStorage
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  };

  useEffect(() => {
    const storedConferences = localStorage.getItem("conferences");

    if (storedConferences) {
      // Если данные есть в localStorage, используем их
      setConferences(JSON.parse(storedConferences));
      setLoading(false);
    } else {
      // Если данных нет, загружаем их с сервера
      fetchConferences();
    }

    // Устанавливаем интервал для обновления данных каждые 10 секунд
    const intervalId = setInterval(fetchConferences, 100 * 1000 * 10);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const [day, month] = dateString.split(".");
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex];

    return `${day} ${monthName} 2024 г.`;
  };

  // Сортировка конференций по дате
  const sortedConferences = conferences.sort((a, b) => {
    const dateA = new Date(a.date.split(" ")[0].split(".").reverse().join("-"));
    const dateB = new Date(b.date.split(" ")[0].split(".").reverse().join("-"));
    return dateA - dateB;
  });

  // Расчет индексов для отображения конференций на текущей странице
  const indexOfLastConference = currentPage * conferencesPerPage;
  const indexOfFirstConference = indexOfLastConference - conferencesPerPage;
  const currentConferences = sortedConferences.slice(
    indexOfFirstConference,
    indexOfLastConference
  );

  // Переключение страниц
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Количество страниц
  const totalPages = Math.ceil(sortedConferences.length / conferencesPerPage);

  // Расчет видимых кнопок пагинации
  const getVisibleButtons = () => {
    const halfVisibleButtons = Math.floor(maxVisibleButtons / 2);
    let startPage = currentPage - halfVisibleButtons;
    let endPage = currentPage + halfVisibleButtons;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(totalPages, maxVisibleButtons);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxVisibleButtons + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Предстоящие конференции</h3>
      {loading ? (
        <Loader /> // Отображаем лоадер, если данные загружаются
      ) : (
        <ul className={styles.conferenceList}>
          {currentConferences.map((conference, index) => {
            // Форматируем дату, если источник konferen.ru
            const formattedDate =
              conference.source === "konferen.ru"
                ? formatDate(conference.date.split(" ")[0])
                : conference.date;

            // Формируем ссылку на подробности в зависимости от источника
            const detailsLink =
              conference.source === "konferen.ru"
                ? `https://konferen.ru${conference.link}`
                : `https://konferencii.ru${conference.link}`;

            return (
              <li key={index} className={styles.conferenceItem}>
                <h4>{conference.title}</h4>
                <p>Дата: {formattedDate}</p>
                <p>Место: {conference.location}</p>
                <p>Организаторы: {conference.organizers}</p>
                <p>Источник: {conference.source}</p> {/* Добавляем источник */}
                <a
                  href={detailsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.detailsButton}
                >
                  Узнать подробности
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Первая
        </button>
        {getVisibleButtons().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`${styles.paginationButton} ${
              currentPage === pageNumber ? styles.active : ""
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Последняя
        </button>
      </div>
    </section>
  );
};
