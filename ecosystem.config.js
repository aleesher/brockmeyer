module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // Brockmeyer Portal APP
    {
      name: "brockmeyer-app",
      script: "./server.js",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_brod: {
        ENV_FILE: ".env.production"
      },
      env_test: {
        ENV_FILE: ".env.test",
        PORT: 3002
      },
      env_acceptance: {
        ENV_FILE: ".env.acceptance"
      }
    },
    {
      name: "brockmeyer-production",
      script: "./server.js",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_brod: {
        ENV_FILE: ".env.production"
      },
      env_test: {
        ENV_FILE: ".env.test",
        PORT: 3002
      },
      env_acceptance: {
        ENV_FILE: ".env.acceptance"
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    brod: {
      user: "sebastiaan",
      host: "brockmeyer.secondcompany.nl",
      ref: "origin/production",
      repo: "git@gitlab.com:second-company/brockmeyer-portal.git",
      path: "/var/www/jobmarketingpro.brockmeyer.nl",
      "post-deploy":
        "yarn build && pm2 startOrRestart ecosystem.config.js --only brockmeyer-production --env brod"
    },
    test: {
      user: "sebastiaan",
      host: "brockmeyer.secondcompany.nl",
      ref: "origin/develop",
      repo: "git@gitlab.com:second-company/brockmeyer-portal.git",
      path: "/var/www/brockmeyer.secondcompany.nl",
      "post-deploy":
        "yarn build && pm2 startOrRestart ecosystem.config.js --only brockmeyer-app --env test"
    },
    acceptance: {
      user: "brockmeyer",
      host: "app.acc.brockmeyer.nl",
      ref: "origin/acceptance",
      repo: "git@gitlab.com:second-company/brockmeyer-portal.git",
      path: "/var/www/brockmeyer-portal",
      "post-deploy":
        "yarn build && pm2 startOrRestart ecosystem.config.js --only brockmeyer-app --env acceptance"
    }
  }
};
