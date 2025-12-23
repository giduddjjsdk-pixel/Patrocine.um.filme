// script.js
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
  const [selecionados, setSelecionados] = React.useState([]);
  const [darkMode, setDarkMode] = React.useState(false);

  const entrar = () => setAcessou(true);
  const abrirModal = (produto) => setModalProduto(produto);
  const fecharModal = () => { setModalProduto(null); setInputFilme(""); setResultados([]); setSelecionados([]); };

  const buscarFilmes = async (query) => {
    if (!query) { setResultados([]); return; }
    const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    const data = await res.json();
    setResultados(data.Search || []);
  };

  const toggleSelecionado = (filme) => {
    if (selecionados.includes(filme)) {
      setSelecionados(selecionados.filter(f => f !== filme));
    } else { setSelecionados([...selecionados, filme]); }
  };

  const comprar = () => {
    if (!modalProduto || selecionados.length === 0) return;
    selecionados.forEach(f => {
      const url = modalProduto.link + `?mensagem=${encodeURIComponent(f.Title)}`;
      window.open(url, "_blank");
    });
    fecharModal();
  };

  const toggleDarkMode = () => { 
    setDarkMode(!darkMode); 
    document.body.style.background = darkMode ? "#fff" : "#121212"; 
    document.body.style.color = darkMode ? "#333" : "#f5f5f5"; 
  };

  React.useEffect(() => { buscarFilmes(inputFilme); }, [inputFilme]);
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
      <button id="darkModeBtn" onClick={toggleDarkMode}>{darkMode ? "Modo Claro" : "Modo Escuro"}</button>
      <header>
        <img src="fotoProfissional.jpg" alt="Perfil"/>
        <h1>Minha Loja de Filmes</h1>
        <p>Escolha seu produto e compre fácil 💜</p>
      </header>

      <div className="banner">Promoções e novidades toda semana!</div>

      <div className="container">
        {produtos.map((p,i)=>(
          <div className="card" key={i}>
            <img src={p.img} alt={p.nome}/>
            <h2>{p.nome}</h2>
            <p>R$ {p.valor}</p>
            <button onClick={()=>abrirModal(p)}>Comprar</button>
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

            <input type="text" placeholder="Digite o nome do filme ou série..." value={inputFilme} onChange={e=>setInputFilme(e.target.value)} />

            <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", marginTop:"10px" }}>
              {resultados.map((f,i)=>(
                <div key={i} style={{ border: selecionados.includes(f) ? "3px solid #800080" : "1px solid #ccc", borderRadius:"12px", overflow:"hidden", cursor:"pointer", width:"100px", textAlign:"center", transition:"all 0.2s" }} onClick={()=>toggleSelecionado(f)}>
                  <img src={f.Poster!=="N/A"?f.Poster:"placeholder.jpg"} alt={f.Title} style={{ width:"100%", height:"140px", objectFit:"cover" }} />
                  <p style={{ fontSize:"12px", margin:"5px 0" }}>{f.Title}</p>
                </div>
              ))}
            </div>

            {selecionados.length>0 && <p style={{color:"#800080", fontWeight:"bold"}}>Selecionados: {selecionados.map(f=>f.Title).join(", ")}</p>}

            <button onClick={comprar} style={{marginTop:"10px"}}>Finalizar Compra</button>
          </div>
        </div>
      )}

      <footer>
        <p>Desenvolvido por Canal GustavoreactsYt | <a href="#">Instagram</a> | <a href="#">Contato</a></p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);