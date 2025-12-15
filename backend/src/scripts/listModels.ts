import fetch from 'node-fetch';

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();
    
    console.log('Available Gemini models:');
    data.models?.forEach((model: any) => {
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log(`- ${model.name}`);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();