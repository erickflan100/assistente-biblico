"use client";

import { useState, useEffect, useRef } from "react";
import { MdDarkMode } from "react-icons/md";
import { IoMdSunny } from "react-icons/io";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { DisplayAdUnit } from "./components/adUnit";
import CookieConsent from "react-cookie-consent";

enum Sender {
  USER = "user",
  IA = "ia",
}

export default function Home() {
  const [text, setText] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: "user" | "ia" }>
  >([]);
  const controllerRef = useRef(new AbortController());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleResponse = () => {
    response();
  };

  // Função para rolar o chat até o final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Efeito que rola o chat para o final sempre que as mensagens mudam
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyCcwpx2CpqpLe7NK2oj3ZEPeiyqW7sS48I"
  );

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const response = async () => {
    if (text.trim() === "") return;

    setFirstLoad(true);

    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;

    if (loading) {
      setLoading(false);
      return null;
    }

    // Adicionar mensagem do usuário
    const userMessage = { text: text, sender: Sender.USER };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setText(""); // Limpar o campo de entrada após enviar a mensagem

    // Construir o prompt para a IA
    var prompt =
      "Analise a pergunta sobre a biblia e encontre respostas na biblia trazendo versiculos e utilizando ";
    prompt +=
      "o texto original da bíblia e sua tradução para melhor compreensão do texto e os comentários de Matthew Henry e Charles Spurgeon, se caso existir uma pergunta que não esteja relacionado ";
    prompt +=
      "com a biblia, responda que a pergunta não pode ser respondida, pois não está relacionada com a bíblia e não ";
    prompt += "cite o Matthew Henry e nem o Charles Spurgeon. Se a pergunta ";
    prompt +=
      "estiver relacionando outro comentarista da biblia, responda que a pergunta não pode ser respondida, pois ";
    prompt +=
      "você foi programado para responder apenas sobre os comentários de Matthew Henry e Charles Spurgeon.";
    prompt += "\n" + text;

    setLoading(true);

    try {
      // Obter a resposta da IA
      const result = await model.generateContent(prompt, { signal }); // Passar o signal para a IA
      const response = result.response.text();

      setLoading(false);

      // Adicionar mensagem da IA
      const iaMessage = { text: response, sender: Sender.IA };
      setMessages((prevMessages) => [...prevMessages, iaMessage]);
    } catch (error: string | any) {
      if (error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Erro ao obter a resposta da IA", error);
      }
      setLoading(false);
    }
  };

  // Verifica se o usuário já tem uma preferência de tema salva no localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Função para alternar entre os temas
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  //Função que verifica se é o enter pressionado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleResponse();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between items-center ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Cabeçalho */}
      <header
        className={`broder border-b w-full flex justify-between items-center p-4 ${
          darkMode
            ? "bg-black_theme text-white border-white_theme"
            : "bg-white_theme text-black border-black_theme"
        }`}
      >
        <h1 className="text-lg font-bold">Assistente Bíblico</h1>
        <nav className="flex gap-4 items-center">
          {/* <a href="#" className="hover:underline">
            Início
          </a>
          <a href="#" className="hover:underline">
            Sobre
          </a> */}
          {/* Botão para alternar o tema */}
          <button
            onClick={toggleTheme}
            className={`border border-gray-300 w-32 px-2 py-2 flex justify-center gap-2 items-center rounded-lg transition-colors ${
              darkMode
                ? "bg-black text-white hover:bg-white_hover"
                : "bg-white_theme text-black hover:bg-black_hover"
            }`}
          >
            {darkMode ? (
              <MdDarkMode size={20} color="white" />
            ) : (
              <IoMdSunny size={20} color="black" />
            )}
            {darkMode ? (
              <div className="text-sm">Tema Escuro</div>
            ) : (
              <div className="text-sm">Tema Claro</div>
            )}
          </button>
        </nav>
      </header>

      {/* Área do Chat */}
      <main className="flex-1 w-full flex flex-col md:flex-row items-center justify-center p-4">
        <CookieConsent
          location="bottom"
          buttonText="Aceitar"
          cookieName="meu-consentimento"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        >
          Este site usa cookies para melhorar sua experiência.{" "}
        </CookieConsent>
        <div className="md:w-40 w-full h-full mb-4 mx-4 bg-white">
          <DisplayAdUnit
            className="w-full h-full p-2 rounded-lg shadow-md"
            format="vertical"
          />
        </div>
        <div className="w-full h-full max-w-3xl flex flex-col items-center">
          <div
            className={`border border-gray-400 w-full h-[60vh] ${
              darkMode ? "bg-black text-white" : "bg-white text-black"
            } rounded-lg p-4 overflow-y-scroll`}
          >
            {messages.map((message, index) => (
              <div key={index}>
                {message.sender === "user" ? (
                  <div className="text-right mb-4">{message.text}</div>
                ) : (
                  <div className="text-left mb-4">{message.text}</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-center items-center mt-4">
                <AiOutlineLoading3Quarters
                  className="animate-spin text-3xl"
                  color={darkMode ? "white" : "black"}
                />
                <span className="ml-2">
                  {darkMode ? "Carregando..." : "Carregando..."}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex w-full mt-4">
            <input
              type="text"
              placeholder="Digite sua pergunta..."
              className={`flex-1 border border-gray-400 p-2 rounded-l-lg ${
                darkMode ? "bg-black text-white" : "bg-white text-black"
              }`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleResponse}
              className={`border border-gray-400 p-2 px-4 rounded-r-lg ${
                darkMode
                  ? "bg-white text-black hover:bg-black_hover hover:text-white"
                  : "bg-black text-white hover:bg-white_hover hover:text-black"
              }`}
            >
              Enviar
            </button>
          </div>
        </div>
        <div className="md:w-40 w-full h-full mt-4 mx-4 bg-white">
          <DisplayAdUnit
            className="w-full h-full p-2 rounded-lg shadow-md"
            format="vertical"
          />
        </div>
      </main>

      {/* Rodapé */}
      <footer
        className={`border border-t w-full flex justify-center p-4 ${
          darkMode
            ? "bg-black_theme text-white border-white_theme"
            : "bg-white_theme text-black border-black_theme"
        }`}
      >
        <p>© 2024 Assistente Bíblico</p>
      </footer>
    </div>
  );
}
