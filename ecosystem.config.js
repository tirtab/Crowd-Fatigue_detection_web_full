const { execSync } = require('child_process');
const path = require('path');

// Fungsi untuk mendapatkan path python dari environment anaconda
function getPythonPath(envName) {
  try {
    // Coba menggunakan conda info --base untuk mendapatkan base path
    const condaBase = execSync('conda info --base', { encoding: 'utf8', timeout: 5000 }).trim();
    const envPath = path.join(condaBase, 'envs', envName, 'bin', 'python');
    
    // Test apakah file exists dan executable
    try {
      execSync(`test -x "${envPath}"`, { encoding: 'utf8', timeout: 1000 });
      return envPath;
    } catch (testError) {
      console.log(`Python executable not found or not executable: ${envPath}`);
    }
  } catch (error) {
    console.log(`Conda not available or error getting base path: ${error.message}`);
  }
  
  try {
    // Fallback: coba menggunakan yang dari PATH dengan environment name
    const whichResult = execSync(`which ${envName}`, { encoding: 'utf8', timeout: 3000 }).trim();
    if (whichResult) {
      console.log(`Using ${envName} from PATH: ${whichResult}`);
      return whichResult;
    }
  } catch (whichError) {
    console.log(`Python for ${envName} not found in PATH`);
  }
  
  // Fallback terakhir: gunakan 'python' sebagai default
  console.log(`Falling back to system python for ${envName}`);
  return 'python';
}

module.exports = {
  apps : [
    // BACKEND NODE
    {
      name: "backend",
      cwd: "backend",
      script: "src/index.js",
      watch: false,
      env: {
        PORT: "4000",
        JWT_SECRET: "your_super_secret_jwt_key_here_make_it_long_and_random",
        DATABASE_URL: "postgresql://postgres:123456@localhost:5432/comvis",
        MQTT_BROKER: "mqtt://broker.hivemq.com:1883",
        MQTT_PORT: "1883"
      }
    },

    // FRONTEND VITE PRODUCTION
    {
      name: "frontend",
      cwd: "frontend",
      script: "npx",
      args: "serve -s dist -l 3000",
      watch: false,
      env: {
        VITE_APP_API_URL: "http://localhost:4000",
        VITE_APP_SOCKET_URL: "ws://localhost:4000",
        VITE_APP_BACKEND_URL: "http://localhost:4000"
      },
      env_production: {
        VITE_APP_API_URL: "http://localhost:4000",
        VITE_APP_SOCKET_URL: "ws://localhost:4000",
        VITE_APP_BACKEND_URL: "http://localhost:4000"
      }
    },

    // FLASK + MQTT (MICROSERVICE AI) - crowd & fatigue dengan path dinamis
    {
      name: "ai-service1",
      cwd: "ai-engine",
      script: getPythonPath("cnfd"),
      args: "app.py",
      watch: false
    },

  ]
}
