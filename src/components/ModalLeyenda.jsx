import React from "react";
import "../assets/styles/ModalLeyenda.css";

export default function ModalLeyenda({ onClose }) {
  return (
    <div className="overlay-leyenda">
      <div className="modal-leyenda">

        <button className="modal-leyenda-cerrar" onClick={onClose}>✕</button>

        <h2 className="modal-leyenda-titulo">Leyenda</h2>

        {/* === BLOQUE 1 === */}
        <div className="leyenda-fila">

        <div className="columna-casillas">
            <div className="casilla-wrapper"><img src="/casillas/Casilla 22.svg" /></div>
            <div className="casilla-wrapper"><img src="/casillas/Casilla 19.svg" /></div>
            <div className="casilla-wrapper"><img src="/casillas/Casilla 2.svg" /></div>
        </div>

        <div className="columna-casillas">
            <div className="casilla-wrapper"><img src="/casillas/Casilla 56.svg" /></div>
            <div className="casilla-wrapper"><img src="/casillas/Casilla 45.svg" /></div>
            <div className="casilla-wrapper"><img src="/casillas/Casilla 36.svg" /></div>
        </div>

        <div className="columna-casillas">
            <div className="casilla-wrapper"><img src="/casillas/Casilla 82.svg" /></div>
            <div className="casilla-wrapper"><img src="/casillas/Casilla 79.svg" /></div>
            <div className="casilla-wrapper"><img src="/casillas/Casilla 62.svg" /></div>
        </div>

        <p className="leyenda-texto">
            Las cascadas, ríos o dunas te deslizan dos casillas hacia abajo.
            <br />
            (Si caes en 22 bajas a 2).
        </p>
        </div>

        {/* === BLOQUE 2 === */}
        <div className="leyenda-bloque">
          <div className="grupo-casillas fila-horizontal">
            <img src="/casillas/Casilla 5.svg" />
            <img src="/casillas/Casilla 35.svg" />
            <img src="/casillas/Casilla 64.svg" />
          </div>

          <p className="texto-explicacion">
            La madera, pegamento o clavos de cobre entregan una unidad del recurso que aparece.
          </p>
        </div>

        {/* === BLOQUE 3 === */}
        <div className="leyenda-bloque">
          <div className="grupo-casillas fila-horizontal">
            <img src="/casillas/Casilla 60.svg" />
          </div>

          <p className="texto-explicacion">
            El choripán te entrega una unidad de cada recurso.
          </p>
        </div>

        {/* === BLOQUE 4 === */}
        <div className="leyenda-bloque">
          <div className="grupo-casillas fila-horizontal">
            <img src="/casillas/Casilla 18.svg" />
          </div>

          <p className="texto-explicacion">
            La fonda te permite lanzar nuevamente el dado.
          </p>
        </div>

        {/* === BLOQUE 5 === */}
        <div className="leyenda-bloque">
          <div className="grupo-casillas fila-horizontal">
            <img src="/casillas/Casilla 7.svg" />
          </div>

          <p className="texto-explicacion">
            El hielo hace que pierdas tu próximo turno.
          </p>
        </div>

        {/* === BLOQUE 6 === */}
        <div className="leyenda-bloque">
          <div className="grupo-casillas fila-horizontal">
            <img src="/casillas/Casilla 20.svg" />
          </div>

          <p className="texto-explicacion">
            La marejada te hace retroceder 2 casillas y perder 1 pegamento.
            <br />
            Si no tienes el recurso, retrocedes una casilla adicional.
          </p>
        </div>

        {/* === BLOQUE 7 === */}
        <div className="leyenda-bloque">
          <div className="grupo-casillas fila-horizontal">
            <img src="/casillas/Casilla 10.svg" />
          </div>

          <p className="texto-explicacion">
            La avalancha te hace retroceder 4 casillas y perder 1 madera.
            <br />
            Si no tienes el recurso, retrocedes una casilla adicional.
          </p>
        </div>

        {/* === BLOQUE 8 === */}
        <div className="leyenda-bloque">
          <div className="grupo-casillas fila-horizontal">
            <img src="/casillas/Casilla 16.svg" />
          </div>

          <p className="texto-explicacion">
            El terremoto hace que pierdas todos tus recursos.
          </p>
        </div>

        {/* === BLOQUE 9 === */}
        <div className="leyenda-bloque">
          <div className="grupo-casillas fila-horizontal">
            <img src="/casillas/Casilla 58.svg" />
          </div>

          <p className="texto-explicacion">
            El volantín te permite avanzar 2 casillas.
          </p>
        </div>

      </div>
    </div>
  );
}
