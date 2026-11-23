import Numero from './Numero';

// Os números do projeto, como o quadro de áreas na ficha de um empreendimento.
// itens: [{ valor, casas?, prefixo?, sufixo?, rotulo }]
export default function Ficha({ itens }) {
  return (
    <dl className="ficha">
      {itens.map((item) => (
        <div key={item.rotulo}>
          <dt>{item.rotulo}</dt>
          <dd>
            <Numero valor={item.valor} casas={item.casas} prefixo={item.prefixo} sufixo={item.sufixo} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
