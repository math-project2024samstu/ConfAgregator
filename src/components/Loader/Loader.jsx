import React from "react";
import styles from "./Loader.module.css";

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <h3>Загрузка...</h3>
      <div className={styles.spinner}></div>
    </div>
  );
};