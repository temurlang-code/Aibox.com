
import { Link } from "wouter";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">О нас</h1>
        
        <div className="prose prose-invert">
          <p className="text-gray-300 mb-6">
            Добро пожаловать в AIBox – платформу, где собраны лучшие нейросетевые инструменты в одном месте! Мы создали AIBox, чтобы каждый мог легко использовать передовые технологии искусственного интеллекта для работы, творчества и обучения.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">🔹 Что мы предлагаем?</h2>
          
          <ul className="space-y-4 text-gray-300">
            <li>Доступ к мощным нейросетям: генерация текста, изображений, аудио и видео.</li>
            <li>Удобный каталог с описаниями, чтобы вы знали, какой ИИ выбрать.</li>
            <li>Интуитивно понятный интерфейс – всё, что вам нужно, в одном клике.</li>
          </ul>

          <p className="text-gray-300 mt-6 font-semibold">
            AIBox – ваш умный помощник в мире технологий!
          </p>
        </div>
      </div>
    </div>
  );
}
