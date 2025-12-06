/**
 * Netlify Function: Guardar Datos en Google Sheets
 *
 * Guarda resultados de tests, análisis de CV, estadísticas de usuario
 * y otras métricas en Google Sheets para análisis y visualización.
 */

const { google } = require('googleapis');

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const {
      dataType,    // Tipo de dato: "test_result", "cv_analysis", "interview_simulation", "user_stats"
      data,        // Objeto con los datos a guardar
      userId       // ID del usuario (opcional)
    } = JSON.parse(event.body);

    if (!dataType || !data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Se requiere dataType y data'
        })
      };
    }

    // Configurar autenticación con Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID no configurado en variables de entorno');
    }

    // Determinar la hoja y los datos según el tipo
    let sheetName;
    let values;
    const timestamp = new Date().toISOString();

    switch (dataType) {
      case 'test_result':
        sheetName = 'Resultados de Tests';
        values = [[
          timestamp,
          userId || 'anónimo',
          data.testType || '',
          data.score || 0,
          data.totalQuestions || 0,
          data.correctAnswers || 0,
          data.timeSpent || 0,
          data.difficulty || '',
          data.passed ? 'Sí' : 'No'
        ]];
        break;

      case 'cv_analysis':
        sheetName = 'Análisis de CV';
        values = [[
          timestamp,
          userId || 'anónimo',
          data.score || 0,
          data.rating || '',
          data.targetJob || '',
          data.targetIndustry || '',
          data.wordCount || 0,
          JSON.stringify(data.strengths || []),
          JSON.stringify(data.weaknesses || [])
        ]];
        break;

      case 'interview_simulation':
        sheetName = 'Simulaciones de Entrevista';
        values = [[
          timestamp,
          userId || 'anónimo',
          data.jobArea || '',
          data.difficulty || '',
          data.questionsAnswered || 0,
          data.averageScore || 0,
          data.timeSpent || 0,
          JSON.stringify(data.competencies || [])
        ]];
        break;

      case 'user_stats':
        sheetName = 'Estadísticas de Usuario';
        values = [[
          timestamp,
          userId || 'anónimo',
          data.testsCompleted || 0,
          data.totalScore || 0,
          data.xp || 0,
          data.level || 1,
          data.badgesEarned || 0,
          data.streak || 0,
          data.lastActive || timestamp
        ]];
        break;

      case 'mentor_conversation':
        sheetName = 'Conversaciones con Mentor';
        values = [[
          timestamp,
          userId || 'anónimo',
          data.messageCount || 1,
          data.topic || 'general',
          data.userMessage?.substring(0, 100) || '',
          data.duration || 0
        ]];
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Tipo de dato no válido. Use: test_result, cv_analysis, interview_simulation, user_stats, mentor_conversation'
          })
        };
    }

    // Agregar datos a la hoja
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: values
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        dataType,
        sheetName,
        rowsAdded: response.data.updates.updatedRows || 1,
        savedAt: timestamp
      })
    };

  } catch (error) {
    console.error('Error guardando en Google Sheets:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Error al guardar datos en Google Sheets',
        message: error.message,
        hint: 'Verifica que GOOGLE_SERVICE_ACCOUNT y GOOGLE_SHEET_ID estén configurados correctamente'
      })
    };
  }
};
