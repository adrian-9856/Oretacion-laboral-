/**
 * API Endpoint: Generación de Preguntas Personalizadas con Claude AI
 *
 * Genera preguntas de entrevista adaptadas al perfil del usuario
 * y al área de trabajo deseada.
 */

import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const {
      jobArea,       // Área laboral (ej: "ventas", "tecnología", "educación")
      difficulty,    // Nivel: "junior", "mid", "senior"
      count = 5,     // Número de preguntas a generar
      userProfile    // Perfil del usuario (opcional)
    } = req.body;

    if (!jobArea) {
      return res.status(400).json({
        error: 'Se requiere el área laboral (jobArea)'
      });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `Eres un experto reclutador con 15 años de experiencia. Genera ${count} preguntas de entrevista para un candidato que busca trabajo en el área de **${jobArea}**.

${difficulty ? `Nivel del puesto: ${difficulty}` : ''}

${userProfile ? `PERFIL DEL CANDIDATO:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.age}
- Experiencia previa: ${userProfile.experience || 'Sin experiencia'}
- Habilidades: ${userProfile.skills?.join(', ') || 'No especificadas'}
` : ''}

REQUISITOS:
1. Las preguntas deben ser relevantes para el área de ${jobArea}
2. Deben evaluar diferentes competencias (técnicas, conductuales, situacionales)
3. Deben ser preguntas abiertas que permitan respuestas detalladas
4. Incluye una mezcla de:
   - Preguntas técnicas/específicas del área
   - Preguntas conductuales (situaciones pasadas)
   - Preguntas situacionales (escenarios hipotéticos)

Formato de respuesta en JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "texto de la pregunta",
      "type": "technical/behavioral/situational",
      "competencies": ["competencia1", "competencia2"],
      "tips": "Qué buscar en la respuesta",
      "difficulty": "facil/media/dificil"
    }
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2500,
      temperature: 0.8,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text;

    // Extraer JSON
    let result;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se pudo parsear el JSON');
      }
    } catch (parseError) {
      // Fallback: crear estructura básica
      result = {
        questions: [{
          id: 'q1',
          question: '¿Puedes contarme sobre tu experiencia en ' + jobArea + '?',
          type: 'general',
          competencies: ['experiencia', 'comunicación'],
          tips: 'Evaluar experiencia relevante',
          difficulty: 'media'
        }]
      };
    }

    return res.status(200).json({
      success: true,
      jobArea,
      difficulty,
      count: result.questions?.length || 0,
      questions: result.questions,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generando preguntas:', error);

    return res.status(500).json({
      success: false,
      error: 'Error al generar preguntas',
      message: error.message
    });
  }
}
