const produtos = [
  { nome: "Anime 🎌", valor: 15, img: "Anime.jpg", link: "https://nubank.com.br/cobrar/197m0h/6949a5b0-7d22-41f3-85de-178280d7efeb" },
  { nome: "Filmes 🎬", valor: 25, img: "Filmes.jpg", link: "https://nubank.com.br/cobrar/197m0h/6949a61b-136f-4b9f-9cb0-91229b664d62" },
  { nome: "Séries 📺", valor: 35, img: "Séries.jpg", link: "https://nubank.com.br/cobrar/197m0h/6949a639-cc53-4c51-8ef6-28b8be695651" }
];

const OMDB_API_KEY = "95ebea19";

function App() {
  const [acessou, setAcessou] = React.useState(false);
  const [modalProduto, setModalProduto] = React.useState(null);
  const [inputFilme, setInputFilme] = React.useState("");
  const [resultados, setResultados] = React.useState([]);
  const [selecionado, setSelecionado] = React.useState(null);

  const entrar = () => setAcessou(true);
  const abrirModal = (produto) => setModalProduto(produto);
  const fecharModal = () => { setModalProduto(null); setInputFilme(""); setResultados([]); setSelecionado(null); };

  const buscarFilmes = async (query) => {
    if (!query) {
      setResultados([]);
      return;
    }
    const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    const data = await res.json();
    if (data.Search) setResultados(data.Search);
    else setResultados([]);
  };

  React.useEffect(() => { buscarFilmes(inputFilme); }, [inputFilme]);

  const comprar = () => {
    if (!modalProduto || !selecionado) return;
    const url = modalProduto.link + `?mensagem=${encodeURIComponent(selecionado.Title)}`;
    window.open(url, "_blank");
    fecharModal();
  };

  React.useEffect(() => {
    if (!acessou) return;
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => setTimeout(() => card.classList.add('visible'), i*150));
  }, [acessou]);

  if (!acessou) {
    return (
      <div className="inicio-tela">
        <img src="fotoProfissional.jpg" alt="Banner Inicial" />
        <h1>Bem-vindo ao Meu Canal React!</h1>
        <p>Clique abaixo para entrar na área de compras 🎬</p>
        <button className="inicio-btn" onClick={entrar}>Clique aqui para entrar</button>
      </div>
    );
  }

  return (
    <div className="page visible">
      <header>
        <img src="fotoProfissional.jpg" alt="Perfil"/>
        <h1>Minha Loja de Filmes</h1>
        <p>Escolha seu produto e compre fácil 💜</p>
      </header>

      <div className="banner">Promoções e novidades toda semana!</div>

      <div className="container">
        {produtos.map((p, i) => (
          <div className="card" key={i}>
            <img src={p.img} alt={p.nome} />
            <h2>{p.nome}</h2>
            <p>R$ {p.valor}</p>
            <button onClick={() => abrirModal(p)}>Comprar</button>
          </div>
        ))}
      </div>

      {modalProduto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={fecharModal}>&times;</span>
            <img src={modalProduto.img} alt={modalProduto.nome} />
            <h2>{modalProduto.nome}</h2>
            <p>R$ {modalProduto.valor}</p>

            {/* Campo de pesquisa */}
            <input
              type="text"
              placeholder="Digite o filme ou série que deseja..."
              value={inputFilme}
              onChange={e => setInputFilme(e.target.value)}
            />

            {/* Resultados da API */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", marginTop:"10px" }}>
              {resultados.map((f, i) => (
                <div
                  key={i}
                  style={{
                    border: selecionado===f ? "3px solid #800080" : "1px solid #ccc",
                    borderRadius:"12px",
                    overflow:"hidden",
                    cursor:"pointer",
                    width:"100px",
                    textAlign:"center",
                    transition:"all 0.2s"
                  }}
                  onClick={() => setSelecionado(f)}
                >
                  <img src={f.Poster !== "N/A" ? f.Poster : "placeholder.jpg"} alt={f.Title} style={{ width:"100%", height:"140px", objectFit:"cover" }} />
                  <p style={{ fontSize:"12px", margin:"5px 0" }}>{f.Title}</p>
                </div>
              ))}
            </div>

            {/* Filme selecionado */}
            {selecionado && <p style={{color:"#800080", fontWeight:"bold"}}>Filme/Série selecionado: {selecionado.Title}</p>}

            <button onClick={comprar} style={{marginTop:"10px"}}>Finalizar Compra</button>
          </div>
        </div>
      )}

      <footer>
        <p>Desenvolvido por Você 💜 | <a href="#">Instagram</a> | <a href="#">Contato</a></p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);