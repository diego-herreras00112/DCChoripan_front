// src/views/NosotrosPage.jsx
import React from "react";
import { useNavigate } from 'react-router-dom';
import "../assets/styles/NosotrosPage.css";

const TEAM = [
  {
    nombre: "Ignacia Nuyens",
    rol: "Industrial · Tecnologías de la Información",
    foto: "/Ignacia.jpg",  
    github: "https://github.com/ignanuyens",
  },
  {
    nombre: "Diego Herrera",
    rol: "Industrial · Tecnologías de la Información",
    foto: "/Diego.jpg",
    github: "https://github.com/diego-herreras00112",
  },
  {
    nombre: "Laura Melo",
    rol: "Ingeniería, Diseño e Innovación · Industrial",
    foto: "/Laura.jpeg",
    github: "https://github.com/lauramelotrucco",
  },
];

function Card({ m }) {
  const onImgError = (e) => (e.currentTarget.src = "/imgs/user.svg"); // fallback
  return (
    <article className="team-card">
      <img className="avatar" src={m.foto} alt={`Foto de ${m.nombre}`} onError={onImgError} />
      <h3 className="name">{m.nombre}</h3>
      <p className="role">{m.rol}</p>
      <div className="links">
        {m.github && (
          <a href={m.github} target="_blank" rel="noreferrer">GitHub</a>
        )}
        {m.mail && <a href={`mailto:${m.mail}`}>Email</a>}
      </div>
    </article>
  );
}

export default function NosotrosPage() {
  const navigate = useNavigate(); // NUEVO

  // NUEVA FUNCIÓN
  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <section className="nosotros">
      <div className="container">
        <h1 className="nosotros-title">Nosotros</h1>
        <p className="intro">
          Somos un equipo de estudiantes que desarrolló <strong>Chile en 100 casillas</strong>.
        </p>

        <div className="grid">
          {TEAM.map((m) => (
            <Card key={m.nombre} m={m} />
          ))}
        </div>

        {/* --- NUEVO BOTÓN --- */}
        <a href="#" onClick={handleBack} className="back-button">Volver</a>

      </div>
    </section>
  );
}