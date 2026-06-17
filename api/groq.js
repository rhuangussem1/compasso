export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. O DETETIVE: Puxa a chave do Vercel
  const apiKey = process.env.GROQ_API_KEY;

  // 2. VERIFICA SE ESTÁ VAZIA
  if (!apiKey) {
    return res.status(500).json({ 
      error: { message: "🚨 O arquivo groq.js não está conseguindo ler a chave no Vercel! A variável está chegando VAZIA." } 
    });
  }

  // 3. VERIFICA SE TEM ESPAÇOS OU SE ESTÁ CORTADA
  const cleanKey = apiKey.trim();
  if (!cleanKey.startsWith('gsk_')) {
    return res.status(500).json({ 
      error: { message: `🚨 A chave está corrompida! O Vercel leu isto: "${cleanKey.substring(0, 5)}..." (Não começa com gsk_)` } 
    });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: { message: 'Erro interno no servidor do Vercel (Fetch falhou)' } });
  }
}
