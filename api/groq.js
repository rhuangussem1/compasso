export default async function handler(req, res) {
  // Garante que o arquivo só aceita requisições POST seguras
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        // É AQUI QUE ELE PUXA A CHAVE EXATA DO SEU COFRE
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    // Se a Groq devolver erro, o backend repassa para o nosso Espião ler no frontend
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: { message: 'Erro interno no servidor do Vercel (Backend)' } });
  }
}
