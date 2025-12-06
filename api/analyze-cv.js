/**
 * API Endpoint: Análisis de CV/Resume con Claude AI
 *
 * Analiza un CV proporcionando feedback sobre formato,
 * contenido, palabras clave y sugerencias de mejora.
 */

import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const {
      cvText,           // Texto del CV
      targetJob,        // Puesto objetivo (opcional)
      targetIndustry    // Industria objetivo (opcional)
    } = req.body;

    if (!cvText) {
      return res.status(400).json({
        error: 'Se requiere el texto del CV'
      });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `Eres un experto reclutador y asesor de CVs profesionales. Analiza el siguiente CV y proporciona un análisis detallado y constructivo.

${targetJob ? `PUESTO OBJETIVO: ${targetJob}` : ''}
${targetIndustry ? `INDUSTRIA OBJETIVO: ${targetIndustry}` : ''}

CV A ANALIZAR:
${cvText}

---

Por favor proporciona un análisis completo que incluya:

1. **Puntuación General** (0-100): Calidad general del CV
2. **Primeras Impresiones**: Qué destaca a primera vista (bueno y malo)
3. **Fortalezas**: 3-5 aspectos positivos del CV
4. **Debilidades**: 3-5 áreas que necesitan mejora
5. **Palabras Clave Faltantes**: Términos importantes que deberían incluirse para ATS (Applicant Tracking Systems)
6. **Estructura y Formato**: Comentarios sobre organización y presentación
7. **Contenido**: Análisis de la efectividad de logros, experiencia y habilidades
8. **Sugerencias Específicas**: 5-7 acciones concretas para mejorar el CV
9. **Compatibilidad con Puesto**: Si se proporcionó un puesto objetivo, evaluar qué tan bien coincide el CV

Formato de respuesta en JSON:
{
  "score": número,
  "rating": "Excelente/Muy Bueno/Bueno/Regular/Necesita Mejora",
  "firstImpressions": {
    "positive": [strings],
    "negative": [strings]
  },
  "strengths": [strings],
  "weaknesses": [strings],
  "missingKeywords": [strings],
  "structureAndFormat": string,
  "contentAnalysis": string,
  "specificSuggestions": [strings],
  "jobCompatibility": {
    "score": número,
    "match": string,
    "recommendations": [strings]
  }
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      temperature: 0.5,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text;

    // Extraer JSON
    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se pudo parsear JSON');
      }
    } catch (parseError) {
      // Fallback
      analysis = {
        score: 60,
        rating: 'Bueno',
        rawAnalysis: responseText,
        suggestions: ['Ver análisis completo en rawAnalysis']
      };
    }

    analysis.analyzedAt = new Date().toISOString();
    analysis.wordCount = cvText.split(/\s+/).length;

    return res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error analizando CV:', error);

    return res.status(500).json({
      success: false,
      error: 'Error al analizar el CV',
      message: error.message
    });
  }
}
