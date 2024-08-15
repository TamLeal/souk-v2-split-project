import React from 'react';

const Opcionais = ({
  opcionais,
  opcionaisSelecionados,
  setOpcionaisSelecionados,
}) => {
  return (
    <div className="mb-6">
      {opcionais.map((opcional) => (
        <div key={opcional.id} className="mb-4">
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              value={opcional.nome}
              checked={opcionaisSelecionados.includes(opcional.nome)}
              onChange={() =>
                setOpcionaisSelecionados((prev) =>
                  prev.includes(opcional.nome)
                    ? prev.filter((item) => item !== opcional.nome)
                    : [...prev, opcional.nome]
                )
              }
              className="mr-2"
            />
            {opcional.nome}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Opcionais;
