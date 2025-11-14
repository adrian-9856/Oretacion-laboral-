/**
 * API Endpoint: Análisis Inteligente de Entrevistas con Claude AI
 *
 * Analiza respuestas de entrevistas proporcionando feedback contextual,
 * evaluación de competencias y sugerencias de mejora.
 */

import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { question, answer, userProfile } = req.body;

    // Validación
    if (!question || !answer) {
      return res.status(400).json({
        error: 'Se requiere pregunta y respuesta'
      });
    }

    // Inicializar cliente de Anthropic
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Crear el prompt para Claude
    const prompt = `Eres un experto en recursos humanos y coach laboral. Analiza esta respuesta de entrevista y proporciona feedback constructivo.

PREGUNTA DE ENTREVISTA:
${question}

RESPUESTA DEL CANDIDATO:
${answer}

${userProfile ? `PERFIL DEL CANDIDATO:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.age}
- Experiencia: ${userProfile.experience || 'No especificada'}
` : ''}

Por favor proporciona:

1. **Puntuación General** (0-100): Un número que refleje la calidad de la respuesta
2. **Fortalezas**: 3-4 puntos positivos específicos de la respuesta
3. **Áreas de Mejora**: 3-4 aspectos que el candidato puede mejorar
4. **Competencias Detectadas**: Lista de competencias profesionales demostradas (ej: liderazgo, trabajo en equipo, resolución de problemas)
5. **Sugerencias Concretas**: 2-3 consejos específicos para mejorar la respuesta
6. **Respuesta Modelo**: Un ejemplo de cómo podría mejorarse la respuesta

Formato de respuesta en JSON:
{
  "score": número,
  "level": "Excelente/Muy Bueno/Bueno/Regular/Necesita Mejorar",
  "strengths": [array de strings],
  "improvements": [array de strings],
  "competencies": [array de strings],
  "suggestions": [array de strings],
  "modelAnswer": string
}`;

    // Llamar a Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Extraer la respuesta
    const responseText = message.content[0].text;

    // Intentar parsear como JSON
    let analysis;
    try {
      // Buscar JSON en la respuesta
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // Si no hay JSON, crear estructura básica
        analysis = {
          score: 70,
          level: 'Bueno',
          strengths: ['Respuesta proporcionada'],
          improvements: ['Ver análisis completo'],
          competencies: [],
          suggestions: [],
          modelAnswer: responseText
        };
      }
    } catch (parseError) {
      analysis = {
        score: 70,
        level: 'Bueno',
        rawAnalysis: responseText,
        strengths: ['Respuesta analizada por IA'],
        improvements: ['Ver análisis detallado'],
        competencies: [],
        suggestions: [],
        modelAnswer: ''
      };
    }

    // Agregar metadata
    analysis.analyzedAt = new Date().toISOString();
    analysis.model = 'claude-3.5-sonnet';

    return res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error en análisis:', error);

    return res.status(500).json({
      success: false,
      error: 'Error al analizar la respuesta',
      message: error.message
    });
  }
}
