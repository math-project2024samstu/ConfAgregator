import { Header, Conferences } from "./components/";
import styles from "./App.module.css";

function App() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h2 className={styles.welcomeText}>
          Добро пожаловать в информационный ресурс: Агрегатор научных
          конференций!
        </h2>
      </main>
      <Conferences />
    </>
  );
}

export default App;
