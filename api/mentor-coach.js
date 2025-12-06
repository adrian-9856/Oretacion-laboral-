/**
 * API Endpoint: Coach Virtual / Mentor con Claude AI
 *
 * Proporciona mentoría conversacional personalizada,
 * respondiendo preguntas y ofreciendo consejos de carrera.
 */

import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const {
      userMessage,        // Pregunta/mensaje del usuario
      conversationHistory = [],  // Historial de conversación (opcional)
      userProfile         // Perfil del usuario
    } = req.body;

    if (!userMessage) {
      return res.status(400).json({
        error: 'Se requiere un mensaje del usuario'
      });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Construir el contexto del sistema
    const systemPrompt = `Eres un coach laboral experto y mentor profesional con 20 años de experiencia. Tu objetivo es:

1. **Ayudar** a las personas a encontrar su camino profesional
2. **Motivar** y proporcionar apoyo emocional
3. **Aconsejar** sobre desarrollo de carrera, entrevistas, CV, habilidades
4. **Ser empático** pero también honesto y constructivo
5. **Personalizar** tus respuestas según el perfil del usuario

ESTILO DE COMUNICACIÓN:
- Cálido y cercano, pero profesional
- Usa ejemplos concretos cuando sea posible
- Proporciona pasos accionables
- Haz preguntas reflexivas para profundizar
- Celebra los logros, por pequeños que sean

${userProfile ? `PERFIL DEL USUARIO:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.age}
- Situación: ${userProfile.situation || 'Buscando orientación laboral'}
- Experiencia: ${userProfile.experience || 'No especificada'}
- Intereses: ${userProfile.interests?.join(', ') || 'No especificados'}
` : ''}

Recuerda: Tu objetivo es empoderar al usuario para que tome sus propias decisiones informadas.`;

    // Construir el historial de mensajes
    const messages = [];

    // Agregar historial previo si existe
    if (conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role, // 'user' o 'assistant'
          content: msg.content
        });
      });
    }

    // Agregar mensaje actual
    messages.push({
      role: 'user',
      content: userMessage
    });

    // Llamar a Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages
    });

    const coachResponse = message.content[0].text;

    return res.status(200).json({
      success: true,
      response: coachResponse,
      timestamp: new Date().toISOString(),
      messageCount: messages.length + 1
    });

  } catch (error) {
    console.error('Error en coach virtual:', error);

    return res.status(500).json({
      success: false,
      error: 'Error en el coach virtual',
      message: error.message
    });
  }
}
