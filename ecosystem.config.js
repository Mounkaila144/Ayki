module.exports = {
  apps: [
    {
      name: 'ayki-backend',
      cwd: './ayki_backend',
      script: 'dist/src/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3002
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: '/var/log/pm2/ayki-backend-error.log',
      out_file: '/var/log/pm2/ayki-backend-out.log',
      log_file: '/var/log/pm2/ayki-backend-combined.log',
      time: true
    },
    {
      name: 'ayki-frontend',
      cwd: './',
      script: 'npm',
      args: 'run start',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'development',
        PORT: 3003
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: '/var/log/pm2/ayki-frontend-error.log',
      out_file: '/var/log/pm2/ayki-frontend-out.log',
      log_file: '/var/log/pm2/ayki-frontend-combined.log',
      time: true
    }
  ],

  deploy: {
    production: {
      user: 'www-data',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'https://github.com/your-username/ayki-frontend.git',
      path: '/var/www/ayki',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};